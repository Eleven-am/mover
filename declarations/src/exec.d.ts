import { Options } from "./mover-cli";
export default class Execute {
    private readonly options;
    private readonly commands;
    constructor(options: Options, commands: {
        item: string;
        command: string;
    }[]);
    execCommand(command: string): Promise<unknown>;
    move(): Promise<unknown>;
    execCommands(): Promise<void>;
}
