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
exports.getCommandListUsers = getCommandListUsers;
exports.getExtensionList = getExtensionList;
const runCommand_1 = require("../runCommand");
const mapUserData_1 = require("../utils/mapUserData");
const parseUserList_1 = require("../utils/parseUserList");
function getCommandListUsers() {
    return 'list_users';
}
function getExtensionList(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, runCommand_1.runCommand)(options, getCommandListUsers());
        const users = (0, parseUserList_1.parseUserList)(response);
        return users.map((item) => (0, mapUserData_1.mapUserData)(item));
    });
}
