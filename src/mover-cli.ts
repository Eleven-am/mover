import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';
import Handler from "./handler";
import Logger from "./logger";
import Execute from "./exec";
import Ffmpeg from "./ffmpeg";

export interface Options {
    move: boolean,
    source: string | boolean,
    verbose: boolean,
    destination: string | boolean,
    extension: string | boolean
}

const stringToArgs = (rawArgs: string[]) => {
    const args = arg(
        {
            '--directory': String,
            '--params': String,
            '--folder': String,
            '--ext': String,
            '--move': Boolean,
            '--verbose': Boolean,
            '-v': '--verbose',
            '-m': '--move',
            '-e': '--ext',
            '-d': '--folder',
            '-s': '--directory',
            '-p': '--params'
        }, {
            argv: rawArgs.slice(2)
        }
    );
    return {
        extension: args['--ext'] || false,
        directory: args['--directory'] || false,
        folder: args['--folder'] || false,
        move: args['--move'] || false,
        verbose: args['--verbose'] || false,
        params: args['--params'],
    }
}

async function fixArgs(options: { extension: string | boolean; move: boolean; folder: string | boolean; params: string | undefined; directory: string | boolean; verbose: boolean }) {
    let questions = [];
    let {move, verbose, directory: source, folder: destination, extension} = options;
    let answers = {move, source, verbose, destination, extension};
    let bar = new Logger(answers);
    try{
        let handler = new Handler(answers, bar);
        while (options.directory === false || options.directory === 'file') {
            questions.push({
                type: 'input',
                name: 'source',
                message: 'please enter a source folder',
                default: '/home/maix/Downloads'
            });

            answers = {...answers, ...await inquirer.prompt(questions)};
            handler = new Handler(answers, bar);
            options.directory = await handler.confirm();
            questions = [];
        }
    } catch (e) {}

    if (!options.folder)
        questions.push({
            type: 'input',
            name: 'destination',
            message: 'please enter a destination folder',
            default: 'nzbDownload'
        });

    if (!options.extension)
        questions.push({
            type: 'list',
            name: 'extension',
            message: 'please enter a filtered file extension',
            choices: ['mkv', 'mp4', 'avi', 'mov'],
            default: 'mkv'
        });
    else

        answers = {...answers, ...await inquirer.prompt(questions)};
    if (typeof answers.source === 'string' && answers.source.charAt(0) !== '/')
        answers.source = path.join(process.cwd(), answers.source)

    return {answers, bar: new Logger(answers)};
}

export async function cli(args: string[]) {
    let options = stringToArgs(args);
    let {answers, bar} = await fixArgs(options);

    bar.activate();
    bar.show(answers);

    bar.update(0);
    bar.startItem('moving files');
    const handler = new Handler(answers, bar)
    let data = await handler.moveOut();

    bar.update(20/300);
    bar.itemDone('moving files');
    const ffmpeg = new Ffmpeg(answers, data.files, bar);
    bar.startItem('probing files');
    let commands = await ffmpeg.probeFolder();
    bar.itemDone('probing files');
    bar.startItem('converting files');

    let exec = new Execute(answers, commands, bar);
    await exec.execCommands();
    bar.itemDone('converting files');
    bar.update(200/300);
    bar.startItem('moving files with rclone');
    await exec.move();
    bar.update(300/300);
    bar.itemDone('moving files with rclone');
    await bar.done();
}