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
callbacks_1.callbacks.add('livechat.newRoom', (room) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        return room;
    }
    const { _id, v: { _id: guestId }, source, contactId, } = room;
    const lastChat = {
        _id,
        ts: new Date(),
    };
    yield models_1.LivechatVisitors.setLastChatById(guestId, lastChat);
    if (contactId) {
        yield models_1.LivechatContacts.updateLastChatById(contactId, {
            visitorId: guestId,
            source,
        }, lastChat);
    }
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-save-last-chat');
