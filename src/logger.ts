import {Options} from "./mover-cli";
const terminal = require('terminal-kit').terminal;

export default class Logger {
    private readonly verbose: boolean;
    private bar: any;

    constructor(answers: Options) {
        this.verbose = answers.verbose
        this.bar = null;
    }

    activate() {
        this.bar = !this.verbose ? terminal.progressBar({
            title: 'progress:',
            eta: true,
            percent: true,
            items: 4
        }) : null;
    }

    show(info: any) {
        if (this.verbose)
            console.log(info);
    }

    update(number: number) {
        if (this.bar)
            this.bar.update(number);

        else
            this.show(number);
    }

    startItem(number: string) {
        if (this.bar)
            this.bar.startItem(number);

        else
            this.show('starting: ' + number);
    }

    itemDone(number: string) {
        if (this.bar)
            this.bar.itemDone(number);

        else
            this.show('done: ' + number);
    }

    async done() {
        if (this.bar)
            process.exit(1);

        else
            this.show('process completed');
    }
}