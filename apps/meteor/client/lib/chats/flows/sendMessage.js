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
exports.sendMessage = void 0;
const KonchatNotification_1 = require("../../../../app/ui/client/lib/KonchatNotification");
const SDKClient_1 = require("../../../../app/utils/client/lib/SDKClient");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const onClientBeforeSendMessage_1 = require("../../onClientBeforeSendMessage");
const toast_1 = require("../../toast");
const processMessageEditing_1 = require("./processMessageEditing");
const processSetReaction_1 = require("./processSetReaction");
const processSlashCommand_1 = require("./processSlashCommand");
const processTooLongMessage_1 = require("./processTooLongMessage");
const process = (chat, message, previewUrls, isSlashCommandAllowed) => __awaiter(void 0, void 0, void 0, function* () {
    KonchatNotification_1.KonchatNotification.removeRoomNotification(message.rid);
    if (yield (0, processSetReaction_1.processSetReaction)(chat, message)) {
        return;
    }
    if (yield (0, processTooLongMessage_1.processTooLongMessage)(chat, message)) {
        return;
    }
    if (isSlashCommandAllowed && (yield (0, processSlashCommand_1.processSlashCommand)(chat, message))) {
        return;
    }
    message = (yield (0, onClientBeforeSendMessage_1.onClientBeforeSendMessage)(message));
    // e2e should be a client property only
    delete message.e2e;
    if (yield (0, processMessageEditing_1.processMessageEditing)(chat, message, previewUrls)) {
        return;
    }
    yield SDKClient_1.sdk.call('sendMessage', message, previewUrls);
});
const sendMessage = (chat_1, _a) => __awaiter(void 0, [chat_1, _a], void 0, function* (chat, { text, tshow, previewUrls, isSlashCommandAllowed, }) {
    var _b, _c, _d, _e;
    if (!(yield chat.data.isSubscribedToRoom())) {
        try {
            yield chat.data.joinRoom();
        }
        catch (error) {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
            return false;
        }
    }
    chat.readStateManager.clearUnreadMark();
    text = text.trim();
    if (!text && !chat.currentEditing) {
        // Nothing to do
        return false;
    }
    if (text) {
        const message = yield chat.data.composeMessage(text, {
            sendToChannel: tshow,
            quotedMessages: (_c = (_b = chat.composer) === null || _b === void 0 ? void 0 : _b.quotedMessages.get()) !== null && _c !== void 0 ? _c : [],
            originalMessage: chat.currentEditing ? yield chat.data.findMessageByID(chat.currentEditing.mid) : null,
        });
        if (chat.currentEditing) {
            const originalMessage = yield chat.data.findMessageByID(chat.currentEditing.mid);
            if ((originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.t) === 'e2e' &&
                originalMessage.attachments &&
                originalMessage.attachments.length > 0 &&
                originalMessage.attachments[0].description !== undefined) {
                originalMessage.attachments[0].description = message.msg;
                message.attachments = originalMessage.attachments;
                message.msg = originalMessage.msg;
            }
        }
        try {
            yield process(chat, message, previewUrls, isSlashCommandAllowed);
            (_d = chat.composer) === null || _d === void 0 ? void 0 : _d.dismissAllQuotedMessages();
        }
        catch (error) {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
        }
        return true;
    }
    if (chat.currentEditing) {
        const originalMessage = yield chat.data.findMessageByID(chat.currentEditing.mid);
        if (!originalMessage) {
            (0, toast_1.dispatchToastMessage)({ type: 'warning', message: (0, i18n_1.t)('Message_not_found') });
            return false;
        }
        try {
            if (yield chat.flows.processMessageEditing(Object.assign(Object.assign({}, originalMessage), { msg: '' }), previewUrls)) {
                chat.currentEditing.stop();
                return false;
            }
            yield ((_e = chat.currentEditing) === null || _e === void 0 ? void 0 : _e.reset());
            yield chat.flows.requestMessageDeletion(originalMessage);
            return false;
        }
        catch (error) {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: error });
        }
    }
    return false;
});
exports.sendMessage = sendMessage;
