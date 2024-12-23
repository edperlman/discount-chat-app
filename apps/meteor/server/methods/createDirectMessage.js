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
exports.createDirectMessage = createDirectMessage;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const addUser_1 = require("../../app/federation/server/functions/addUser");
const createRoom_1 = require("../../app/lib/server/functions/createRoom");
const RateLimiter_1 = require("../../app/lib/server/lib/RateLimiter");
const server_1 = require("../../app/settings/server");
const callbacks_1 = require("../../lib/callbacks");
function createDirectMessage(usernames_1, userId_1) {
    return __awaiter(this, arguments, void 0, function* (usernames, userId, excludeSelf = false) {
        (0, check_1.check)(usernames, [String]);
        (0, check_1.check)(userId, String);
        (0, check_1.check)(excludeSelf, check_1.Match.Optional(Boolean));
        if (!userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'createDirectMessage',
            });
        }
        const me = yield models_1.Users.findOneById(userId, { projection: { username: 1, name: 1 } });
        if (!(me === null || me === void 0 ? void 0 : me.username)) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'createDirectMessage',
            });
        }
        if (server_1.settings.get('Message_AllowDirectMessagesToYourself') === false && usernames.length === 1 && me.username === usernames[0]) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'createDirectMessage',
            });
        }
        const users = yield Promise.all(usernames
            .filter((username) => username !== me.username)
            .map((username) => __awaiter(this, void 0, void 0, function* () {
            let to = yield models_1.Users.findOneByUsernameIgnoringCase(username);
            // If the username does have an `@`, but does not exist locally, we create it first
            if (!to && username.includes('@')) {
                try {
                    to = yield (0, addUser_1.addUser)(username);
                }
                catch (_a) {
                    // no-op
                }
                if (!to) {
                    return username;
                }
            }
            if (!to) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'createDirectMessage',
                });
            }
            return to;
        })));
        const roomUsers = excludeSelf ? users : [me, ...users];
        // allow self-DMs
        if (roomUsers.length === 1 && roomUsers[0] !== undefined && typeof roomUsers[0] !== 'string' && roomUsers[0]._id !== me._id) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'createDirectMessage',
            });
        }
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-d'))) {
            // If the user can't create DMs but can access already existing ones
            if ((yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-d-room')) && !Object.keys(roomUsers).some((user) => typeof user === 'string')) {
                // Check if the direct room already exists, then return it
                const uids = roomUsers.map(({ _id }) => _id).sort();
                const room = yield models_1.Rooms.findOneDirectRoomContainingAllUserIDs(uids, { projection: { _id: 1 } });
                if (room) {
                    return Object.assign(Object.assign({}, room), { t: 'd', rid: room._id });
                }
            }
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                method: 'createDirectMessage',
            });
        }
        const options = { creator: me._id };
        if (excludeSelf && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-room-administration'))) {
            options.subscriptionExtra = { open: true };
        }
        try {
            yield callbacks_1.callbacks.run('federation.beforeCreateDirectMessage', roomUsers);
        }
        catch (error) {
            throw new meteor_1.Meteor.Error(error === null || error === void 0 ? void 0 : error.message);
        }
        const _a = yield (0, createRoom_1.createRoom)('d', undefined, undefined, roomUsers, false, undefined, {}, options), { _id: rid, inserted } = _a, room = __rest(_a, ["_id", "inserted"]);
        return Object.assign({ 
            // @ts-expect-error - room type is already defined in the `createRoom` return type
            t: 'd', 
            // @ts-expect-error - room id is not defined in the `createRoom` return type
            rid }, room);
    });
}
meteor_1.Meteor.methods({
    createDirectMessage(...usernames) {
        return __awaiter(this, void 0, void 0, function* () {
            return createDirectMessage(usernames, meteor_1.Meteor.userId());
        });
    },
});
RateLimiter_1.RateLimiterClass.limitMethod('createDirectMessage', 10, 60000, {
    userId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'send-many-messages'));
        });
    },
});
