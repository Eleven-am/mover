export interface Options {
    move: boolean;
    source: string | boolean;
    verbose: boolean;
    destination: string | boolean;
    extension: string | boolean;
}
export declare function cli(args: string[]): Promise<void>;
