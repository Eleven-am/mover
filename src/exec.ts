import {spawn} from 'child_process';
import {Options} from "./mover-cli";

export default class Execute {
    private readonly options: Options;
    private readonly commands: {item: string, command: string}[];

    constructor(options: Options, commands: {item: string, command: string}[]) {
        this.options = options;
        this.commands = commands;
    }

    async execCommand (command: string) {
        let params = command.split(' ');
        let host = params[0];
        params.shift();
        //bar.show(command);
        return new Promise(resolve => {
            const exec = spawn(host, params);

            exec.stderr.on('data', (data) => {
                //bar.show(`${data}`);
                resolve(false);
            });

            exec.on('close', () => {
                resolve(true);
            });
        })
    }

    async move () {
        let command  = 'rclone move ' + this.options.source + '/ffmpeg media:' + this.options.destination;
        let execute = await this.execCommand(command);
        if (execute)
            return await this.execCommand('rm -r ' + this.options.source + '/ffmpeg');
    }

    async execCommands() {
        for await (let command of this.commands) {
            if (this.options.extension === 'mp4' && command.item.endsWith('mp4'))
                await this.execCommand('mv ' + this.options.source + '/' + command.item + ' ' + this.options.source + '/ffmpeg');

            else {
                let executed = await this.execCommand(command.command);
                if (executed)
                    await this.execCommand('rm ' + this.options.source + '/' + command.item);
            }
        }
    }
}