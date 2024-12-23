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
exports.getCommandResponse = getCommandResponse;
const logger_1 = require("./logger");
function getCommandResponse(response, command) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(response === null || response === void 0 ? void 0 : response.body)) {
            logger_1.logger.error('No response from FreeSwitch server', command, response);
            throw new Error('No response from FreeSwitch server.');
        }
        return response.body;
    });
}
