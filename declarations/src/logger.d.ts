import { Options } from "./mover-cli";
export default class Logger {
    private readonly verbose;
    private readonly bar;
    constructor(answers: Options);
    show(info: any): void;
    update(number: number): void;
    startItem(number: string): void;
    itemDone(number: string): void;
    done(): Promise<void>;
}
