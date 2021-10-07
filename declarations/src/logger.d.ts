import { Options } from "./mover-cli";
export default class Logger {
    private readonly verbose;
    private bar;
    constructor(answers: Options);
    activate(): void;
    show(info: any): void;
    update(number: number): void;
    startItem(number: string): void;
    itemDone(number: string): void;
    done(): Promise<void>;
}
