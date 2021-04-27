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
    let command = this.commands[0];
    await this.commands.shift();
    let executed = await execCommand(command.command);
    if (executed){}
        //await execCommand('rm ' + this.options.source + '/' + command.item);

    else
        return executed;

    if (this.commands.length)
        setTimeout(async () => {
            this.start += this.speed/300;
            this.bar.update(this.start);
            await this.execCommands();
        }, 2000)

    else
        return executed;
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