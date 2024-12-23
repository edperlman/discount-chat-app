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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = void 0;
/* eslint-disable complexity */
const apps_1 = require("@rocket.chat/apps");
const exceptions_1 = require("@rocket.chat/apps-engine/definition/exceptions");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const createDirectRoom_1 = require("./createDirectRoom");
const callbacks_1 = require("../../../../lib/callbacks");
const beforeCreateRoomCallback_1 = require("../../../../lib/callbacks/beforeCreateRoomCallback");
const getSubscriptionAutotranslateDefaultConfig_1 = require("../../../../server/lib/getSubscriptionAutotranslateDefaultConfig");
const getDefaultSubscriptionPref_1 = require("../../../utils/lib/getDefaultSubscriptionPref");
const getValidRoomName_1 = require("../../../utils/server/lib/getValidRoomName");
const notifyListener_1 = require("../lib/notifyListener");
const isValidName = (name) => {
    return typeof name === 'string' && name.trim().length > 0;
};
const onlyUsernames = (members) => Array.isArray(members) && members.every((member) => typeof member === 'string');
function createUsersSubscriptions(_a) {
    return __awaiter(this, arguments, void 0, function* ({ room, shouldBeHandledByFederation, members, now, owner, options, }) {
        var _b, e_1, _c, _d;
        if (shouldBeHandledByFederation) {
            const extra = Object.assign(Object.assign(Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.subscriptionExtra), { open: true, ls: now, roles: ['owner'] }), (room.prid && { prid: room.prid })), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(owner));
            const { insertedId } = yield models_1.Subscriptions.createWithRoomAndUser(room, owner, extra);
            if (insertedId) {
                yield (0, notifyListener_1.notifyOnRoomChanged)(room, 'inserted');
            }
            return;
        }
        const subs = [];
        const memberIds = [];
        const membersCursor = models_1.Users.findUsersByUsernames(members, {
            projection: { 'username': 1, 'settings.preferences': 1, 'federated': 1, 'roles': 1 },
        });
        try {
            for (var _e = true, membersCursor_1 = __asyncValues(membersCursor), membersCursor_1_1; membersCursor_1_1 = yield membersCursor_1.next(), _b = membersCursor_1_1.done, !_b; _e = true) {
                _d = membersCursor_1_1.value;
                _e = false;
                const member = _d;
                try {
                    yield callbacks_1.callbacks.run('federation.beforeAddUserToARoom', { user: member, inviter: owner }, room);
                    yield callbacks_1.callbacks.run('beforeAddedToRoom', { user: member, inviter: owner });
                }
                catch (error) {
                    continue;
                }
                memberIds.push(member._id);
                const extra = (options === null || options === void 0 ? void 0 : options.subscriptionExtra) || {};
                extra.open = true;
                if (room.prid) {
                    extra.prid = room.prid;
                }
                if (member.username === owner.username) {
                    extra.ls = now;
                    extra.roles = ['owner'];
                }
                const autoTranslateConfig = (0, getSubscriptionAutotranslateDefaultConfig_1.getSubscriptionAutotranslateDefaultConfig)(member);
                subs.push({
                    user: member,
                    extraData: Object.assign(Object.assign({}, extra), autoTranslateConfig),
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_b && (_c = membersCursor_1.return)) yield _c.call(membersCursor_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!['d', 'l'].includes(room.t)) {
            yield models_1.Users.addRoomByUserIds(memberIds, room._id);
        }
        const { insertedIds } = yield models_1.Subscriptions.createWithRoomAndManyUsers(room, subs);
        Object.values(insertedIds).forEach((subId) => (0, notifyListener_1.notifyOnSubscriptionChangedById)(subId, 'inserted'));
        yield models_1.Rooms.incUsersCountById(room._id, subs.length);
    });
}
const createRoom = (type_1, name_1, owner_1, ...args_1) => __awaiter(void 0, [type_1, name_1, owner_1, ...args_1], void 0, function* (type, name, owner, members = [], excludeSelf, readOnly, roomExtraData, options, sidepanel) {
    var _a, _b, _c;
    const _d = roomExtraData || {}, { teamId } = _d, extraData = __rest(_d, ["teamId"]);
    yield beforeCreateRoomCallback_1.beforeCreateRoomCallback.run({
        type,
        // name,
        // owner: ownerUsername,
        // members,
        // readOnly,
        extraData,
        // options,
    });
    if (type === 'd') {
        return (0, createDirectRoom_1.createDirectRoom)(members, extraData, Object.assign(Object.assign({}, options), { creator: (options === null || options === void 0 ? void 0 : options.creator) || (owner === null || owner === void 0 ? void 0 : owner.username) }));
    }
    if (!onlyUsernames(members)) {
        throw new meteor_1.Meteor.Error('error-invalid-members', 'members should be an array of usernames if provided for rooms other than direct messages');
    }
    if (!isValidName(name)) {
        throw new meteor_1.Meteor.Error('error-invalid-name', 'Invalid name', {
            function: 'RocketChat.createRoom',
        });
    }
    if (!owner) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            function: 'RocketChat.createRoom',
        });
    }
    if (!(owner === null || owner === void 0 ? void 0 : owner.username)) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            function: 'RocketChat.createRoom',
        });
    }
    if (!excludeSelf && owner.username && !members.includes(owner.username)) {
        members.push(owner.username);
    }
    if (extraData.broadcast) {
        readOnly = true;
        delete extraData.reactWhenReadOnly;
    }
    // this might not be the best way to check if the room is a discussion, we may need a specific field for that
    const isDiscussion = 'prid' in extraData && extraData.prid !== '';
    const now = new Date();
    const roomProps = Object.assign(Object.assign({ fname: name, _updatedAt: now }, extraData), { name: isDiscussion ? name : yield (0, getValidRoomName_1.getValidRoomName)(name.trim(), undefined), t: type, msgs: 0, usersCount: 0, u: {
            _id: owner._id,
            username: owner.username,
            name: owner.name,
        }, ts: now, ro: readOnly === true, sidepanel });
    if (teamId) {
        const team = yield core_services_1.Team.getOneById(teamId, { projection: { _id: 1 } });
        if (team) {
            roomProps.teamId = team._id;
        }
    }
    const tmp = Object.assign(Object.assign({}, roomProps), { _USERNAMES: members });
    const prevent = yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPreRoomCreatePrevent, tmp).catch((error) => {
        if (error.name === exceptions_1.AppsEngineException.name) {
            throw new meteor_1.Meteor.Error('error-app-prevented', error.message);
        }
        throw error;
    }));
    if (prevent) {
        throw new meteor_1.Meteor.Error('error-app-prevented', 'A Rocket.Chat App prevented the room creation.');
    }
    const eventResult = yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPreRoomCreateModify, yield apps_1.Apps.triggerEvent(apps_1.AppEvents.IPreRoomCreateExtend, tmp)));
    if (eventResult && typeof eventResult === 'object' && delete eventResult._USERNAMES) {
        Object.assign(roomProps, eventResult);
    }
    const shouldBeHandledByFederation = roomProps.federated === true || owner.username.includes(':');
    if (shouldBeHandledByFederation) {
        const federation = (yield core_services_1.License.hasValidLicense()) ? core_services_1.FederationEE : core_services_1.Federation;
        yield federation.beforeCreateRoom(roomProps);
    }
    if (type === 'c') {
        yield callbacks_1.callbacks.run('beforeCreateChannel', owner, roomProps);
    }
    const room = yield models_1.Rooms.createWithFullRoomData(roomProps);
    void (0, notifyListener_1.notifyOnRoomChanged)(room, 'inserted');
    yield createUsersSubscriptions({ room, members, now, owner, options, shouldBeHandledByFederation });
    if (type === 'c') {
        if (room.teamId) {
            const team = yield core_services_1.Team.getOneById(room.teamId);
            if (team) {
                yield core_services_1.Message.saveSystemMessage('user-added-room-to-team', team.roomId, room.name || '', owner);
            }
        }
        callbacks_1.callbacks.runAsync('afterCreateChannel', owner, room);
    }
    else if (type === 'p') {
        callbacks_1.callbacks.runAsync('afterCreatePrivateGroup', owner, room);
    }
    callbacks_1.callbacks.runAsync('afterCreateRoom', owner, room);
    if (shouldBeHandledByFederation) {
        callbacks_1.callbacks.runAsync('federation.afterCreateFederatedRoom', room, { owner, originalMemberList: members });
    }
    void ((_c = apps_1.Apps.self) === null || _c === void 0 ? void 0 : _c.triggerEvent(apps_1.AppEvents.IPostRoomCreate, room));
    return Object.assign({ rid: room._id, inserted: true }, room);
});
exports.createRoom = createRoom;
