import {spawn} from 'child_process';
import {Options} from "./mover-cli";
import Logger from "./logger";

export default class Execute {
    private start: number;
    private readonly bar: Logger;
    private readonly options: Options;
    private readonly commands: {item: string, command: string}[];
    private readonly speed: number;

    constructor(options: Options, commands: {item: string, command: string}[], bar: Logger) {
        this.bar = bar;
        this.options = options;
        this.commands = commands;
        this.start = 90 / 300;
        this.bar = bar;
        this.bar.update(90 / 300);
        this.speed = Math.round((108 / commands.length) * 10) / 10;
    }

    async execCommand (command: string) {
        let params = command.split(' ');
        let host = params[0];
        params.shift();
        this.bar.show(command);
        return new Promise<boolean>(resolve => {
            const exec = spawn(host, params);

            exec.stderr.on('data', (data) => {
                this.bar.show(`${data}`);
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

        return false;
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

            this.start += this.speed / 300;
            this.bar.update(this.start);
        }
    }
}