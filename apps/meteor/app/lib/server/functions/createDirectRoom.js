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
exports.createDirectRoom = createDirectRoom;
const apps_1 = require("@rocket.chat/apps");
const exceptions_1 = require("@rocket.chat/apps-engine/definition/exceptions");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const isTruthy_1 = require("../../../../lib/isTruthy");
const server_1 = require("../../../settings/server");
const getDefaultSubscriptionPref_1 = require("../../../utils/lib/getDefaultSubscriptionPref");
const notifyListener_1 = require("../lib/notifyListener");
const generateSubscription = (fname, name, user, extra) => (Object.assign(Object.assign(Object.assign(Object.assign({ _id: random_1.Random.id(), ts: new Date(), alert: false, unread: 0, userMentions: 0, groupMentions: 0 }, (user.customFields && { customFields: user.customFields })), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(user)), extra), { t: 'd', fname,
    name, u: {
        _id: user._id,
        username: user.username,
    } }));
const getFname = (members) => members.map(({ name, username }) => name || username).join(', ');
const getName = (members) => members.map(({ username }) => username).join(', ');
function createDirectRoom(members_1) {
    return __awaiter(this, arguments, void 0, function* (members, roomExtraData = {}, options) {
        var _a, e_1, _b, _c;
        var _d, _e, _f, _g;
        const maxUsers = server_1.settings.get('DirectMesssage_maxUsers') || 1;
        if (members.length > maxUsers) {
            throw new meteor_1.Meteor.Error('error-direct-message-max-user-exceeded', `You cannot add more than ${maxUsers} users, including yourself to a direct message`, {
                method: 'createDirectRoom',
            });
        }
        yield callbacks_1.callbacks.run('beforeCreateDirectRoom', members);
        const membersUsernames = members
            .map((member) => {
            if (typeof member === 'string') {
                return member.replace('@', '');
            }
            return member.username;
        })
            .filter(isTruthy_1.isTruthy);
        const roomMembers = yield models_1.Users.findUsersByUsernames(membersUsernames, {
            projection: { _id: 1, name: 1, username: 1, settings: 1, customFields: 1 },
        }).toArray();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const sortedMembers = roomMembers.sort((u1, u2) => (u1.name || u1.username).localeCompare(u2.name || u2.username));
        const usernames = sortedMembers.map(({ username }) => username).filter(Boolean);
        const uids = roomMembers.map(({ _id }) => _id).sort();
        // Deprecated: using users' _id to compose the room _id is deprecated
        const room = uids.length === 2
            ? yield models_1.Rooms.findOneById(uids.join(''), { projection: { _id: 1 } })
            : yield models_1.Rooms.findOneDirectRoomContainingAllUserIDs(uids, { projection: { _id: 1 } });
        const isNewRoom = !room;
        const roomInfo = Object.assign(Object.assign(Object.assign({}, (uids.length === 2 && { _id: uids.join('') })), { t: 'd', usernames, usersCount: members.length, msgs: 0, ts: new Date(), uids }), roomExtraData);
        if (isNewRoom) {
            const tmpRoom = Object.assign(Object.assign({}, roomInfo), { _USERNAMES: usernames });
            const prevent = yield ((_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.triggerEvent(apps_1.AppEvents.IPreRoomCreatePrevent, tmpRoom).catch((error) => {
                if (error.name === exceptions_1.AppsEngineException.name) {
                    throw new meteor_1.Meteor.Error('error-app-prevented', error.message);
                }
                throw error;
            }));
            if (prevent) {
                throw new meteor_1.Meteor.Error('error-app-prevented', 'A Rocket.Chat App prevented the room creation.');
            }
            const result = yield ((_e = apps_1.Apps.self) === null || _e === void 0 ? void 0 : _e.triggerEvent(apps_1.AppEvents.IPreRoomCreateModify, yield ((_f = apps_1.Apps.self) === null || _f === void 0 ? void 0 : _f.triggerEvent(apps_1.AppEvents.IPreRoomCreateExtend, tmpRoom))));
            if (typeof result === 'object') {
                Object.assign(roomInfo, result);
            }
            delete tmpRoom._USERNAMES;
        }
        // @ts-expect-error - TODO: room expects `u` to be passed, but it's not part of the original object in here
        const rid = (room === null || room === void 0 ? void 0 : room._id) || (yield models_1.Rooms.insertOne(roomInfo)).insertedId;
        void (0, notifyListener_1.notifyOnRoomChangedById)(rid, isNewRoom ? 'inserted' : 'updated');
        if (roomMembers.length === 1) {
            // dm to yourself
            const { modifiedCount, upsertedCount } = yield models_1.Subscriptions.updateOne({ rid, 'u._id': roomMembers[0]._id }, {
                $set: { open: true },
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $setOnInsert: generateSubscription(roomMembers[0].name || roomMembers[0].username, roomMembers[0].username, roomMembers[0], Object.assign({}, options === null || options === void 0 ? void 0 : options.subscriptionExtra)),
            }, { upsert: true });
            if (modifiedCount || upsertedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, roomMembers[0]._id, modifiedCount ? 'updated' : 'inserted');
            }
        }
        else {
            const memberIds = roomMembers.map((member) => member._id);
            const membersWithPreferences = yield models_1.Users.find({ _id: { $in: memberIds } }, { projection: { 'username': 1, 'settings.preferences': 1 } }).toArray();
            try {
                for (var _h = true, membersWithPreferences_1 = __asyncValues(membersWithPreferences), membersWithPreferences_1_1; membersWithPreferences_1_1 = yield membersWithPreferences_1.next(), _a = membersWithPreferences_1_1.done, !_a; _h = true) {
                    _c = membersWithPreferences_1_1.value;
                    _h = false;
                    const member = _c;
                    const otherMembers = sortedMembers.filter(({ _id }) => _id !== member._id);
                    const { modifiedCount, upsertedCount } = yield models_1.Subscriptions.updateOne({ rid, 'u._id': member._id }, Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.creator) === member._id && { $set: { open: true } })), { $setOnInsert: generateSubscription(getFname(otherMembers), getName(otherMembers), member, Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.subscriptionExtra), ((options === null || options === void 0 ? void 0 : options.creator) !== member._id && { open: members.length > 2 }))) }), { upsert: true });
                    if (modifiedCount || upsertedCount) {
                        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, member._id, modifiedCount ? 'updated' : 'inserted');
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_h && !_a && (_b = membersWithPreferences_1.return)) yield _b.call(membersWithPreferences_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        // If the room is new, run a callback
        if (isNewRoom) {
            const insertedRoom = yield models_1.Rooms.findOneById(rid);
            yield callbacks_1.callbacks.run('afterCreateDirectRoom', insertedRoom, { members: roomMembers, creatorId: options === null || options === void 0 ? void 0 : options.creator });
            void ((_g = apps_1.Apps.self) === null || _g === void 0 ? void 0 : _g.triggerEvent(apps_1.AppEvents.IPostRoomCreate, insertedRoom));
        }
        return Object.assign(Object.assign({}, room), { _id: String(rid), usernames, t: 'd', rid, inserted: isNewRoom });
    });
}
