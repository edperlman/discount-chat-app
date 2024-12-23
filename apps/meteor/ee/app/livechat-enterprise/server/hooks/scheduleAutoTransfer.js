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
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const AutoTransferChatScheduler_1 = require("../lib/AutoTransferChatScheduler");
const logger_1 = require("../lib/logger");
let autoTransferTimeout = 0;
const handleAfterCloseRoom = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { room } = params;
    const { _id: rid, autoTransferredAt, autoTransferOngoing } = room;
    if (!autoTransferTimeout || autoTransferTimeout <= 0) {
        return params;
    }
    if (autoTransferredAt) {
        return params;
    }
    if (!autoTransferOngoing) {
        return params;
    }
    yield AutoTransferChatScheduler_1.AutoTransferChatScheduler.unscheduleRoom(rid);
    return params;
});
server_1.settings.watch('Livechat_auto_transfer_chat_timeout', (value) => {
    autoTransferTimeout = value;
    if (!autoTransferTimeout || autoTransferTimeout === 0) {
        callbacks_1.callbacks.remove('livechat.afterTakeInquiry', 'livechat-auto-transfer-job-inquiry');
        callbacks_1.callbacks.remove('afterOmnichannelSaveMessage', 'livechat-cancel-auto-transfer-job-after-message');
        callbacks_1.callbacks.remove('livechat.closeRoom', 'livechat-cancel-auto-transfer-on-close-room');
        return;
    }
    callbacks_1.callbacks.add('livechat.afterTakeInquiry', (_a) => __awaiter(void 0, [_a], void 0, function* ({ inquiry, room }) {
        const { rid } = inquiry;
        if (!(rid === null || rid === void 0 ? void 0 : rid.trim())) {
            return;
        }
        if (room.autoTransferredAt || room.autoTransferOngoing) {
            return inquiry;
        }
        logger_1.cbLogger.info(`Room ${room._id} will be scheduled to be auto transfered after ${autoTransferTimeout} seconds`);
        yield AutoTransferChatScheduler_1.AutoTransferChatScheduler.scheduleRoom(rid, autoTransferTimeout);
        return inquiry;
    }), callbacks_1.callbacks.priority.MEDIUM, 'livechat-auto-transfer-job-inquiry');
    callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
        const { _id: rid, autoTransferredAt, autoTransferOngoing } = room;
        const { token, t: messageType } = message;
        if (messageType) {
            // ignore system messages
            return message;
        }
        if (!autoTransferTimeout || autoTransferTimeout <= 0) {
            return message;
        }
        if (!message || token) {
            // ignore messages from visitors
            return message;
        }
        if (autoTransferredAt) {
            return message;
        }
        if (!autoTransferOngoing) {
            return message;
        }
        yield AutoTransferChatScheduler_1.AutoTransferChatScheduler.unscheduleRoom(rid);
        return message;
    }), callbacks_1.callbacks.priority.HIGH, 'livechat-cancel-auto-transfer-job-after-message');
    callbacks_1.callbacks.add('livechat.closeRoom', handleAfterCloseRoom, callbacks_1.callbacks.priority.HIGH, 'livechat-cancel-auto-transfer-on-close-room');
});
