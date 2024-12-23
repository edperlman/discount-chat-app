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
const callbacks_1 = require("../../../../../lib/callbacks");
const ReadReceipt_1 = require("../../../../server/lib/message-read-receipt/ReadReceipt");
callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    // skips this callback if the message was edited
    if ((0, core_typings_1.isEditedMessage)(message)) {
        return message;
    }
    // mark message as read as well
    yield ReadReceipt_1.ReadReceipt.markMessageAsReadBySender(message, room, message.u._id);
    return message;
}), callbacks_1.callbacks.priority.MEDIUM, 'message-read-receipt-afterSaveMessage');
