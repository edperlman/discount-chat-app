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
const models_1 = require("@rocket.chat/models");
const logger_1 = require("../../../../../app/livechat/server/lib/logger");
const callbacks_1 = require("../../../../../lib/callbacks");
const i18n_1 = require("../../../../../server/lib/i18n");
const resumeOnHoldCommentAndUser = (room) => __awaiter(void 0, void 0, void 0, function* () {
    const { v: { _id: visitorId }, _id: rid, } = room;
    const visitor = yield models_1.LivechatVisitors.findOneEnabledById(visitorId, {
        projection: { name: 1, username: 1 },
    });
    if (!visitor) {
        logger_1.callbackLogger.error(`[afterOmnichannelSaveMessage] Visitor Not found for room ${rid} while trying to resume on hold`);
        throw new Error('Visitor not found while trying to resume on hold');
    }
    const guest = visitor.name || visitor.username;
    const resumeChatComment = i18n_1.i18n.t('Omnichannel_on_hold_chat_automatically', { guest });
    const resumedBy = yield models_1.Users.findOneById('rocket.cat');
    if (!resumedBy) {
        logger_1.callbackLogger.error(`[afterOmnichannelSaveMessage] User Not found for room ${rid} while trying to resume on hold`);
        throw new Error(`User not found while trying to resume on hold`);
    }
    return { comment: resumeChatComment, resumedBy };
});
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    if ((0, core_typings_1.isEditedMessage)(message) || message.t) {
        return message;
    }
    const { _id: rid, v: roomVisitor } = room;
    if (!(roomVisitor === null || roomVisitor === void 0 ? void 0 : roomVisitor._id)) {
        return message;
    }
    // Need to read the room every time, the room object is not updated
    const updatedRoom = yield models_1.LivechatRooms.findOneById(rid);
    if (!updatedRoom) {
        return message;
    }
    if ((0, core_typings_1.isMessageFromVisitor)(message) && room.onHold) {
        logger_1.callbackLogger.debug(`[afterOmnichannelSaveMessage] Room ${rid} is on hold, resuming it now since visitor sent a message`);
        try {
            const { comment: resumeChatComment, resumedBy } = yield resumeOnHoldCommentAndUser(updatedRoom);
            yield core_services_1.OmnichannelEEService.resumeRoomOnHold(updatedRoom, resumeChatComment, resumedBy);
        }
        catch (error) {
            logger_1.callbackLogger.error(`[afterOmnichannelSaveMessage] Error while resuming room ${rid} on hold: Error: `, error);
            return message;
        }
    }
    return message;
}), callbacks_1.callbacks.priority.HIGH, 'livechat-resume-on-hold');
