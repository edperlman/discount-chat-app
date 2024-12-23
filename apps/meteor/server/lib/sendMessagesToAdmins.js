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
exports.sendMessagesToAdmins = sendMessagesToAdmins;
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const sendMessage_1 = require("../../app/lib/server/methods/sendMessage");
const createDirectMessage_1 = require("../methods/createDirectMessage");
const system_1 = require("./logger/system");
const getData = (param, adminUser) => __awaiter(void 0, void 0, void 0, function* () {
    const result = typeof param === 'function' ? yield param({ adminUser }) : param;
    if (!Array.isArray(result)) {
        return [result];
    }
    return result;
});
function sendMessagesToAdmins(_a) {
    return __awaiter(this, arguments, void 0, function* ({ fromId = 'rocket.cat', checkFrom = true, msgs = [], banners = [], }) {
        var _b, e_1, _c, _d;
        const fromUser = checkFrom ? yield models_1.Users.findOneById(fromId, { projection: { _id: 1 } }) : true;
        const users = yield (yield models_1.Roles.findUsersInRole('admin')).toArray();
        const notifyAdmins = [];
        try {
            for (var _e = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _b = users_1_1.done, !_b; _e = true) {
                _d = users_1_1.value;
                _e = false;
                const adminUser = _d;
                if (fromUser) {
                    try {
                        const { rid } = yield (0, createDirectMessage_1.createDirectMessage)([adminUser.username], fromId);
                        yield Promise.all((yield getData(msgs, adminUser)).map((msg) => (0, sendMessage_1.executeSendMessage)(fromId, Object.assign({ rid }, msg))));
                    }
                    catch (error) {
                        system_1.SystemLogger.error(error);
                    }
                }
                const updates = yield Promise.all((yield getData(banners, adminUser)).map((banner) => models_1.Users.addBannerById(adminUser._id, banner)));
                const hasUpdated = updates.some(({ modifiedCount }) => modifiedCount > 0);
                if (hasUpdated) {
                    notifyAdmins.push(adminUser._id);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = users_1.return)) yield _c.call(users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (notifyAdmins.length === 0) {
            return;
        }
        void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
            const results = yield models_1.Users.findByIds(notifyAdmins, { projection: { banners: 1 } }).toArray();
            return results.map(({ _id, banners }) => ({
                id: _id,
                clientAction: 'updated',
                diff: {
                    banners,
                },
            }));
        }));
    });
}
