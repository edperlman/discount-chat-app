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
exports.resetRoomKey = resetRoomKey;
exports.pushToLimit = pushToLimit;
exports.replicateMongoSlice = replicateMongoSlice;
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
function resetRoomKey(roomId, userId, newRoomKey, newRoomKeyId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e;
        const user = yield models_1.Users.findOneById(userId, { projection: { e2e: 1 } });
        if (!user) {
            throw new Error('error-user-not-found');
        }
        if (!((_d = user.e2e) === null || _d === void 0 ? void 0 : _d.private_key) || !((_e = user.e2e) === null || _e === void 0 ? void 0 : _e.public_key)) {
            throw new Error('error-user-has-no-keys');
        }
        const room = yield models_1.Rooms.findOneById(roomId, { projection: { e2eKeyId: 1 } });
        if (!room) {
            throw new Error('error-room-not-found');
        }
        if (!room.e2eKeyId) {
            throw new Error('error-room-not-encrypted');
        }
        // We will update the subs of everyone who has a key for the room. For the ones that don't have, we will do nothing
        const notifySubs = [];
        const updateOps = [];
        const e2eQueue = [];
        try {
            for (var _f = true, _g = __asyncValues(models_1.Subscriptions.find({
                rid: roomId,
                $or: [{ E2EKey: { $exists: true } }, { E2ESuggestedKey: { $exists: true } }],
            })), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
                _c = _h.value;
                _f = false;
                const sub = _c;
                // This replicates the oldRoomKeys array modifications allowing us to have the changes locally without finding them again
                // which allows for quicker notifying
                const keys = replicateMongoSlice(room.e2eKeyId, sub);
                delete sub.E2ESuggestedKey;
                delete sub.E2EKey;
                delete sub.suggestedOldRoomKeys;
                const updateSet = {
                    $set: Object.assign({}, (keys && { oldRoomKeys: keys })),
                };
                updateOps.push({
                    updateOne: {
                        filter: { _id: sub._id },
                        update: Object.assign({ $unset: { E2EKey: 1, E2ESuggestedKey: 1, suggestedOldRoomKeys: 1 } }, (Object.keys(updateSet.$set).length && updateSet)),
                    },
                });
                if (userId !== sub.u._id) {
                    // Avoid notifying requesting user as notify will happen at the end
                    notifySubs.push(Object.assign(Object.assign({}, sub), (keys && { oldRoomKeys: keys })));
                    // This is for allowing the key distribution process to start inmediately
                    pushToLimit(e2eQueue, { userId: sub.u._id, ts: new Date() });
                }
                if (updateOps.length >= 100) {
                    yield writeAndNotify(updateOps, notifySubs);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (updateOps.length > 0) {
            yield writeAndNotify(updateOps, notifySubs);
        }
        // after the old keys have been moved to the new prop, store room key on room + the e2e queue so key can be exchanged
        // todo move to model method
        const roomResult = yield models_1.Rooms.resetRoomKeyAndSetE2EEQueueByRoomId(roomId, newRoomKeyId, e2eQueue);
        // And set the new key to the user that called the func
        const result = yield models_1.Subscriptions.setE2EKeyByUserIdAndRoomId(userId, roomId, newRoomKey);
        if (result.value) {
            void (0, notifyListener_1.notifyOnSubscriptionChanged)(result.value);
        }
        if (roomResult.value) {
            void (0, notifyListener_1.notifyOnRoomChanged)(roomResult.value);
        }
    });
}
function pushToLimit(arr, item, limit = 50) {
    if (arr.length < limit) {
        arr.push(item);
    }
}
function writeAndNotify(updateOps, notifySubs) {
    return __awaiter(this, void 0, void 0, function* () {
        yield models_1.Subscriptions.col.bulkWrite([...updateOps]);
        notifySubs.forEach((sub) => {
            void (0, notifyListener_1.notifyOnSubscriptionChanged)(sub);
        });
        notifySubs.length = 0;
        updateOps.length = 0;
    });
}
function replicateMongoSlice(keyId, sub) {
    if (!sub.E2EKey) {
        return;
    }
    if (!sub.oldRoomKeys) {
        return [{ e2eKeyId: keyId, ts: new Date(), E2EKey: sub.E2EKey }];
    }
    const sortedKeys = sub.oldRoomKeys.toSorted((a, b) => b.ts.getTime() - a.ts.getTime());
    sortedKeys.unshift({ e2eKeyId: keyId, ts: new Date(), E2EKey: sub.E2EKey });
    return sortedKeys.slice(0, 10);
}
