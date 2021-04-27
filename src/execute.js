import {spawn} from 'child_process';

export default function Execute (commands, options) {
    this.commands = commands;
    this.options = options;
}

Execute.prototype.execCommands = async function () {
    let command = this.commands[0];
    await this.commands.shift();
    let executed = await execCommand(command.command);
    if (executed)
        await execCommand('rm ' + this.options.source + '/' + command.item);

    if (this.commands.length)
        setTimeout(async () => {
            await this.execCommands();
        }, 2000)

    else
        return executed;
}

Execute.prototype.move = async () => {
    let command  = 'rclone move ' + this.options.source + ' media: ' + this.options.destination;
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