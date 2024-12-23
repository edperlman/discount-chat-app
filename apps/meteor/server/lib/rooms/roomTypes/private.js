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
const server_1 = require("../../../../app/settings/server");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const private_1 = require("../../../../lib/rooms/roomTypes/private");
const Federation_1 = require("../../../services/federation/Federation");
const roomCoordinator_1 = require("../roomCoordinator");
const PrivateRoomType = (0, private_1.getPrivateRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(PrivateRoomType, {
    allowRoomSettingChange(room, setting) {
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return Federation_1.Federation.isRoomSettingAllowed(room, setting);
        }
        switch (setting) {
            case IRoomTypeConfig_1.RoomSettingsEnum.JOIN_CODE:
                return false;
            case IRoomTypeConfig_1.RoomSettingsEnum.BROADCAST:
                return Boolean(room.broadcast);
            case IRoomTypeConfig_1.RoomSettingsEnum.READ_ONLY:
                return !room.broadcast;
            case IRoomTypeConfig_1.RoomSettingsEnum.REACT_WHEN_READ_ONLY:
                return Boolean(!room.broadcast && room.ro);
            case IRoomTypeConfig_1.RoomSettingsEnum.E2E:
                return server_1.settings.get('E2E_Enable') === true;
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
});
