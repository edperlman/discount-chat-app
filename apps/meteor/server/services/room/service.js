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
exports.RoomService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const BeforeFederationActions_1 = require("./hooks/BeforeFederationActions");
const saveRoomTopic_1 = require("../../../app/channel-settings/server/functions/saveRoomTopic");
const addUserToRoom_1 = require("../../../app/lib/server/functions/addUserToRoom");
const createRoom_1 = require("../../../app/lib/server/functions/createRoom"); // TODO remove this import
const removeUserFromRoom_1 = require("../../../app/lib/server/functions/removeUserFromRoom");
const getValidRoomName_1 = require("../../../app/utils/server/lib/getValidRoomName");
const IRoomTypeConfig_1 = require("../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../lib/rooms/roomCoordinator");
const createDirectMessage_1 = require("../../methods/createDirectMessage");
class RoomService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'room';
    }
    create(uid, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, name, members = [], readOnly, extraData, options, sidepanel } = params;
            const hasPermission = yield core_services_1.Authorization.hasPermission(uid, `create-${type}`);
            if (!hasPermission) {
                throw new Error('no-permission');
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new Error('User not found');
            }
            // TODO convert `createRoom` function to "raw" and move to here
            return (0, createRoom_1.createRoom)(type, name, user, members, false, readOnly, extraData, options, sidepanel);
        });
    }
    createDirectMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ to, from }) {
            const [toUser, fromUser] = yield Promise.all([
                models_1.Users.findOneById(to, { projection: { username: 1 } }),
                models_1.Users.findOneById(from, { projection: { _id: 1 } }),
            ]);
            if (!(toUser === null || toUser === void 0 ? void 0 : toUser.username) || !fromUser) {
                throw new Error('error-invalid-user');
            }
            return this.createDirectMessageWithMultipleUsers([toUser.username], fromUser._id);
        });
    }
    createDirectMessageWithMultipleUsers(members, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, createDirectMessage_1.createDirectMessage)(members, creatorId);
        });
    }
    addMember(uid, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasPermission = yield core_services_1.Authorization.hasPermission(uid, 'add-user-to-joined-room', rid);
            if (!hasPermission) {
                throw new Error('no-permission');
            }
            return true;
        });
    }
    addUserToRoom(roomId, user, inviter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, addUserToRoom_1.addUserToRoom)(roomId, user, inviter, options);
        });
    }
    removeUserFromRoom(roomId, user, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, removeUserFromRoom_1.removeUserFromRoom)(roomId, user, options);
        });
    }
    getValidRoomName(displayName_1) {
        return __awaiter(this, arguments, void 0, function* (displayName, roomId = '', options = {}) {
            return (0, getValidRoomName_1.getValidRoomName)(displayName, roomId, options);
        });
    }
    saveRoomTopic(roomId_1, roomTopic_1, user_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, roomTopic, user, sendMessage = true) {
            yield (0, saveRoomTopic_1.saveRoomTopic)(roomId, roomTopic, user, sendMessage);
        });
    }
    getRouteLink(room) {
        return __awaiter(this, void 0, void 0, function* () {
            return roomCoordinator_1.roomCoordinator.getRouteLink(room.t, { rid: room._id, name: room.name });
        });
    }
    /**
     * Method called by users to join a room.
     */
    join(_a) {
        return __awaiter(this, arguments, void 0, function* ({ room, user, joinCode }) {
            var _b;
            if (!(yield ((_b = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t)) === null || _b === void 0 ? void 0 : _b.allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.JOIN, user._id)))) {
                throw new core_services_1.MeteorError('error-not-allowed', 'Not allowed', { method: 'joinRoom' });
            }
            if (!(yield core_services_1.Authorization.canAccessRoom(room, user))) {
                throw new core_services_1.MeteorError('error-not-allowed', 'Not allowed', { method: 'joinRoom' });
            }
            if ((0, core_typings_1.isRoomWithJoinCode)(room) && !(yield core_services_1.Authorization.hasPermission(user._id, 'join-without-join-code'))) {
                if (!joinCode) {
                    throw new core_services_1.MeteorError('error-code-required', 'Code required', { method: 'joinRoom' });
                }
                const isCorrectJoinCode = !!(yield models_1.Rooms.findOneByJoinCodeAndId(joinCode, room._id, {
                    projection: { _id: 1 },
                }));
                if (!isCorrectJoinCode) {
                    throw new core_services_1.MeteorError('error-code-invalid', 'Invalid code', { method: 'joinRoom' });
                }
            }
            return (0, addUserToRoom_1.addUserToRoom)(room._id, user);
        });
    }
    beforeLeave(room) {
        return __awaiter(this, void 0, void 0, function* () {
            BeforeFederationActions_1.FederationActions.blockIfRoomFederatedButServiceNotReady(room);
        });
    }
    beforeUserRemoved(room) {
        return __awaiter(this, void 0, void 0, function* () {
            BeforeFederationActions_1.FederationActions.blockIfRoomFederatedButServiceNotReady(room);
        });
    }
    beforeNameChange(room) {
        return __awaiter(this, void 0, void 0, function* () {
            BeforeFederationActions_1.FederationActions.blockIfRoomFederatedButServiceNotReady(room);
        });
    }
    beforeTopicChange(room) {
        return __awaiter(this, void 0, void 0, function* () {
            BeforeFederationActions_1.FederationActions.blockIfRoomFederatedButServiceNotReady(room);
        });
    }
}
exports.RoomService = RoomService;
