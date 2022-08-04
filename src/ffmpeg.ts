import ffprobe, {FFProbeResult} from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import {Options} from "./mover-cli";
import Logger from "./logger";

interface Codecs {
    index: number,
    codec_type: "video" | "audio" | "images" | "subtitle" | undefined,
    codec_name: string | undefined,
    language: string | undefined,
    title: string | undefined,
    codec_long_name: string | undefined
}

export default class Ffmpeg {
    private readonly files: string[];
    private readonly options: Options;
    private readonly bar: Logger;
    private readonly speed: number;

    constructor(options: Options, files: string[], bar: Logger) {
        this.speed = Math.round((61 / files.length) * 10) / 10;
        this.options = options;
        this.files = files;
        this.bar = bar;
    }

    async probe(file: string) {
        return new Promise<FFProbeResult | null>((resolve) => {
            ffprobe(file, {path: ffprobeStatic.path})
                .then(function (info) {
                    resolve(info);
                }).catch(_ => resolve(null))
        })
    }

    async probeFolder() {
        let commands: { item: string, command: string }[] = [];
        let start = 20/300;
        for (let item of this.files) {
            let file = this.options.source + '/' + item;
            let res = await this.probe(file);

            if (res === null)
                continue;

            let probe: Codecs[] = res.streams.map(stream => {
                return {
                    index: stream.index,
                    codec_type: stream.codec_type,
                    codec_name: stream.codec_name,
                    language: stream.tags ? stream.tags.language : 'eng',
                    title: stream.tags ? stream.tags.title : undefined,
                    codec_long_name: stream.codec_long_name,
                }
            });

            let video = probe.filter(stream => stream.codec_type === 'video');
            let audio = probe.filter(stream => stream.codec_type === 'audio');
            let subtitles = probe.filter(stream => stream.codec_type === 'subtitle');
            let length = {audio: audio.length, video: video.length};

            let temp = video.filter(stream => stream.language === 'eng');
            video = temp.length ? temp : video;

            temp = audio.filter(stream => stream.language === 'eng');
            audio = temp.length ? temp : audio;

            const codecs = {audio, video, subtitles};
            let command = this.build(item, codecs, length);
            if (command !== false)
                commands.push({command, item});

            this.bar.show('probing ' + item);
            start += this.speed/300;
            this.bar.update(start);
        }

        return commands;
    }

    build(file: string, probe: { audio: Codecs[], video: Codecs[], subtitles: Codecs[] }, length: { audio: number, video: number }) {
        let command = 'ffmpeg -loglevel error -hide_banner -i ' + this.options.source + '/' + file + ' ';
        let h264 = probe.video.every(item => item.codec_name === 'h264');

        if (!h264) {
            this.bar.show('skipping '+ file)
            return false;
        }

        let aacAc3 = probe.audio.every(item => item.codec_name === 'aac' || item.codec_name === 'ac3' || item.codec_name === 'eac3');
        let subCheck = probe.subtitles.some(item => item.codec_name = 'hdmv_pgs_subtitle');
        let audioMap = probe.audio.length > 1;

        let audio;
        let video = ['-map 0:v ', '-c:v ' + (h264 ? 'copy' : 'libx264') + ' '];
        if (audioMap) {
            let indexes = probe.audio.filter(item => item.codec_name === 'aac' || item.codec_name === 'ac3' || item.codec_name === 'eac3').map(item => item.index);
            let outIndexes = probe.audio.filter(item => item.codec_name !== 'aac' && item.codec_name !== 'ac3' && item.codec_name !== 'eac3').map(item => item.index);

            let map = indexes.map(item => '-map 0:' + item).join(' ') + ' ';
            map += outIndexes.map(item => '-map 0:' + item).join(' ') + ' ';

            let codec = '';
            for (let i = 0; i < indexes.length; i++)
                codec += '-c:a:' + i + ' copy ';

            for (let i = indexes.length; i < indexes.length + outIndexes.length; i++)
                codec += '-c:a:' + i + ' aac ';

            audio = [map, codec];
        } else if (aacAc3) {
            audio = probe.audio.length === length.audio ? ['-map 0:a? ', '-c:a copy '] : ['-map 0:' + probe.audio[0].index + ' ', '-c:a:0 copy '];

        } else
            audio = probe.audio.length === length.audio ? ['-map 0:a? ', '-c:a aac '] : ['-map 0:' + probe.audio[0].index + ' ', '-c:a:0 aac '];

        let subtitle = subCheck ? ['', ''] : ['-map 0:s? ', '-c:s mov_text '];
        let output = file.replace(this.options.extension as string, 'mp4');
        output = this.options.source + '/ffmpeg/' + output;
        command += audio[0] + subtitle[0] + video[0] + video[1] + audio[1] + subtitle[1] + output;
        return command;
    }
}
