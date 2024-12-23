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
exports.relinquishRoomOwnerships = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../file-upload/server");
const notifyListener_1 = require("../lib/notifyListener");
const bulkRoomCleanUp = (rids) => __awaiter(void 0, void 0, void 0, function* () {
    // no bulk deletion for files
    yield Promise.all(rids.map((rid) => server_1.FileUpload.removeFilesByRoomId(rid)));
    return Promise.all([
        models_1.Subscriptions.removeByRoomIds(rids, {
            onTrash(doc) {
                return __awaiter(this, void 0, void 0, function* () {
                    void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                });
            },
        }),
        models_1.Messages.removeByRoomIds(rids),
        models_1.ReadReceipts.removeByRoomIds(rids),
        models_1.Rooms.removeByIds(rids),
    ]);
});
const relinquishRoomOwnerships = function (userId_1, subscribedRooms_1) {
    return __awaiter(this, arguments, void 0, function* (userId, subscribedRooms, removeDirectMessages = true) {
        var _a, e_1, _b, _c;
        // change owners
        const changeOwner = subscribedRooms.filter(({ shouldChangeOwner }) => shouldChangeOwner);
        try {
            for (var _d = true, changeOwner_1 = __asyncValues(changeOwner), changeOwner_1_1; changeOwner_1_1 = yield changeOwner_1.next(), _a = changeOwner_1_1.done, !_a; _d = true) {
                _c = changeOwner_1_1.value;
                _d = false;
                const { newOwner, rid } = _c;
                newOwner && (yield models_1.Roles.addUserRoles(newOwner, ['owner'], rid));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = changeOwner_1.return)) yield _b.call(changeOwner_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const roomIdsToRemove = subscribedRooms.filter(({ shouldBeRemoved }) => shouldBeRemoved).map(({ rid }) => rid);
        if (removeDirectMessages) {
            (yield models_1.Rooms.find1On1ByUserId(userId, { projection: { _id: 1 } }).toArray()).map(({ _id }) => roomIdsToRemove.push(_id));
        }
        yield bulkRoomCleanUp(roomIdsToRemove);
        return subscribedRooms;
    });
};
exports.relinquishRoomOwnerships = relinquishRoomOwnerships;
