import { Options } from "./mover-cli";
export default class Handler {
    private source;
    private readonly options;
    constructor(options: Options);
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
