import {spawn} from 'child_process';

export default function Execute (commands, options, bar) {
    this.commands = commands;
    this.options = options;
    this.start = 90/300;
    this.bar = bar;
    bar.update(90/300)
    this.speed = Math.round((108 / commands.length) * 10) / 10;
}

Execute.prototype.execCommands = async function () {
    for await (let command of this.commands) {
        let executed = await execCommand(command.command, this.bar);
        console.log(executed)
        if (executed)
            await execCommand('rm ' + this.options.source + '/' + command.item, this.bar);

        this.start += this.speed/300;
        this.bar.update(this.start);
    }
}

Execute.prototype.move = async function () {
    let command  = 'rclone move ' + this.options.source + '/ffmpeg media:' + this.options.destination;
    return execCommand(command, this.bar)
}

const execCommand = async (command, bar) => {
    let params = command.split(' ');
    let host = params[0];
    params.shift();
    bar.show(command);
    return new Promise(resolve => {
        const exec = spawn(host, params);

        exec.stderr.on('data', (data) => {
            bar.show(`${data}`);
            resolve(false);
        });

        exec.on('close', () => {
            resolve(true);
        });
    })
}