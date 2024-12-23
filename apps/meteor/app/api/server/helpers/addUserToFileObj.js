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
exports.addUserToFileObj = addUserToFileObj;
const models_1 = require("@rocket.chat/models");
function addUserToFileObj(files) {
    return __awaiter(this, void 0, void 0, function* () {
        const uids = files.map(({ userId }) => userId).filter(Boolean);
        const users = yield models_1.Users.findByIds(uids, { projection: { name: 1, username: 1 } }).toArray();
        return files.map((file) => {
            const user = users.find(({ _id: userId }) => file.userId && userId === file.userId);
            if (!user) {
                return file;
            }
            return Object.assign(Object.assign({}, file), { user });
        });
    });
}
