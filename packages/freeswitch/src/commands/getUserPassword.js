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
exports.getCommandGetUserPassword = getCommandGetUserPassword;
exports.parsePasswordResponse = parsePasswordResponse;
exports.getUserPassword = getUserPassword;
const logger_1 = require("../logger");
const runCommand_1 = require("../runCommand");
const getDomain_1 = require("./getDomain");
function getCommandGetUserPassword(user, domain = 'rocket.chat') {
    return `user_data ${user}@${domain} param password`;
}
function parsePasswordResponse(response) {
    const { _body: password } = response;
    if (password === undefined) {
        logger_1.logger.error({ msg: 'Failed to load user password', response });
        throw new Error('Failed to load user password from FreeSwitch.');
    }
    return password;
}
function getUserPassword(options, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, runCommand_1.runCallback)(options, (runCommand) => __awaiter(this, void 0, void 0, function* () {
            const domainResponse = yield runCommand((0, getDomain_1.getCommandGetDomain)());
            const domain = (0, getDomain_1.parseDomainResponse)(domainResponse);
            const response = yield runCommand(getCommandGetUserPassword(user, domain));
            return parsePasswordResponse(response);
        }));
    });
}
