"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ffprobe_1 = __importDefault(require("ffprobe"));
var ffprobe_static_1 = __importDefault(require("ffprobe-static"));
var Ffmpeg = /** @class */ (function () {
    function Ffmpeg(options, files, bar) {
        this.speed = Math.round((61 / files.length) * 10) / 10;
        this.options = options;
        this.files = files;
        this.bar = bar;
    }
    Ffmpeg.prototype.probe = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        (0, ffprobe_1.default)(file, { path: ffprobe_static_1.default.path })
                            .then(function (info) {
                            resolve(info);
                        }).catch(function (_) { return resolve(null); });
                    })];
            });
        });
    };
    Ffmpeg.prototype.probeFolder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commands, start, _a, _b, item, file, res, probe, video, audio, subtitles, length_1, temp, codecs, command, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        commands = [];
                        start = 20 / 300;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(this.files), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        item = _b.value;
                        file = this.options.source + '/' + item;
                        return [4 /*yield*/, this.probe(file)];
                    case 3:
                        res = _d.sent();
                        if (res === null)
                            return [3 /*break*/, 4];
                        probe = res.streams.map(function (stream) {
                            return {
                                index: stream.index,
                                codec_type: stream.codec_type,
                                codec_name: stream.codec_name,
                                language: stream.tags ? stream.tags.language : 'eng',
                                title: stream.tags ? stream.tags.title : undefined,
                                codec_long_name: stream.codec_long_name,
                            };
                        });
                        video = probe.filter(function (stream) { return stream.codec_type === 'video'; });
                        audio = probe.filter(function (stream) { return stream.codec_type === 'audio'; });
                        subtitles = probe.filter(function (stream) { return stream.codec_type === 'subtitle'; });
                        length_1 = { audio: audio.length, video: video.length };
                        temp = video.filter(function (stream) { return stream.language === 'eng'; });
                        video = temp.length ? temp : video;
                        temp = audio.filter(function (stream) { return stream.language === 'eng'; });
                        audio = temp.length ? temp : audio;
                        codecs = { audio: audio, video: video, subtitles: subtitles };
                        command = this.build(item, codecs, length_1);
                        if (command !== false)
                            commands.push({ command: command, item: item });
                        this.bar.show('probing ' + item);
                        start += this.speed / 300;
                        this.bar.update(start);
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, commands];
                }
            });
        });
    };
    Ffmpeg.prototype.build = function (file, probe, length) {
        var command = 'ffmpeg -loglevel error -hide_banner -i ' + this.options.source + '/' + file + ' ';
        var h264 = probe.video.every(function (item) { return item.codec_name === 'h264'; });
        if (!h264) {
            this.bar.show('skipping ' + file);
            return false;
        }
        var aacAc3 = probe.audio.every(function (item) { return item.codec_name === 'aac' || item.codec_name === 'ac3' || item.codec_name === 'eac3'; });
        var subCheck = probe.subtitles.some(function (item) { return item.codec_name = 'hdmv_pgs_subtitle'; });
        var audioMap = probe.audio.length > 1;
        var audio;
        var video = ['-map 0:v ', '-c:v ' + (h264 ? 'copy' : 'libx264') + ' '];
        if (audioMap) {
            var indexes = probe.audio.filter(function (item) { return item.codec_name === 'aac' || item.codec_name === 'ac3' || item.codec_name === 'eac3'; }).map(function (item) { return item.index; });
            var outIndexes = probe.audio.filter(function (item) { return item.codec_name !== 'aac' && item.codec_name !== 'ac3' && item.codec_name !== 'eac3'; }).map(function (item) { return item.index; });
            var map = indexes.map(function (item) { return '-map 0:' + item; }).join(' ') + ' ';
            map += outIndexes.map(function (item) { return '-map 0:' + item; }).join(' ') + ' ';
            var codec = '';
            for (var i = 0; i < indexes.length; i++)
                codec += '-c:a:' + i + ' copy ';
            for (var i = indexes.length; i < indexes.length + outIndexes.length; i++)
                codec += '-c:a:' + i + ' aac ';
            audio = [map, codec];
        }
        else if (aacAc3) {
            audio = probe.audio.length === length.audio ? ['-map 0:a? ', '-c:a copy '] : ['-map 0:' + probe.audio[0].index + ' ', '-c:a:0 copy '];
        }
        else
            audio = probe.audio.length === length.audio ? ['-map 0:a? ', '-c:a aac '] : ['-map 0:' + probe.audio[0].index + ' ', '-c:a:0 aac '];
        var subtitle = subCheck ? ['', ''] : ['-map 0:s? ', '-c:s mov_text '];
        var output = file.replace(this.options.extension, 'mp4');
        output = this.options.source + '/ffmpeg/' + output;
        command += audio[0] + subtitle[0] + video[0] + video[1] + audio[1] + subtitle[1] + output;
        return command;
    };
    return Ffmpeg;
}());
exports.default = Ffmpeg;
