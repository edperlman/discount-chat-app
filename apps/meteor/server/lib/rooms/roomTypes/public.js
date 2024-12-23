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
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const server_1 = require("../../../../app/settings/server");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const public_1 = require("../../../../lib/rooms/roomTypes/public");
const Federation_1 = require("../../../services/federation/Federation");
const roomCoordinator_1 = require("../roomCoordinator");
const PublicRoomType = (0, public_1.getPublicRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(PublicRoomType, {
    allowRoomSettingChange(room, setting) {
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return Federation_1.Federation.isRoomSettingAllowed(room, setting);
        }
        switch (setting) {
            case IRoomTypeConfig_1.RoomSettingsEnum.BROADCAST:
                return Boolean(room.broadcast);
            case IRoomTypeConfig_1.RoomSettingsEnum.READ_ONLY:
                return Boolean(!room.broadcast);
            case IRoomTypeConfig_1.RoomSettingsEnum.REACT_WHEN_READ_ONLY:
                return Boolean(!room.broadcast && room.ro);
            case IRoomTypeConfig_1.RoomSettingsEnum.E2E:
                return false;
            case IRoomTypeConfig_1.RoomSettingsEnum.SYSTEM_MESSAGES:
            default:
                return true;
        }
    },
    allowMemberAction(_room, action, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, core_typings_1.isRoomFederated)(_room)) {
                return Federation_1.Federation.actionAllowed(_room, action, userId);
            }
            switch (action) {
                case IRoomTypeConfig_1.RoomMemberActions.BLOCK:
                    return false;
                default:
                    return true;
            }
        });
    },
    roomName(room, _userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (room.prid || (0, core_typings_1.isRoomFederated)(room)) {
                return room.fname;
            }
            if (server_1.settings.get('UI_Allow_room_names_with_special_chars')) {
                return room.fname || room.name;
            }
            return room.name;
        });
    },
    isGroupChat(_room) {
        return true;
    },
    includeInDashboard() {
        return true;
    },
    getDiscussionType(room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (room === null || room === void 0 ? void 0 : room.teamId) {
                const team = yield core_services_1.Team.getOneById(room.teamId, { projection: { type: 1 } });
                if ((team === null || team === void 0 ? void 0 : team.type) === core_typings_1.TEAM_TYPE.PRIVATE) {
                    return 'p';
                }
            }
            return 'c';
        });
    },
    includeInRoomSearch() {
        return true;
    },
});
