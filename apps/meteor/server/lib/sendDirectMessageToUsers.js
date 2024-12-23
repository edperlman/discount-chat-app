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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDirectMessageToUsers = sendDirectMessageToUsers;
const models_1 = require("@rocket.chat/models");
const sendMessage_1 = require("../../app/lib/server/methods/sendMessage");
const createDirectMessage_1 = require("../methods/createDirectMessage");
const system_1 = require("./logger/system");
function sendDirectMessageToUsers() {
    return __awaiter(this, arguments, void 0, function* (fromId = 'rocket.cat', toIds, messageFn) {
        var _a, e_1, _b, _c;
        const fromUser = yield models_1.Users.findOneById(fromId, { projection: { _id: 1, username: 1 } });
        if (!fromUser) {
            throw new Error(`User not found: ${fromId}`);
        }
        const users = models_1.Users.findByIds(toIds, { projection: { _id: 1, username: 1, language: 1 } });
        const success = [];
        try {
            for (var _d = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _a = users_1_1.done, !_a; _d = true) {
                _c = users_1_1.value;
                _d = false;
                const user = _c;
                try {
                    const { rid } = yield (0, createDirectMessage_1.createDirectMessage)([user.username], fromId);
                    const msg = typeof messageFn === 'function' ? messageFn(user) : messageFn;
                    yield (0, sendMessage_1.executeSendMessage)(fromId, { rid, msg });
                    success.push(user._id);
                }
                catch (error) {
                    system_1.SystemLogger.error(error);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = users_1.return)) yield _b.call(users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return success;
    });
}
