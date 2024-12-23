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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketChatNotificationAdapter = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const Notifications_1 = __importDefault(require("../../../../../../app/notifications/server/lib/Notifications"));
const i18n_1 = require("../../../../../lib/i18n");
class RocketChatNotificationAdapter {
    notifyUserTypingOnRoom(internalRoomId, username, isTyping) {
        return __awaiter(this, void 0, void 0, function* () {
            Notifications_1.default.notifyRoom(internalRoomId, 'user-activity', username, isTyping ? ['user-typing'] : []);
        });
    }
    subscribeToUserTypingEventsOnFederatedRooms(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Rooms.findFederatedRooms({ projection: { _id: 1 } }).forEach((room) => this.subscribeToUserTypingEventsOnFederatedRoomId(room._id, callback));
        });
    }
    subscribeToUserTypingEventsOnFederatedRoomId(roomId, callback) {
        Notifications_1.default.streamRoom.on(`${roomId}/user-activity`, (username, activity) => {
            if (Array.isArray(activity) && (!activity.length || activity.includes('user-typing'))) {
                callback(username, activity, roomId);
            }
        });
    }
    broadcastUserTypingOnRoom(username, activity, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            void core_services_1.api.broadcast('user.typing', {
                user: { username },
                isTyping: activity.includes('user-typing'),
                roomId,
            });
        });
    }
    notifyWithEphemeralMessage(i18nMessageKey, userId, roomId, language = 'en') {
        void core_services_1.api.broadcast('notify.ephemeralMessage', userId, roomId, {
            msg: i18n_1.i18n.t(i18nMessageKey, {
                postProcess: 'sprintf',
                lng: language,
            }),
        });
    }
}
exports.RocketChatNotificationAdapter = RocketChatNotificationAdapter;
