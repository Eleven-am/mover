import fs from 'fs';
import {promisify} from 'util';
import path from "path";
import {Options} from "./mover-cli";
import rename from 'locutus/php/strings/strtr';
import Logger from "./logger";

let dicDo = {
    " (1080p HD).m4v": "", " (HD).m4v": "", " (4K).m4v": "",
    "_": "", ".mp4": "", ".m4v": "", "-": "", "264": "",
    "1080p": "", "BluRay": "", "YIFY": "", "x264": "", "HDDVD": "",
    "BrRip": "", "[": "", "]": "", "AG": "", "AM": "",
    "YTS": "", "AAC5.1": "", "MX": "", "LT": "", "2011": "",
    "ECE": "", "bitloks": "", "Extended": "", "Bluray": "", "WEB": "",
    "+HI": "", "WEBRip": "", "BRrip": "", "GAZ": "", "720p": "",
    "1968": "", "AAC": "", "ExD": "", "THEATRICAL": "", "EDITION": "",
    "(": "", ")": "", "2160p": "", "4K": "", "x265": "", "10bit": "",
    "EXTENDED": "", "RARBG": "", "anoXmous": "", "FLAC": "",
    "Deceit": "", "BOKUTOX": "", " ( FIRST TRY)": "", "IMAX": "",
    "UNRATED": "", "BrRIp": "", "AAC2": "", "0PRiNCE": "", "Brrip": "",
    ".": " ", "Directors Cut": "", "DIRECTORS.CUT": "", ".mkv": "", ".avi": ""
};

const readdir = promisify(fs.readdir);
const renameFile = promisify(fs.rename);
const stats = promisify(fs.lstat);

export default class Handler {
    private source: string;
    private readonly options: Options;
    private readonly bar: Logger;

    constructor(options: Options, bar: Logger) {
        this.bar = bar;
        this.options = options;
        if (typeof options.source !== 'boolean')
            this.source = options.source;
        else throw new Error('No directory provided');
    }

    async confirm(): Promise<boolean | string> {
        if (this.source) {
            this.source = this.source.charAt(0) !== '/' ? path.join(process.cwd(), this.source) : this.source;
            let response = await this.exists();
            if (response) {
                let response = '';
                const stat = await stats(this.source);
                if (stat.isFile())
                    response = 'file';
                else
                    response = this.source.replace(/\/$/, '');

                return response;
            }
        }

        return false;
    }

    async exists(source?: string) {
        source = source || this.source;
        return new Promise<boolean>((resolve) => {
            fs.access(source!, (err) => {
                if (!err)
                    resolve(true);

                else
                    resolve(false);
            });
        });
    }

    async createDir() {
        return new Promise<boolean>(async (resolve) => {
            let exists = await this.exists(this.source + '/ffmpeg');
            if (!exists)
                fs.mkdir(this.source + '/ffmpeg', err => {
                    if (err) {
                        this.bar.show(err);
                        resolve(false);
                    }
                })
            resolve(true);
        })
    }

    async moveOut () {
        await this.createDir();
        this.options.move ? await this.move() : await this.renameFiles();
        let files = await readdir(this.source);
        files = files.filter(item => item.charAt(0) !== '.');
        files = files.filter(item => item.endsWith(this.options.extension as string));
        let string = 'move option is ' + (this.options.move ? '' : 'de') + 'activated';
        this.bar.show(string);
        return {info: true, files};
    }

    async move(folder?: string) {
        folder = folder || this.source;
        let files = await readdir(folder);
        files = files.filter(item => item.charAt(0) !== '.');
        let realFiles = [];

        for (let file of files) {
            let temp = folder + '/' + file
            const stat = await stats(temp);
            if (!stat.isFile())
                await this.move(temp);
            else
                realFiles.push('/' + file);
        }

        realFiles = realFiles.filter(item => item.endsWith(this.options.extension as string));

        for (let realFile of realFiles) {
            let name: string = rename(realFile, dicDo);
            const ext = path.extname(realFile);
            let matches: any = name.match(/s(?<season>\d+).*?e(?<episode>\d+)/i);
            if (matches === null) {
                if (/\d{3}\s/.test(name) && !/\d{2}\s/.test(name))
                    matches = name.match(/(?<season>\d)(?<episode>\d{2})/);

                else {
                    matches = name.match(/(\d{2})\s/g);
                    let index = matches && matches.length ? /^\d{2}\s/.test(name) ? 0 : matches.length - 1 : 0;
                    matches = matches && matches.length ? {groups: {episode: matches[index].replace(/\s/, '')}} : null;
                }
            }

            const match: {groups: {season?: string, episode?: string}} | null = matches;
            const fileName = match? `Season-S${match.groups.season || '??'}-Episode-E${match.groups.episode}`: realFile.replace(/\[.*?]\s*|-|\(.*?\)/g, '').replace(/\s+/g, '.').replace(/\.{2,}/, '.');
            const file = this.source + '/' + fileName + ext;
            this.bar.show('moving ' + realFile);
            await renameFile(folder + '/' + realFile, file);
        }
    }

    async renameFiles (folder?: string, destination?: string) {
        folder = folder || this.source;
        destination = destination || this.source;
        let files = await readdir(folder);
        files = files.filter(item => item.charAt(0) !== '.');
        files = files.filter(item => item.endsWith(this.options.extension as string));

        for (let file of files){
            let temp = folder + '/' + file;
            file = destination + '/' + file.replace(/\[.*?]\s*|-|\(.*?\)/g, '').replace(/\s+/g, '.').replace(/\.{2,}/, '.');
            await renameFile(temp, file);
        }
    }
}