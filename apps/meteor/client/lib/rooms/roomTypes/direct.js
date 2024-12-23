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
exports.DirectMessageRoomType = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../../app/authorization/client");
const client_2 = require("../../../../app/models/client");
const client_3 = require("../../../../app/settings/client");
const client_4 = require("../../../../app/utils/client");
const getAvatarURL_1 = require("../../../../app/utils/client/getAvatarURL");
const getUserAvatarURL_1 = require("../../../../app/utils/client/getUserAvatarURL");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const direct_1 = require("../../../../lib/rooms/roomTypes/direct");
const Federation = __importStar(require("../../federation/Federation"));
const roomCoordinator_1 = require("../roomCoordinator");
exports.DirectMessageRoomType = (0, direct_1.getDirectMessageRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(Object.assign(Object.assign({}, exports.DirectMessageRoomType), { label: 'Direct_Messages' }), {
    allowRoomSettingChange(_room, setting) {
        if ((0, core_typings_1.isRoomFederated)(_room)) {
            return Federation.isRoomSettingAllowed(_room, setting);
        }
        switch (setting) {
            case IRoomTypeConfig_1.RoomSettingsEnum.TYPE:
            case IRoomTypeConfig_1.RoomSettingsEnum.NAME:
            case IRoomTypeConfig_1.RoomSettingsEnum.SYSTEM_MESSAGES:
            case IRoomTypeConfig_1.RoomSettingsEnum.DESCRIPTION:
            case IRoomTypeConfig_1.RoomSettingsEnum.READ_ONLY:
            case IRoomTypeConfig_1.RoomSettingsEnum.REACT_WHEN_READ_ONLY:
            case IRoomTypeConfig_1.RoomSettingsEnum.ARCHIVE_OR_UNARCHIVE:
            case IRoomTypeConfig_1.RoomSettingsEnum.JOIN_CODE:
                return false;
            case IRoomTypeConfig_1.RoomSettingsEnum.E2E:
                return client_3.settings.get('E2E_Enable') === true;
            default:
                return true;
        }
    },
    allowMemberAction(room, action, showingUserId, userSubscription) {
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return Federation.actionAllowed(room, action, showingUserId, userSubscription);
        }
        switch (action) {
            case IRoomTypeConfig_1.RoomMemberActions.BLOCK:
                return !this.isGroupChat(room);
            default:
                return false;
        }
    },
    roomName(roomData) {
        const subscription = (() => {
            if (roomData.fname || roomData.name) {
                return {
                    fname: roomData.fname,
                    name: roomData.name,
                };
            }
            if (!roomData._id) {
                return undefined;
            }
            return client_2.Subscriptions.findOne({ rid: roomData._id });
        })();
        if (!subscription) {
            return;
        }
        if (client_3.settings.get('UI_Use_Real_Name') && subscription.fname) {
            return subscription.fname;
        }
        return subscription.name;
    },
    isGroupChat(room) {
        var _a;
        return (((_a = room === null || room === void 0 ? void 0 : room.uids) === null || _a === void 0 ? void 0 : _a.length) || 0) > 2;
    },
    getUiText(context) {
        switch (context) {
            case IRoomTypeConfig_1.UiTextContext.HIDE_WARNING:
                return 'Hide_Private_Warning';
            case IRoomTypeConfig_1.UiTextContext.LEAVE_WARNING:
                return 'Leave_Private_Warning';
            default:
                return '';
        }
    },
    condition() {
        const groupByType = (0, client_4.getUserPreference)(meteor_1.Meteor.userId(), 'sidebarGroupByType');
        return groupByType && (0, client_1.hasAtLeastOnePermission)(['view-d-room', 'view-joined-room']);
    },
    getAvatarPath(room) {
        if (!room) {
            return '';
        }
        // if coming from sidenav search
        if (room.name && room.avatarETag) {
            return (0, getUserAvatarURL_1.getUserAvatarURL)(room.name, room.avatarETag);
        }
        if (this.isGroupChat(room)) {
            return (0, getAvatarURL_1.getAvatarURL)({
                username: (room.uids || []).length + (room.usernames || []).join(),
                cache: room.avatarETag,
            });
        }
        const sub = client_2.Subscriptions.findOne({ rid: room._id }, { fields: { name: 1 } });
        if (sub === null || sub === void 0 ? void 0 : sub.name) {
            const user = client_2.Users.findOne({ username: sub.name }, { fields: { username: 1, avatarETag: 1 } });
            return (0, getUserAvatarURL_1.getUserAvatarURL)((user === null || user === void 0 ? void 0 : user.username) || sub.name, user === null || user === void 0 ? void 0 : user.avatarETag);
        }
        return (0, getUserAvatarURL_1.getUserAvatarURL)(room.name || this.roomName(room) || '');
    },
    getIcon(room) {
        if ((0, core_typings_1.isRoomFederated)(room)) {
            return 'globe';
        }
        if (this.isGroupChat(room)) {
            return 'balloon';
        }
        return 'at';
    },
    extractOpenRoomParams({ rid }) {
        return { type: 'd', reference: rid };
    },
    findRoom(identifier) {
        const query = {
            t: 'd',
            $or: [{ name: identifier }, { rid: identifier }],
        };
        const subscription = client_2.Subscriptions.findOne(query);
        if (subscription === null || subscription === void 0 ? void 0 : subscription.rid) {
            return client_2.Rooms.findOne(subscription.rid);
        }
    },
});
