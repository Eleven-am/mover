"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
var arg_1 = __importDefault(require("arg"));
var inquirer_1 = __importDefault(require("inquirer"));
var path_1 = __importDefault(require("path"));
var handler_1 = __importDefault(require("./handler"));
var logger_1 = __importDefault(require("./logger"));
var exec_1 = __importDefault(require("./exec"));
var ffmpeg_1 = __importDefault(require("./ffmpeg"));
var stringToArgs = function (rawArgs) {
    var args = (0, arg_1.default)({
        '--directory': String,
        '--params': String,
        '--folder': String,
        '--ext': String,
        '--move': Boolean,
        '--verbose': Boolean,
        '-v': '--verbose',
        '-m': '--move',
        '-e': '--ext',
        '-d': '--folder',
        '-s': '--directory',
        '-p': '--params'
    }, {
        argv: rawArgs.slice(2)
    });
    return {
        extension: args['--ext'] || false,
        directory: args['--directory'] || false,
        folder: args['--folder'] || false,
        move: args['--move'] || false,
        verbose: args['--verbose'] || false,
        params: args['--params'],
    };
};
function fixArgs(options) {
    return __awaiter(this, void 0, void 0, function () {
        var questions, move, verbose, source, destination, extension, answers, handler, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    questions = [];
                    move = options.move, verbose = options.verbose, source = options.directory, destination = options.folder, extension = options.extension;
                    answers = { move: move, source: source, verbose: verbose, destination: destination, extension: extension };
                    handler = new handler_1.default(answers);
                    _d.label = 1;
                case 1:
                    if (!(options.directory === false || options.directory === 'file')) return [3 /*break*/, 4];
                    questions.push({
                        type: 'input',
                        name: 'source',
                        message: 'please enter a source folder',
                        default: '/home/maix/Downloads'
                    });
                    _a = [__assign({}, answers)];
                    return [4 /*yield*/, inquirer_1.default.prompt(questions)];
                case 2:
                    answers = __assign.apply(void 0, _a.concat([_d.sent()]));
                    handler = new handler_1.default(answers);
                    _b = options;
                    return [4 /*yield*/, handler.confirm()];
                case 3:
                    _b.directory = _d.sent();
                    questions = [];
                    return [3 /*break*/, 1];
                case 4:
                    if (!options.folder)
                        questions.push({
                            type: 'input',
                            name: 'destination',
                            message: 'please enter a destination folder',
                            default: 'nzbDownload'
                        });
                    if (!!options.extension) return [3 /*break*/, 5];
                    questions.push({
                        type: 'list',
                        name: 'extension',
                        message: 'please enter a filtered file extension',
                        choices: ['mkv', 'mp4', 'avi', 'mov'],
                        default: 'mkv'
                    });
                    return [3 /*break*/, 7];
                case 5:
                    _c = [__assign({}, answers)];
                    return [4 /*yield*/, inquirer_1.default.prompt(questions)];
                case 6:
                    answers = __assign.apply(void 0, _c.concat([_d.sent()]));
                    _d.label = 7;
                case 7:
                    if (typeof answers.source === 'string' && answers.source.charAt(0) !== '/')
                        answers.source = path_1.default.join(process.cwd(), answers.source);
                    return [2 /*return*/, { answers: answers, handler: new handler_1.default(answers) }];
            }
        });
    });
}
function cli(args) {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, answers, handler, bar, data, ffmpeg, commands, exec;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = stringToArgs(args);
                    return [4 /*yield*/, fixArgs(options)];
                case 1:
                    _a = _b.sent(), answers = _a.answers, handler = _a.handler;
                    bar = new logger_1.default(answers);
                    bar.show(answers);
                    bar.update(0);
                    bar.startItem('moving files');
                    return [4 /*yield*/, handler.moveOut()];
                case 2:
                    data = _b.sent();
                    bar.update(20 / 300);
                    bar.itemDone('moving files');
                    ffmpeg = new ffmpeg_1.default(answers, data.files);
                    bar.startItem('probing files');
                    return [4 /*yield*/, ffmpeg.probeFolder()];
                case 3:
                    commands = _b.sent();
                    bar.itemDone('probing files');
                    bar.startItem('converting files');
                    exec = new exec_1.default(answers, commands);
                    return [4 /*yield*/, exec.execCommands()];
                case 4:
                    _b.sent();
                    bar.itemDone('converting files');
                    bar.update(200 / 300);
                    bar.startItem('moving files with rclone');
                    return [4 /*yield*/, exec.move()];
                case 5:
                    _b.sent();
                    bar.update(300 / 300);
                    bar.itemDone('moving files with rclone');
                    return [4 /*yield*/, bar.done()];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.cli = cli;
