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
exports.updateGroupDMsName = void 0;
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../lib/notifyListener");
const getFname = (members) => members.map(({ name, username }) => name || username).join(', ');
const getName = (members) => members.map(({ username }) => username).join(',');
function getUsersWhoAreInTheSameGroupDMsAs(user) {
    return __awaiter(this, void 0, void 0, function* () {
        // add all users to single array so we can fetch details from them all at once
        if ((yield models_1.Rooms.countGroupDMsByUids([user._id])) === 0) {
            return;
        }
        const userIds = new Set();
        const users = new Map();
        const rooms = models_1.Rooms.findGroupDMsByUids([user._id], { projection: { uids: 1 } });
        yield rooms.forEach((room) => {
            if (!room.uids) {
                return;
            }
            room.uids.forEach((uid) => uid !== user._id && userIds.add(uid));
        });
        (yield models_1.Users.findByIds([...userIds], { projection: { username: 1, name: 1 } }).toArray()).forEach((user) => users.set(user._id, user));
        return users;
    });
}
function sortUsersAlphabetically(u1, u2) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (u1.name || u1.username).localeCompare(u2.name || u2.username);
}
const updateGroupDMsName = (userThatChangedName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    if (!userThatChangedName.username) {
        return;
    }
    const users = yield getUsersWhoAreInTheSameGroupDMsAs(userThatChangedName);
    if (!users) {
        return;
    }
    users.set(userThatChangedName._id, userThatChangedName);
    const rooms = models_1.Rooms.findGroupDMsByUids([userThatChangedName._id], { projection: { uids: 1 } });
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getMembers = (uids) => uids.map((uid) => users.get(uid)).filter(Boolean);
    try {
        // loop rooms to update the subscriptions from them all
        for (var _g = true, rooms_1 = __asyncValues(rooms), rooms_1_1; rooms_1_1 = yield rooms_1.next(), _a = rooms_1_1.done, !_a; _g = true) {
            _c = rooms_1_1.value;
            _g = false;
            const room = _c;
            if (!room.uids) {
                return;
            }
            const members = getMembers(room.uids);
            const sortedMembers = members.sort(sortUsersAlphabetically);
            const subs = models_1.Subscriptions.findByRoomId(room._id, { projection: { '_id': 1, 'u._id': 1 } });
            try {
                for (var _h = true, subs_1 = (e_2 = void 0, __asyncValues(subs)), subs_1_1; subs_1_1 = yield subs_1.next(), _d = subs_1_1.done, !_d; _h = true) {
                    _f = subs_1_1.value;
                    _h = false;
                    const sub = _f;
                    const otherMembers = sortedMembers.filter(({ _id }) => _id !== sub.u._id);
                    const updateNameRespose = yield models_1.Subscriptions.updateNameAndFnameById(sub._id, getName(otherMembers), getFname(otherMembers));
                    if (updateNameRespose.modifiedCount) {
                        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(room._id);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_h && !_d && (_e = subs_1.return)) yield _e.call(subs_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_a && (_b = rooms_1.return)) yield _b.call(rooms_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.updateGroupDMsName = updateGroupDMsName;
