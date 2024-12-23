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
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../../app/settings/server");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const direct_1 = require("../../../../lib/rooms/roomTypes/direct");
const Federation_1 = require("../../../services/federation/Federation");
const roomCoordinator_1 = require("../roomCoordinator");
const DirectMessageRoomType = (0, direct_1.getDirectMessageRoomType)(roomCoordinator_1.roomCoordinator);
const getCurrentUserId = () => {
    try {
        return meteor_1.Meteor.userId() || undefined;
    }
    catch (_e) {
        //
    }
};
roomCoordinator_1.roomCoordinator.add(DirectMessageRoomType, {
    allowRoomSettingChange(_room, setting) {
        if ((0, core_typings_1.isRoomFederated)(_room)) {
            return Federation_1.Federation.isRoomSettingAllowed(_room, setting);
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
                return server_1.settings.get('E2E_Enable') === true;
            default:
                return true;
        }
    },
    allowMemberAction(room, action, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, core_typings_1.isRoomFederated)(room)) {
                return Federation_1.Federation.actionAllowed(room, action, userId);
            }
            switch (action) {
                case IRoomTypeConfig_1.RoomMemberActions.BLOCK:
                    return !this.isGroupChat(room);
                default:
                    return false;
            }
        });
    },
    roomName(room, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield (() => __awaiter(this, void 0, void 0, function* () {
                if (room.fname || room.name) {
                    return {
                        fname: room.fname,
                        name: room.name,
                    };
                }
                if (!room._id) {
                    return null;
                }
                const uid = userId || getCurrentUserId();
                if (uid) {
                    return models_1.Subscriptions.findOneByRoomIdAndUserId(room._id, uid, { projection: { name: 1, fname: 1 } });
                }
                // If we don't know what user is requesting the roomName, then any subscription will do
                return models_1.Subscriptions.findOne({ rid: room._id }, { projection: { name: 1, fname: 1 } });
            }))();
            if (!subscription) {
                return;
            }
            if (server_1.settings.get('UI_Use_Real_Name') && room.fname) {
                return subscription.fname;
            }
            return subscription.name;
        });
    },
    isGroupChat(room) {
        var _a;
        return (((_a = room === null || room === void 0 ? void 0 : room.uids) === null || _a === void 0 ? void 0 : _a.length) || 0) > 2;
    },
    getNotificationDetails(room, sender, notificationMessage, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const useRealName = server_1.settings.get('UI_Use_Real_Name');
            const displayRoomName = yield this.roomName(room, userId);
            if (this.isGroupChat(room)) {
                return {
                    title: displayRoomName,
                    text: `${(useRealName && sender.name) || sender.username}: ${notificationMessage}`,
                    name: room.name || displayRoomName,
                };
            }
            return {
                title: (useRealName && sender.name) || sender.username,
                text: notificationMessage,
                name: room.name || displayRoomName,
            };
        });
    },
    includeInDashboard() {
        return true;
    },
});
