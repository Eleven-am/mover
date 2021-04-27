import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';

export default function Ffmpeg(folder, bar) {
    this.folder = folder;
    this.bar = bar;
    this.speed = Math.round((61 / folder.length) * 10) / 10;
}

Ffmpeg.prototype.probe = async function (file) {
    return new Promise((resolve, reject) => {
        ffprobe(file, {path: ffprobeStatic.path})
            .then(function (info) {
                resolve(info);
            }).catch(err => reject(err))
    })
}

Ffmpeg.prototype.probeFolder = async function (options) {
    let commands = [];
    let start = 20/300;
    for (let item of this.folder) {
        let file = options.source + '/' + item;
        let probe = await this.probe(file);
        probe = probe.streams.map(stream => {
            return {
                index: stream.index,
                codec_type: stream.codec_type,
                codec_name: stream.codec_name,
                language: stream.tags.language,
                title: stream.tags.title,
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

        probe = {audio, video, subtitles};
        let command = this.build(probe, item, length, options);
        if (command !== false)
            commands.push({command, item});

        start += this.speed/300;
        this.bar.update(start);
    }

    return commands;
}

Ffmpeg.prototype.build = function (probe, file, length, options) {
    let command = 'ffmpeg -loglevel error -hide_banner -i ' + options.source + '/' + file + ' ';
    let h264 = probe.video.every(item => item.codec_name === 'h264');

    if (!h264)
        return false;

    let aacAc3 = probe.audio.every(item => item.codec_name === 'aac' || item.codec_name === 'ac3');
    let audioMap = probe.audio.length > 1;
    let subMap = probe.subtitles.length > 1;

    let audio;
    let video = '-c:v ' + (h264 ? 'copy' : 'libx264') + ' ';
    video = length.video === probe.video.length ? ['', video]: ['-map 0:v', video];

    if (audioMap) {
        let indexes = probe.audio.filter(item => item.codec_name === 'aac' || item.codec_name === 'ac3').map(item => item.index);
        let outIndexes = probe.audio.filter(item => item.codec_name !== 'aac' && item.codec_name !== 'ac3').map(item => item.index);

        let map = indexes.map(item => '-map 0:' + item).join(' ') + ' ';
        map += outIndexes.map(item => '-map 0:' + item).join(' ') + ' ';

        let codec = '';
        for (let i = 0; i < indexes.length; i++)
            codec += '-c:a:' + i + ' copy ';

        for (let i = indexes.length; i < indexes.length + outIndexes.length; i++)
            codec += '-c:a:' + i + ' aac ';

        audio = [map, codec];
    } else if (aacAc3) {
        audio = probe.audio.length === length.audio ? ['', '-c:a copy '] : ['-map 0:'+ probe.audio[0].index+ ' ', '-c:a:0 copy '];

    } else
        audio = probe.audio.length === length.audio ? ['', '-c:a aac ']: ['-map 0:'+ probe.audio[0].index+ ' ', '-c:a:0 aac '];

    let subtitle = subMap ? ['-map 0:s? ', '-c:s mov_text ']: ['', '-c:s mov_text '];
    let output = file.replace(options.extension, 'mp4');
    output = options.source + '/ffmpeg/' + output;
    command += video[0] + audio[0] + subtitle[0] + video[1] + audio[1] + subtitle[1] + output;
    return command;
}