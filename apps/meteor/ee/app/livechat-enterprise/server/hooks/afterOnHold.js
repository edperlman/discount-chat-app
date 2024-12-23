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
const i18n_1 = require("../../../../../server/lib/i18n");
const AutoCloseOnHoldScheduler_1 = require("../lib/AutoCloseOnHoldScheduler");
const logger_1 = require("../lib/logger");
let autoCloseOnHoldChatTimeout = 0;
const handleAfterOnHold = (room) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: rid } = room;
    if (!rid) {
        return;
    }
    if (!autoCloseOnHoldChatTimeout || autoCloseOnHoldChatTimeout <= 0) {
        return;
    }
    logger_1.cbLogger.debug(`Scheduling room ${rid} to be closed in ${autoCloseOnHoldChatTimeout} seconds`);
    const closeComment = server_1.settings.get('Livechat_auto_close_on_hold_chats_custom_message') ||
        i18n_1.i18n.t('Closed_automatically_because_chat_was_onhold_for_seconds', {
            onHoldTime: autoCloseOnHoldChatTimeout,
        });
    yield AutoCloseOnHoldScheduler_1.AutoCloseOnHoldScheduler.scheduleRoom(rid, autoCloseOnHoldChatTimeout, closeComment);
});
server_1.settings.watch('Livechat_auto_close_on_hold_chats_timeout', (value) => {
    autoCloseOnHoldChatTimeout = value;
    if (!value || value <= 0) {
        callbacks_1.callbacks.remove('livechat:afterOnHold', 'livechat-auto-close-on-hold');
    }
    callbacks_1.callbacks.add('livechat:afterOnHold', handleAfterOnHold, callbacks_1.callbacks.priority.HIGH, 'livechat-auto-close-on-hold');
});
