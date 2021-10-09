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
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var path_1 = __importDefault(require("path"));
var strtr_1 = __importDefault(require("locutus/php/strings/strtr"));
var dicDo = {
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
var readdir = (0, util_1.promisify)(fs_1.default.readdir);
var renameFile = (0, util_1.promisify)(fs_1.default.rename);
var stats = (0, util_1.promisify)(fs_1.default.lstat);
var Handler = /** @class */ (function () {
    function Handler(options, bar, setup) {
        this.bar = bar;
        this.options = options;
        if (typeof options.source !== 'boolean')
            this.source = options.source;
        else if (setup)
            this.source = '';
        else
            throw new Error('No directory provided');
    }
    Handler.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, response_1, stat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.source !== '')) return [3 /*break*/, 3];
                        this.source = this.source.charAt(0) !== '/' ? path_1.default.join(process.cwd(), this.source) : this.source;
                        return [4 /*yield*/, this.exists()];
                    case 1:
                        response = _a.sent();
                        if (!response) return [3 /*break*/, 3];
                        return [4 /*yield*/, stats(this.source)];
                    case 2:
                        stat = _a.sent();
                        if (stat.isFile())
                            response_1 = 'file';
                        else
                            response_1 = this.source.replace(/\/$/, '');
                        return [2 /*return*/, response_1];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    Handler.prototype.exists = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                source = source || this.source;
                return [2 /*return*/, new Promise(function (resolve) {
                        fs_1.default.access(source, function (err) {
                            if (!err)
                                resolve(true);
                            else
                                resolve(false);
                        });
                    })];
            });
        });
    };
    Handler.prototype.createDir = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var exists;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.exists(this.source + '/ffmpeg')];
                                case 1:
                                    exists = _a.sent();
                                    if (!exists)
                                        fs_1.default.mkdir(this.source + '/ffmpeg', function (err) {
                                            if (err) {
                                                _this.bar.show(err);
                                                resolve(false);
                                            }
                                        });
                                    resolve(true);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Handler.prototype.moveOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, files, string;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.createDir()];
                    case 1:
                        _b.sent();
                        if (!this.options.move) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.move()];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.renameFiles()];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        _a;
                        return [4 /*yield*/, readdir(this.source)];
                    case 6:
                        files = _b.sent();
                        files = files.filter(function (item) { return item.charAt(0) !== '.'; });
                        files = files.filter(function (item) { return item.endsWith(_this.options.extension); });
                        string = 'move option is ' + (this.options.move ? '' : 'de') + 'activated';
                        this.bar.show(string);
                        return [2 /*return*/, { info: true, files: files }];
                }
            });
        });
    };
    Handler.prototype.move = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            var files, realFiles, files_1, files_1_1, file, temp, stat, e_1_1, realFiles_1, realFiles_1_1, realFile, name_1, ext, fileName, file, e_2_1;
            var e_1, _a, e_2, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        folder = folder || this.source;
                        return [4 /*yield*/, readdir(folder)];
                    case 1:
                        files = _c.sent();
                        files = files.filter(function (item) { return item.charAt(0) !== '.'; });
                        realFiles = [];
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 9, 10, 11]);
                        files_1 = __values(files), files_1_1 = files_1.next();
                        _c.label = 3;
                    case 3:
                        if (!!files_1_1.done) return [3 /*break*/, 8];
                        file = files_1_1.value;
                        temp = folder + '/' + file;
                        return [4 /*yield*/, stats(temp)];
                    case 4:
                        stat = _c.sent();
                        if (!!stat.isFile()) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.move(temp)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        realFiles.push('/' + file);
                        _c.label = 7;
                    case 7:
                        files_1_1 = files_1.next();
                        return [3 /*break*/, 3];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 11];
                    case 10:
                        try {
                            if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 11:
                        realFiles = realFiles.filter(function (item) { return item.endsWith(_this.options.extension); });
                        _c.label = 12;
                    case 12:
                        _c.trys.push([12, 17, 18, 19]);
                        realFiles_1 = __values(realFiles), realFiles_1_1 = realFiles_1.next();
                        _c.label = 13;
                    case 13:
                        if (!!realFiles_1_1.done) return [3 /*break*/, 16];
                        realFile = realFiles_1_1.value;
                        name_1 = (0, strtr_1.default)(realFile, dicDo);
                        ext = path_1.default.extname(realFile);
                        fileName = name_1.replace(/\[.*?]\s*|-|\(.*?\)/g, '').replace(/\s+/g, '.').replace(/\.{2,}/, '.');
                        file = this.source + fileName + ext;
                        this.bar.show('moving ' + realFile);
                        return [4 /*yield*/, renameFile(folder + realFile, file)];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        realFiles_1_1 = realFiles_1.next();
                        return [3 /*break*/, 13];
                    case 16: return [3 /*break*/, 19];
                    case 17:
                        e_2_1 = _c.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 19];
                    case 18:
                        try {
                            if (realFiles_1_1 && !realFiles_1_1.done && (_b = realFiles_1.return)) _b.call(realFiles_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    Handler.prototype.renameFiles = function (folder, destination) {
        return __awaiter(this, void 0, void 0, function () {
            var files, files_2, files_2_1, file, temp, e_3_1;
            var e_3, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        folder = folder || this.source;
                        destination = destination || this.source;
                        return [4 /*yield*/, readdir(folder)];
                    case 1:
                        files = _b.sent();
                        files = files.filter(function (item) { return item.charAt(0) !== '.'; });
                        files = files.filter(function (item) { return item.endsWith(_this.options.extension); });
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 9]);
                        files_2 = __values(files), files_2_1 = files_2.next();
                        _b.label = 3;
                    case 3:
                        if (!!files_2_1.done) return [3 /*break*/, 6];
                        file = files_2_1.value;
                        temp = folder + '/' + file;
                        file = destination + '/' + file.replace(/\[.*?]\s*|-|\(.*?\)/g, '').replace(/\s+/g, '.').replace(/\.{2,}/, '.');
                        return [4 /*yield*/, renameFile(temp, file)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        files_2_1 = files_2.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_3_1 = _b.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (files_2_1 && !files_2_1.done && (_a = files_2.return)) _a.call(files_2);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Handler;
}());
exports.default = Handler;
