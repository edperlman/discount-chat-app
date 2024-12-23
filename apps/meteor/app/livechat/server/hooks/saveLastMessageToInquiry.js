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
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const RoutingManager_1 = require("../lib/RoutingManager");
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    var _b;
    if ((0, core_typings_1.isEditedMessage)(message) || message.t) {
        return message;
    }
    if (!((_b = RoutingManager_1.RoutingManager.getConfig()) === null || _b === void 0 ? void 0 : _b.showQueue)) {
        // since last message is only getting used on UI as preview message when queue is enabled
        return message;
    }
    if (!server_1.settings.get('Store_Last_Message')) {
        return message;
    }
    const livechatInquiry = yield models_1.LivechatInquiry.setLastMessageByRoomId(room._id, message);
    if (livechatInquiry) {
        void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(livechatInquiry, 'updated', { lastMessage: message });
    }
    return message;
}), callbacks_1.callbacks.priority.LOW, 'save-last-message-to-inquiry');
