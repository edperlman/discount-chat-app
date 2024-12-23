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
exports.addUsersToRoomMethod = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const i18n_1 = require("../../../../server/lib/i18n");
const Federation_1 = require("../../../../server/services/federation/Federation");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const addUserToRoom_1 = require("../functions/addUserToRoom");
const addUsersToRoomMethod = (userId, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'addUsersToRoom',
        });
    }
    if (!check_1.Match.test(data.rid, String)) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
            method: 'addUsersToRoom',
        });
    }
    // Get user and room details
    const room = yield models_1.Rooms.findOneById(data.rid);
    if (!room) {
        throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
            method: 'addUsersToRoom',
        });
    }
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(data.rid, userId, {
        projection: { _id: 1 },
    });
    const userInRoom = subscription != null;
    // Can't add to direct room ever
    if (room.t === 'd') {
        throw new meteor_1.Meteor.Error('error-cant-invite-for-direct-room', "Can't invite user to direct rooms", {
            method: 'addUsersToRoom',
        });
    }
    // Can add to any room you're in, with permission, otherwise need specific room type permission
    let canAddUser = false;
    if (userInRoom && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'add-user-to-joined-room', room._id))) {
        canAddUser = true;
    }
    else if (room.t === 'c' && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'add-user-to-any-c-room'))) {
        canAddUser = true;
    }
    else if (room.t === 'p' && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'add-user-to-any-p-room'))) {
        canAddUser = true;
    }
    // Adding wasn't allowed
    if (!canAddUser) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'addUsersToRoom',
        });
    }
    // Missing the users to be added
    if (!Array.isArray(data.users)) {
        throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Invalid arguments', {
            method: 'addUsersToRoom',
        });
    }
    // Validate each user, then add to room
    if ((0, core_typings_1.isRoomFederated)(room)) {
        yield callbacks_1.callbacks.run('federation.onAddUsersToARoom', { invitees: data.users, inviter: user }, room);
        return true;
    }
    yield Promise.all(data.users.map((username) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield models_1.Users.findOneByUsernameIgnoringCase(username);
        if (!newUser && !Federation_1.Federation.isAFederatedUsername(username)) {
            throw new meteor_1.Meteor.Error('error-invalid-username', 'Invalid username', {
                method: 'addUsersToRoom',
            });
        }
        const subscription = newUser && (yield models_1.Subscriptions.findOneByRoomIdAndUserId(data.rid, newUser._id));
        if (!subscription) {
            yield (0, addUserToRoom_1.addUserToRoom)(data.rid, newUser || username, user);
        }
        else {
            if (!newUser.username) {
                return;
            }
            void core_services_1.api.broadcast('notify.ephemeralMessage', userId, data.rid, {
                msg: i18n_1.i18n.t('Username_is_already_in_here', {
                    postProcess: 'sprintf',
                    sprintf: [newUser.username],
                    lng: user === null || user === void 0 ? void 0 : user.language,
                }),
            });
        }
    })));
    return true;
});
exports.addUsersToRoomMethod = addUsersToRoomMethod;
meteor_1.Meteor.methods({
    addUsersToRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const uid = meteor_1.Meteor.userId();
            // Validate user and room
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addUsersToRoom',
                });
            }
            return (0, exports.addUsersToRoomMethod)(uid, data, (_a = (yield meteor_1.Meteor.userAsync())) !== null && _a !== void 0 ? _a : undefined);
        });
    },
});
