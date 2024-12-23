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
const models_1 = require("@rocket.chat/models");
const voip_1 = require("../../../../lib/rooms/roomTypes/voip");
const roomCoordinator_1 = require("../roomCoordinator");
const VoipRoomType = (0, voip_1.getVoipRoomType)(roomCoordinator_1.roomCoordinator);
roomCoordinator_1.roomCoordinator.add(VoipRoomType, {
    roomName(room, _userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return room.name || room.fname || room.label;
        });
    },
    getNotificationDetails(room, _sender, notificationMessage, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = `[Omnichannel] ${this.roomName(room, userId)}`;
            const text = notificationMessage;
            return { title, text, name: room.name };
        });
    },
    getMsgSender(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.findOneById(message.u._id);
        });
    },
});
