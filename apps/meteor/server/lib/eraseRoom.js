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
exports.eraseRoom = eraseRoom;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const roomCoordinator_1 = require("./rooms/roomCoordinator");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const deleteRoom_1 = require("../../app/lib/server/functions/deleteRoom");
function eraseRoom(rid, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const room = yield models_1.Rooms.findOneById(rid);
        if (!room) {
            throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                method: 'eraseRoom',
            });
        }
        if (room.federated) {
            throw new meteor_1.Meteor.Error('error-cannot-delete-federated-room', 'Cannot delete federated room', {
                method: 'eraseRoom',
            });
        }
        if (!(yield ((_a = roomCoordinator_1.roomCoordinator
            .getRoomDirectives(room.t)) === null || _a === void 0 ? void 0 : _a.canBeDeleted((permissionId, rid) => (0, hasPermission_1.hasPermissionAsync)(uid, permissionId, rid), room)))) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                method: 'eraseRoom',
            });
        }
        const team = room.teamId && (yield core_services_1.Team.getOneById(room.teamId, { projection: { roomId: 1 } }));
        if (team && !(yield (0, hasPermission_1.hasPermissionAsync)(uid, `delete-team-${room.t === 'c' ? 'channel' : 'group'}`, team.roomId))) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                method: 'eraseRoom',
            });
        }
        if ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.isLoaded()) {
            const prevent = yield ((_c = apps_1.Apps.getBridges()) === null || _c === void 0 ? void 0 : _c.getListenerBridge().roomEvent(apps_1.AppEvents.IPreRoomDeletePrevent, room));
            if (prevent) {
                throw new meteor_1.Meteor.Error('error-app-prevented-deleting', 'A Rocket.Chat App prevented the room erasing.');
            }
        }
        yield (0, deleteRoom_1.deleteRoom)(rid);
        if (team) {
            const user = yield meteor_1.Meteor.userAsync();
            if (user) {
                yield core_services_1.Message.saveSystemMessage('user-deleted-room-from-team', team.roomId, room.name || '', user);
            }
        }
        if ((_d = apps_1.Apps.self) === null || _d === void 0 ? void 0 : _d.isLoaded()) {
            void ((_e = apps_1.Apps.getBridges()) === null || _e === void 0 ? void 0 : _e.getListenerBridge().roomEvent(apps_1.AppEvents.IPostRoomDeleted, room));
        }
    });
}
