import arg from 'arg';
import inquirer from 'inquirer';
import path from 'path';
import Handler from './move';
import Ffmpeg from "./ffmpeg";
import Execute from "./execute";
const {terminal} = require( 'terminal-kit' );

const stringToArgs = rawArgs => {
    const args = arg(
        {
            '--directory': String,
            '--params': String,
            '--folder': String,
            '--ext': String,
            '--move': Boolean,
            '-m': '--move',
            '-e': '--ext',
            '-d': '--folder',
            '-s': '--directory',
            '-p': '--params'
        },{
            argv: rawArgs.slice(2),
        }
    );
    return {
        extension: args['--ext'] || false,
        directory: args['--directory'] || false,
        folder: args['--folder'] || false,
        move: args['--move'] || false,
        params: args['--params'],
    }
}

const fixArgs = async options => {
    let questions = [];
    let answers = {};
    let handler = new Handler(options.directory);
    answers.move = options.move;
    answers.source = options.directory = await handler.confirm();
    while (options.directory === false || options.directory === 'file') {
        questions.push({
            type: 'input',
            name: 'source',
            message: 'please enter a source folder',
            default: '/home/maix/Downloads'
        });

        answers = {...answers, ...await inquirer.prompt(questions)};
        handler = new Handler(answers.source);
        options.directory = await handler.confirm();
        questions = [];
    }

    if (!options.folder)
        questions.push({
            type: 'input',
            name: 'destination',
            message: 'please enter a destination folder',
            default: 'nzbDownload'
        });
    else
        answers.destination = options.folder;

    if (!options.extension)
        questions.push({
            type: 'list',
            name: 'extension',
            message: 'please enter a filtered file extension',
            choices: ['mkv', 'avi', 'mov'],
            default: 'mkv'
        });
    else
        answers.extension = options.extension;

    answers = {...answers, ...await inquirer.prompt(questions)};
    if (answers.source.charAt(0) !== '/')
        answers.source = path.join(process.cwd(), answers.source)

    return {answers, handler};
}

export async function cli(args){
    let options = stringToArgs(args);
    let {answers, handler} = await fixArgs(options);
    const bar = terminal.progressBar({
        title: 'progress:',
        eta: true,
        percent: true,
        items: 4
    });

    bar.update(0);
    bar.startItem('moving files');
    let data = await handler.move(answers);

    if (data.info !== false) {
        bar.update(20/300);
        bar.itemDone('moving files');
        const ffmpeg = new Ffmpeg(data.files, bar);
        bar.startItem('probing files');
        let commands = await ffmpeg.probeFolder(answers);
        bar.itemDone('probing files');
        bar.startItem('converting files');
        let exec = new Execute(commands, answers, bar);
        await exec.execCommands();
        bar.itemDone('converting files');
        bar.update(200/300);
        bar.startItem('moving files with rclone');
        await exec.move();
        bar.update(300/300);
        bar.itemDone('moving files with rclone');
        setTimeout( function() {
            terminal('\n');
            process.exit();
        } , 200 ) ;
    }
}