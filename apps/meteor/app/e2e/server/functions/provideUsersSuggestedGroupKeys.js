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
exports.provideUsersSuggestedGroupKeys = void 0;
const models_1 = require("@rocket.chat/models");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const provideUsersSuggestedGroupKeys = (userId, usersSuggestedGroupKeys) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    const roomIds = Object.keys(usersSuggestedGroupKeys);
    if (!roomIds.length) {
        return;
    }
    try {
        // Process should try to process all rooms i have access instead of dying if one is not
        for (var _g = true, roomIds_1 = __asyncValues(roomIds), roomIds_1_1; roomIds_1_1 = yield roomIds_1.next(), _a = roomIds_1_1.done, !_a; _g = true) {
            _c = roomIds_1_1.value;
            _g = false;
            const roomId = _c;
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(roomId, userId))) {
                continue;
            }
            const usersWithSuggestedKeys = [];
            try {
                for (var _h = true, _j = (e_2 = void 0, __asyncValues(usersSuggestedGroupKeys[roomId])), _k; _k = yield _j.next(), _d = _k.done, !_d; _h = true) {
                    _f = _k.value;
                    _h = false;
                    const user = _f;
                    const { value } = yield models_1.Subscriptions.setGroupE2ESuggestedKeyAndOldRoomKeys(user._id, roomId, user.key, parseOldKeysDates(user.oldKeys));
                    if (!value) {
                        continue;
                    }
                    void (0, notifyListener_1.notifyOnSubscriptionChanged)(value);
                    usersWithSuggestedKeys.push(user._id);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = _j.return)) yield _e.call(_j);
                }
                finally { if (e_2) throw e_2.error; }
            }
            yield models_1.Rooms.removeUsersFromE2EEQueueByRoomId(roomId, usersWithSuggestedKeys);
            void (0, notifyListener_1.notifyOnRoomChangedById)(roomId);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_a && (_b = roomIds_1.return)) yield _b.call(roomIds_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.provideUsersSuggestedGroupKeys = provideUsersSuggestedGroupKeys;
const parseOldKeysDates = (oldKeys) => {
    if (!oldKeys) {
        return;
    }
    return oldKeys.map((key) => (Object.assign(Object.assign({}, key), { ts: new Date(key.ts) })));
};
