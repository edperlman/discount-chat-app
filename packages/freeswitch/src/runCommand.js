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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCallback = runCallback;
exports.runCommand = runCommand;
const tools_1 = require("@rocket.chat/tools");
const esl_1 = require("esl");
const connect_1 = require("./connect");
const getCommandResponse_1 = require("./getCommandResponse");
function runCallback(options, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const { host, port, password, timeout } = options;
        const call = yield (0, connect_1.connect)({ host, port, password });
        try {
            // Await result so it runs within the try..finally scope
            const result = yield cb((command) => __awaiter(this, void 0, void 0, function* () {
                const response = yield call.bgapi(command, timeout !== null && timeout !== void 0 ? timeout : esl_1.FreeSwitchResponse.default_command_timeout);
                return (0, getCommandResponse_1.getCommandResponse)(response, command);
            }));
            return result;
        }
        finally {
            yield (0, tools_1.wrapExceptions)(() => __awaiter(this, void 0, void 0, function* () { return call.end(); })).suppress();
        }
    });
}
function runCommand(options, command) {
    return __awaiter(this, void 0, void 0, function* () {
        return runCallback(options, (runCommand) => __awaiter(this, void 0, void 0, function* () { return runCommand(command); }));
    });
}
