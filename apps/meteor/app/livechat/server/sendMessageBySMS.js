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
const logger_1 = require("./lib/logger");
const callbacks_1 = require("../../../lib/callbacks");
const server_1 = require("../../settings/server");
const normalizeMessageFileUpload_1 = require("../../utils/server/functions/normalizeMessageFileUpload");
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    // skips this callback if the message was edited
    if ((0, core_typings_1.isEditedMessage)(message)) {
        return message;
    }
    if (!server_1.settings.get('SMS_Enabled')) {
        return message;
    }
    // only send the sms by SMS if it is a livechat room with SMS set to true
    if (!(room.sms && room.v && room.v.token)) {
        return message;
    }
    // if the message has a token, it was sent from the visitor, so ignore it
    if (message.token) {
        return message;
    }
    // if the message has a type means it is a special message (like the closing comment), so skips
    if (message.t) {
        return message;
    }
    const { rid, u: { _id: userId } = {} } = message;
    let extraData = { rid, userId };
    if (message.file) {
        message = Object.assign(Object.assign({}, (yield (0, normalizeMessageFileUpload_1.normalizeMessageFileUpload)(message))), { _updatedAt: message._updatedAt });
        const { fileUpload } = message;
        extraData = Object.assign({}, extraData, { fileUpload });
    }
    if (message.location) {
        const { location } = message;
        extraData = Object.assign({}, extraData, { location });
    }
    const service = server_1.settings.get('SMS_Service');
    const SMSService = yield core_services_1.OmnichannelIntegration.getSmsService(service);
    if (!SMSService) {
        logger_1.callbackLogger.debug('SMS Service is not configured, skipping SMS send');
        return message;
    }
    const visitor = yield models_1.LivechatVisitors.getVisitorByToken(room.v.token, { projection: { phone: 1, source: 1 } });
    if (!(visitor === null || visitor === void 0 ? void 0 : visitor.phone) || visitor.phone.length === 0) {
        return message;
    }
    try {
        yield SMSService.send(room.sms.from, visitor.phone[0].phoneNumber, message.msg, extraData);
        logger_1.callbackLogger.debug(`SMS message sent to ${visitor.phone[0].phoneNumber} via ${service}`);
    }
    catch (e) {
        logger_1.callbackLogger.error(e);
    }
    return message;
}), callbacks_1.callbacks.priority.LOW, 'sendMessageBySms');
