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
exports.getContactManagerIdByUsername = getContactManagerIdByUsername;
const models_1 = require("@rocket.chat/models");
function getContactManagerIdByUsername(username, session) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1 }, session });
        return user === null || user === void 0 ? void 0 : user._id;
    });
}
