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
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const livechat_1 = require("../../../../lib/rooms/roomTypes/livechat");
const roomCoordinator_1 = require("../roomCoordinator");
const LivechatRoomType = (0, livechat_1.getLivechatRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(LivechatRoomType, {
    allowRoomSettingChange(_room, setting) {
        switch (setting) {
            case IRoomTypeConfig_1.RoomSettingsEnum.JOIN_CODE:
                return false;
            default:
                return true;
        }
    },
    allowMemberAction(_room, action) {
        return __awaiter(this, void 0, void 0, function* () {
            return [IRoomTypeConfig_1.RoomMemberActions.INVITE, IRoomTypeConfig_1.RoomMemberActions.JOIN].includes(action);
        });
    },
    roomName(room, _userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return room.name || room.fname || room.label;
        });
    },
    canAccessUploadedFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rc_token: token, rc_rid: rid }) {
            return token && rid && !!(yield models_1.LivechatRooms.findOneByIdAndVisitorToken(rid, token));
        });
    },
    getNotificationDetails(room, _sender, notificationMessage, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomName = yield this.roomName(room, userId);
            const title = `[Omnichannel] ${roomName}`;
            const text = notificationMessage;
            return { title, text, name: roomName };
        });
    },
    getMsgSender(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, core_typings_1.isMessageFromVisitor)(message)) {
                return models_1.LivechatVisitors.findOneEnabledById(message.u._id);
            }
        });
    },
    getReadReceiptsExtraData(message) {
        const { token } = message;
        return { token };
    },
});
