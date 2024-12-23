"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateRoomType = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../../app/authorization/client");
const client_2 = require("../../../../app/models/client");
const client_3 = require("../../../../app/settings/client");
const client_4 = require("../../../../app/utils/client");
const getRoomAvatarURL_1 = require("../../../../app/utils/client/getRoomAvatarURL");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const private_1 = require("../../../../lib/rooms/roomTypes/private");
const Federation = __importStar(require("../../federation/Federation"));
const roomCoordinator_1 = require("../roomCoordinator");
exports.PrivateRoomType = (0, private_1.getPrivateRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.PrivateRoomType), { label: 'Private_Groups' }), {
    allowRoomSettingChange(room, setting) {
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return Federation.isRoomSettingAllowed(room, setting);
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
                return client_3.settings.get('E2E_Enable') === true;
            case IRoomTypeConfig_1.RoomSettingsEnum.SYSTEM_MESSAGES:
            default:
                return true;
        }
    },
    allowMemberAction(_room, action, showingUserId, userSubscription) {
        if ((0, core_typings_1.isRoomFederated)(_room)) {
            return Federation.actionAllowed(_room, action, showingUserId, userSubscription);
        }
        switch (action) {
            case IRoomTypeConfig_1.RoomMemberActions.BLOCK:
                return false;
            default:
                return true;
        }
    },
    roomName(roomData) {
        if (roomData.prid || (0, core_typings_1.isRoomFederated)(roomData)) {
            return roomData.fname;
        }
        if (client_3.settings.get('UI_Allow_room_names_with_special_chars')) {
            return roomData.fname || roomData.name;
        }
        return roomData.name;
    },
    isGroupChat(_room) {
        return true;
    },
    getUiText(context) {
        switch (context) {
            case IRoomTypeConfig_1.UiTextContext.HIDE_WARNING:
                return 'Hide_Group_Warning';
            case IRoomTypeConfig_1.UiTextContext.LEAVE_WARNING:
                return 'Leave_Group_Warning';
            default:
                return '';
        }
    },
    condition() {
        const groupByType = (0, client_4.getUserPreference)(meteor_1.Meteor.userId(), 'sidebarGroupByType');
        return groupByType && (0, client_1.hasPermission)('view-p-room');
    },
    getAvatarPath(room) {
        return (0, getRoomAvatarURL_1.getRoomAvatarURL)({ roomId: room._id, cache: room.avatarETag });
    },
    getIcon(room) {
        if (room.prid) {
            return 'discussion';
        }
        if (room.teamMain) {
            return 'team-lock';
        }
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return 'globe';
        }
        return 'hashtag-lock';
    },
    extractOpenRoomParams({ name }) {
        return { type: 'p', reference: name };
    },
    findRoom(identifier) {
        const query = {
            t: 'p',
            name: identifier,
        };
        return client_2.Rooms.findOne(query);
    },
});
