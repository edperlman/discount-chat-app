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
exports.addUserToRoom = void 0;
const apps_1 = require("@rocket.chat/apps");
const exceptions_1 = require("@rocket.chat/apps-engine/definition/exceptions");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const callbacks_1 = require("../../../../lib/callbacks");
const getSubscriptionAutotranslateDefaultConfig_1 = require("../../../../server/lib/getSubscriptionAutotranslateDefaultConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const server_1 = require("../../../settings/server");
const getDefaultSubscriptionPref_1 = require("../../../utils/lib/getDefaultSubscriptionPref");
const notifyListener_1 = require("../lib/notifyListener");
const addUserToRoom = function (rid_1, user_1, inviter_1) {
    return __awaiter(this, arguments, void 0, function* (rid, user, inviter, { skipSystemMessage, skipAlertSound, } = {}) {
        var _a, _b;
        const now = new Date();
        const room = yield models_1.Rooms.findOneById(rid);
        if (!room) {
            throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                method: 'addUserToRoom',
            });
        }
        const userToBeAdded = typeof user === 'string' ? yield models_1.Users.findOneByUsername(user.replace('@', '')) : yield models_1.Users.findOneById(user._id);
        const roomDirectives = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t);
        if (!userToBeAdded) {
            throw new meteor_1.Meteor.Error('user-not-found');
        }
        if (!(yield roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.JOIN, userToBeAdded._id)) &&
            !(yield roomDirectives.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.INVITE, userToBeAdded._id))) {
            return;
        }
        try {
            yield callbacks_1.callbacks.run('federation.beforeAddUserToARoom', { user: userToBeAdded, inviter }, room);
        }
        catch (error) {
            throw new meteor_1.Meteor.Error(error === null || error === void 0 ? void 0 : error.message);
        }
        yield callbacks_1.callbacks.run('beforeAddedToRoom', { user: userToBeAdded, inviter });
        // Check if user is already in room
        const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, userToBeAdded._id);
        if (subscription || !userToBeAdded) {
            return;
        }
        try {
            yield ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPreRoomUserJoined, room, userToBeAdded, inviter));
        }
        catch (error) {
            if (error.name === exceptions_1.AppsEngineException.name) {
                throw new meteor_1.Meteor.Error('error-app-prevented', error.message);
            }
            throw error;
        }
        if (room.t === 'c' || room.t === 'p' || room.t === 'l') {
            // Add a new event, with an optional inviter
            yield callbacks_1.callbacks.run('beforeAddedToRoom', { user: userToBeAdded, inviter }, room);
            // Keep the current event
            yield callbacks_1.callbacks.run('beforeJoinRoom', userToBeAdded, room);
        }
        const autoTranslateConfig = (0, getSubscriptionAutotranslateDefaultConfig_1.getSubscriptionAutotranslateDefaultConfig)(userToBeAdded);
        const { insertedId } = yield models_1.Subscriptions.createWithRoomAndUser(room, userToBeAdded, Object.assign(Object.assign({ ts: now, open: true, alert: !skipAlertSound, unread: 1, userMentions: 1, groupMentions: 0 }, autoTranslateConfig), (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(userToBeAdded)));
        if (insertedId) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedById)(insertedId, 'inserted');
        }
        if (!userToBeAdded.username) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Cannot add an user to a room without a username');
        }
        if (!skipSystemMessage) {
            if (inviter) {
                const extraData = {
                    ts: now,
                    u: {
                        _id: inviter._id,
                        username: inviter.username,
                    },
                };
                if (room.teamMain) {
                    yield core_services_1.Message.saveSystemMessage('added-user-to-team', rid, userToBeAdded.username, userToBeAdded, extraData);
                }
                else {
                    yield core_services_1.Message.saveSystemMessage('au', rid, userToBeAdded.username, userToBeAdded, extraData);
                }
            }
            else if (room.prid) {
                yield core_services_1.Message.saveSystemMessage('ut', rid, userToBeAdded.username, userToBeAdded, { ts: now });
            }
            else if (room.teamMain) {
                yield core_services_1.Message.saveSystemMessage('ujt', rid, userToBeAdded.username, userToBeAdded, { ts: now });
            }
            else {
                yield core_services_1.Message.saveSystemMessage('uj', rid, userToBeAdded.username, userToBeAdded, { ts: now });
            }
        }
        if (room.t === 'c' || room.t === 'p') {
            process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // Add a new event, with an optional inviter
                yield callbacks_1.callbacks.run('afterAddedToRoom', { user: userToBeAdded, inviter }, room);
                // Keep the current event
                yield callbacks_1.callbacks.run('afterJoinRoom', userToBeAdded, room);
                void ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.triggerEvent(apps_1.AppEvents.IPostRoomUserJoined, room, userToBeAdded, inviter));
            }));
        }
        if (room.teamMain && room.teamId) {
            // if user is joining to main team channel, create a membership
            yield core_services_1.Team.addMember(inviter || userToBeAdded, userToBeAdded._id, room.teamId);
        }
        if (room.encrypted && server_1.settings.get('E2E_Enable') && ((_b = userToBeAdded.e2e) === null || _b === void 0 ? void 0 : _b.public_key)) {
            yield models_1.Rooms.addUserIdToE2EEQueueByRoomIds([room._id], userToBeAdded._id);
        }
        void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
        return true;
    });
};
exports.addUserToRoom = addUserToRoom;
