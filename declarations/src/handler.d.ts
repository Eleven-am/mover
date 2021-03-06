import { Options } from "./mover-cli";
import Logger from "./logger";
export default class Handler {
    source: string;
    private readonly options;
    private readonly bar;
    constructor(options: Options, bar: Logger, setup?: boolean);
    confirm(): Promise<boolean | string>;
    exists(source?: string): Promise<boolean>;
    createDir(): Promise<boolean>;
    moveOut(): Promise<{
        info: boolean;
        files: string[];
    }>;
    move(folder?: string): Promise<void>;
    renameFiles(folder?: string, destination?: string): Promise<void>;
}
