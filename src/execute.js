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
    return new Promise(async function (resolve)  {
        let command = this.commands[0];
        await this.commands.shift();
        let executed = await execCommand(command.command);
        if (executed)
            await execCommand('rm ' + this.options.source + '/' + command.item);

        if (this.commands.length > 0)
            setTimeout(async () => {
                this.start += this.speed/300;
                this.bar.update(this.start);
                resolve(await this.execCommands());
            })
        else
            resolve(this.commands.length > 0)
    })
}

Execute.prototype.move = async function () {
    let command  = 'rclone move ' + this.options.source + ' media:' + this.options.destination;
    return execCommand(command)
}

const execCommand = async command => {
    let params = command.split(' ');
    let host = params[0];
    params.shift();
    return new Promise(resolve => {
        const exec = spawn(host, params);

        exec.stderr.on('data', (data) => {
            console.log(`${data}`);
            resolve(false);
        });

        exec.on('close', () => {
            resolve(true);
        });
    })
}