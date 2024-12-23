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
const isTruthy_1 = require("../../../../lib/isTruthy");
const server_1 = require("../../../settings/server");
function validateMessage(message, room) {
    // skips this callback if the message was edited
    if ((0, core_typings_1.isEditedMessage)(message)) {
        return false;
    }
    // message valid only if it is a livechat room
    if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.v && room.v.token)) {
        return false;
    }
    // if the message hasn't a token, it was NOT sent from the visitor, so ignore it
    if (!message.token) {
        return false;
    }
    // if the message has a type means it is a special message (like the closing comment), so skips
    if (message.t) {
        return false;
    }
    return true;
}
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    var _b, _c;
    if (!validateMessage(message, room)) {
        return message;
    }
    const phoneRegexp = new RegExp(server_1.settings.get('Livechat_lead_phone_regex'), 'g');
    const msgPhones = ((_b = message.msg.match(phoneRegexp)) === null || _b === void 0 ? void 0 : _b.filter(isTruthy_1.isTruthy)) || [];
    const emailRegexp = new RegExp(server_1.settings.get('Livechat_lead_email_regex'), 'gi');
    const msgEmails = ((_c = message.msg.match(emailRegexp)) === null || _c === void 0 ? void 0 : _c.filter(isTruthy_1.isTruthy)) || [];
    if (msgEmails || msgPhones) {
        yield models_1.LivechatVisitors.saveGuestEmailPhoneById(room.v._id, msgEmails, msgPhones);
        yield callbacks_1.callbacks.run('livechat.leadCapture', room);
    }
    return message;
}), callbacks_1.callbacks.priority.LOW, 'leadCapture');
