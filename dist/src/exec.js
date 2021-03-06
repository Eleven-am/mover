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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Execute = /** @class */ (function () {
    function Execute(options, commands, bar) {
        this.bar = bar;
        this.options = options;
        this.commands = commands;
        this.start = 90 / 300;
        this.bar = bar;
        this.bar.update(90 / 300);
        this.speed = Math.round((108 / commands.length) * 10) / 10;
    }
    Execute.prototype.execCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var params, host;
            var _this = this;
            return __generator(this, function (_a) {
                params = command.split(' ');
                host = params[0];
                params.shift();
                this.bar.show(command);
                return [2 /*return*/, new Promise(function (resolve) {
                        var exec = (0, child_process_1.spawn)(host, params);
                        exec.stderr.on('data', function (data) {
                            _this.bar.show("" + data);
                            resolve(false);
                        });
                        exec.on('close', function () {
                            resolve(true);
                        });
                    })];
            });
        });
    };
    Execute.prototype.move = function () {
        return __awaiter(this, void 0, void 0, function () {
            var command, execute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = 'rclone move ' + this.options.source + '/ffmpeg media:' + this.options.destination;
                        return [4 /*yield*/, this.execCommand(command)];
                    case 1:
                        execute = _a.sent();
                        if (!execute) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.execCommand('rm -r ' + this.options.source + '/ffmpeg')];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    Execute.prototype.execCommands = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, command, executed, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, 11, 16]);
                        _b = __asyncValues(this.commands);
                        _d.label = 1;
                    case 1: return [4 /*yield*/, _b.next()];
                    case 2:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 9];
                        command = _c.value;
                        if (!(this.options.extension === 'mp4' && command.item.endsWith('mp4'))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.execCommand('mv ' + this.options.source + '/' + command.item + ' ' + this.options.source + '/ffmpeg')];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.execCommand(command.command)];
                    case 5:
                        executed = _d.sent();
                        if (!executed) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.execCommand('rm ' + this.options.source + '/' + command.item)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        this.start += this.speed / 300;
                        this.bar.update(this.start);
                        _d.label = 8;
                    case 8: return [3 /*break*/, 1];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _d.trys.push([11, , 14, 15]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _a.call(_b)];
                    case 12:
                        _d.sent();
                        _d.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    return Execute;
}());
exports.default = Execute;
