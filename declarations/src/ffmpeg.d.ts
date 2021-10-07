import ffprobe from 'ffprobe';
import { Options } from "./mover-cli";
interface Codecs {
    index: number;
    codec_type: "video" | "audio" | "images" | "subtitle" | undefined;
    codec_name: string | undefined;
    language: string | undefined;
    title: string | undefined;
    codec_long_name: string | undefined;
}
export default class Ffmpeg {
    private readonly files;
    private readonly options;
    constructor(options: Options, files: string[]);
    probe(file: string): Promise<ffprobe.FFProbeResult | null>;
    probeFolder(): Promise<{
        item: string;
        command: string;
    }[]>;
    build(file: string, probe: {
        audio: Codecs[];
        video: Codecs[];
        subtitles: Codecs[];
    }, length: {
        audio: number;
        video: number;
    }): string | false;
}
export {};
