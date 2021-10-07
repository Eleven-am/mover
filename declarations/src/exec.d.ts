import { Options } from "./mover-cli";
import Logger from "./logger";
export default class Execute {
    private start;
    private readonly bar;
    private readonly options;
    private readonly commands;
    private readonly speed;
    constructor(options: Options, commands: {
        item: string;
        command: string;
    }[], bar: Logger);
    execCommand(command: string): Promise<boolean>;
    move(): Promise<boolean>;
    execCommands(): Promise<void>;
}
