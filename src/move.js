import fs from 'fs';
import {promisify} from 'util';
import path from "path";
import rename from 'locutus/php/strings/strtr';

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

export default function Handler(item) {
    if (item)
        this.item = item;
}

Handler.prototype.exists = async function (item) {
    item = item || this.item;
    return new Promise((resolve) => {
        fs.access(item, (err) => {
            if (!err)
                resolve(true);

            else
                resolve(false);
        });
    });
}

Handler.prototype.confirm = async function () {
    if (this.item) {
        this.item = this.item.charAt(0) !== '/' ? path.join(process.cwd(), this.item) : this.item;
        let response = await this.exists(this.item);
        if (response) {
            const stat = await stats(this.item);
            if (stat.isFile())
                response = 'file';
            else
                response = this.item.replace(/\/$/, '');

        }
        return response;
    }
    return false;
}

Handler.prototype.move = async function (options, bar) {
    await this.createDir(bar);
    options.move ? await move(options, this.item, bar) : true;
    let files = await readdir(this.item)
    files = files.filter(item => item.charAt(0) !== '.');
    files = files.filter(item => item.endsWith(options.extension));
    let string = 'move option is ' + (options.move ? '' : 'de') + 'activated';
    bar.show(string);
    return {info: true, files};
}

Handler.prototype.createDir = async function (bar) {
    return new Promise(async (resolve) => {
        let exists = await this.exists(this.item + '/ffmpeg');
        if (!exists)
            fs.mkdir(this.item + '/ffmpeg', err => {
                if (err) {
                    bar.show(err)
                    resolve(false);
                }
            })
        resolve(true);
    })
}

const move = async function (options, item, bar, hold) {
    hold = hold || item;
    if (item !== false && item !== 'file') {
        let files = await readdir(item);
        files = files.filter(item => item.charAt(0) !== '.');
        let realFiles = [];

        for (let file of files) {
            file = item + '/' + file
            const stat = await stats(file);
            if (!stat.isFile())
                await move(options, file, bar, hold);
            else
                realFiles.push(file.replace(item, ''));
        }

        realFiles = realFiles.filter(item => item.endsWith(options.extension))
        for (let realFile of realFiles) {
            let name = rename(realFile, dicDo);
            const ext = path.extname(realFile).replace(/^\./, '');
            let matches = name.match(/s(?<season>\d+).*?e(?<episode>\d+)/i);
            if (matches === null) {
                if (/\d{3}\s/.test(name) && !/\d{2}\s/.test(name))
                    matches = name.match(/(?<season>\d)(?<episode>\d{2})/);

                else {
                    matches = name.match(/(\d{2})\s/g);
                    let index = matches && matches.length ? /^\d{2}\s/.test(name) ? 0 : matches.length - 1 : 0;
                    matches = matches && matches.length ? {groups: {episode: parseInt(matches[index].replace(/\s/, ''))}} : null;
                }
            }

            if (matches && realFiles.length === 1) {
                bar.show('moving ' + realFile);
                console.log(item + realFile, hold + realFile.replace(/\[.*?]\s*|-|\(.*?\)\s*|/g, '').replace(/\s*/, '.'))
                //await renameFile(item + realFile, hold + realFile.replace(/\[.*?]\s*|-|\(.*?\)\s*|/g, '').replace(/\s*/, '.'));
                return true;

            } else {
                if (item !== hold) {
                    if (realFiles.length > 1) {
                        bar.show(realFile + ' already in source directory');
                        return false;

                    } else {
                        let base = path.basename(item);
                        bar.show('moving ' + realFile);
                        console.log(item + realFile, hold + base.replace(/\[.*?]\s*|-|\(.*?\)\s*/g, '').replace(/\s*/, '.') + '.' + ext)
                        //await renameFile(item + realFile, hold + base.replace(/\[.*?]\s*|-|\(.*?\)\s*/g, '').replace(/\s*/, '.') + '.' + ext);
                        return true;
                    }
                }
            }
        }
    }
}
