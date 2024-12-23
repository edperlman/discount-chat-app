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
exports.getCommandGetDomain = getCommandGetDomain;
exports.parseDomainResponse = parseDomainResponse;
exports.getDomain = getDomain;
const logger_1 = require("../logger");
const runCommand_1 = require("../runCommand");
function getCommandGetDomain() {
    return 'eval ${domain}';
}
function parseDomainResponse(response) {
    const { _body: domain } = response;
    if (typeof domain !== 'string') {
        logger_1.logger.error({ msg: 'Failed to load user domain', response });
        throw new Error('Failed to load user domain from FreeSwitch.');
    }
    return domain;
}
function getDomain(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, runCommand_1.runCommand)(options, getCommandGetDomain());
        return parseDomainResponse(response);
    });
}
