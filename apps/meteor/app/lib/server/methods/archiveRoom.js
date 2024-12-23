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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const archiveRoom_1 = require("../functions/archiveRoom");
meteor_1.Meteor.methods({
    archiveRoom(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'archiveRoom' });
            }
            const user = yield models_1.Users.findOneById(userId, { projection: { username: 1, name: 1 } });
            if (!user || !(0, core_typings_1.isRegisterUser)(user)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'archiveRoom' });
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'archiveRoom' });
            }
            if (!(yield roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowMemberAction(room, IRoomTypeConfig_1.RoomMemberActions.ARCHIVE, userId))) {
                throw new meteor_1.Meteor.Error('error-direct-message-room', `rooms type: ${room.t} can not be archived`, { method: 'archiveRoom' });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'archive-room', room._id))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', { method: 'archiveRoom' });
            }
            return (0, archiveRoom_1.archiveRoom)(rid, user);
        });
    },
});
