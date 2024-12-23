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
exports.sendMessage = exports.validateMessage = void 0;
exports.prepareMessageObject = prepareMessageObject;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const parseUrlsInMessage_1 = require("./parseUrlsInMessage");
const isRelativeURL_1 = require("../../../../lib/utils/isRelativeURL");
const isURL_1 = require("../../../../lib/utils/isURL");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../file-upload/server");
const server_2 = require("../../../settings/server");
const afterSaveMessage_1 = require("../lib/afterSaveMessage");
const notifyListener_1 = require("../lib/notifyListener");
const validateCustomMessageFields_1 = require("../lib/validateCustomMessageFields");
// TODO: most of the types here are wrong, but I don't want to change them now
/**
 * IMPORTANT
 *
 * This validator prevents malicious href values
 * intending to run arbitrary js code in anchor tags.
 * You should use it whenever the value you're checking
 * is going to be rendered in the href attribute of a
 * link.
 */
const validFullURLParam = check_1.Match.Where((value) => {
    (0, check_1.check)(value, String);
    if (!(0, isURL_1.isURL)(value) && !value.startsWith(server_1.FileUpload.getPath())) {
        throw new Error('Invalid href value provided');
    }
    if (/^javascript:/i.test(value)) {
        throw new Error('Invalid href value provided');
    }
    return true;
});
const validPartialURLParam = check_1.Match.Where((value) => {
    (0, check_1.check)(value, String);
    if (!(0, isRelativeURL_1.isRelativeURL)(value) && !(0, isURL_1.isURL)(value) && !value.startsWith(server_1.FileUpload.getPath())) {
        throw new Error('Invalid href value provided');
    }
    if (/^javascript:/i.test(value)) {
        throw new Error('Invalid href value provided');
    }
    return true;
});
const objectMaybeIncluding = (types) => check_1.Match.Where((value) => {
    Object.keys(types).forEach((field) => {
        if (value[field] != null) {
            try {
                (0, check_1.check)(value[field], types[field]);
            }
            catch (error) {
                error.path = field;
                throw error;
            }
        }
    });
    return true;
});
const validateAttachmentsFields = (attachmentField) => {
    (0, check_1.check)(attachmentField, objectMaybeIncluding({
        short: Boolean,
        title: String,
        value: check_1.Match.OneOf(String, Number, Boolean),
    }));
    if (typeof attachmentField.value !== 'undefined') {
        attachmentField.value = String(attachmentField.value);
    }
};
const validateAttachmentsActions = (attachmentActions) => {
    (0, check_1.check)(attachmentActions, objectMaybeIncluding({
        type: String,
        text: String,
        url: validFullURLParam,
        image_url: validFullURLParam,
        is_webview: Boolean,
        webview_height_ratio: String,
        msg: String,
        msg_in_chat_window: Boolean,
    }));
};
const validateAttachment = (attachment) => {
    var _a, _b;
    (0, check_1.check)(attachment, objectMaybeIncluding({
        color: String,
        text: String,
        ts: check_1.Match.OneOf(String, Number),
        thumb_url: validFullURLParam,
        button_alignment: String,
        actions: [check_1.Match.Any],
        message_link: validFullURLParam,
        collapsed: Boolean,
        author_name: String,
        author_link: validFullURLParam,
        author_icon: validFullURLParam,
        title: String,
        title_link: validFullURLParam,
        title_link_download: Boolean,
        image_dimensions: Object,
        image_url: validFullURLParam,
        image_preview: String,
        image_type: String,
        image_size: Number,
        audio_url: validFullURLParam,
        audio_type: String,
        audio_size: Number,
        video_url: validFullURLParam,
        video_type: String,
        video_size: Number,
        fields: [check_1.Match.Any],
    }));
    if ((_a = attachment.fields) === null || _a === void 0 ? void 0 : _a.length) {
        attachment.fields.map(validateAttachmentsFields);
    }
    if ((_b = attachment.actions) === null || _b === void 0 ? void 0 : _b.length) {
        attachment.actions.map(validateAttachmentsActions);
    }
};
const validateBodyAttachments = (attachments) => attachments.map(validateAttachment);
const validateMessage = (message, room, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, check_1.check)(message, objectMaybeIncluding({
        _id: String,
        msg: String,
        text: String,
        alias: String,
        emoji: String,
        tmid: String,
        tshow: Boolean,
        avatar: validPartialURLParam,
        attachments: [check_1.Match.Any],
        blocks: [check_1.Match.Any],
    }));
    if (message.alias || message.avatar) {
        const isLiveChatGuest = !message.avatar && user.token && user.token === ((_a = room.v) === null || _a === void 0 ? void 0 : _a.token);
        if (!isLiveChatGuest && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'message-impersonate', room._id))) {
            throw new Error('Not enough permission');
        }
    }
    if (Array.isArray(message.attachments) && message.attachments.length) {
        validateBodyAttachments(message.attachments);
    }
    if (message.customFields) {
        (0, validateCustomMessageFields_1.validateCustomMessageFields)({
            customFields: message.customFields,
            messageCustomFieldsEnabled: server_2.settings.get('Message_CustomFields_Enabled'),
            messageCustomFields: server_2.settings.get('Message_CustomFields'),
        });
    }
});
exports.validateMessage = validateMessage;
function prepareMessageObject(message, rid, user) {
    if (!message.ts) {
        message.ts = new Date();
    }
    if (message.tshow !== true) {
        delete message.tshow;
    }
    const { _id, username, name } = user;
    message.u = {
        _id,
        username: username, // FIXME: this is wrong but I don't want to change it now
        name,
    };
    message.rid = rid;
    if (!check_1.Match.test(message.msg, String)) {
        message.msg = '';
    }
    if (message.ts == null) {
        message.ts = new Date();
    }
}
/**
 * Validates and sends the message object.
 */
const sendMessage = function (user_1, message_1, room_1) {
    return __awaiter(this, arguments, void 0, function* (user, message, room, upsert = false, previewUrls) {
        var _a, _b, _c, _d;
        if (!user || !message || !room._id) {
            return false;
        }
        yield (0, exports.validateMessage)(message, room, user);
        prepareMessageObject(message, room._id, user);
        if (message.t === 'otr') {
            void core_services_1.api.broadcast('otrMessage', { roomId: message.rid, message, user, room });
            return message;
        }
        if (server_2.settings.get('Message_Read_Receipt_Enabled')) {
            message.unread = true;
        }
        // For the Rocket.Chat Apps :)
        if ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.isLoaded()) {
            const listenerBridge = (_b = apps_1.Apps.getBridges()) === null || _b === void 0 ? void 0 : _b.getListenerBridge();
            const prevent = yield (listenerBridge === null || listenerBridge === void 0 ? void 0 : listenerBridge.messageEvent('IPreMessageSentPrevent', message));
            if (prevent) {
                return;
            }
            const result = yield (listenerBridge === null || listenerBridge === void 0 ? void 0 : listenerBridge.messageEvent('IPreMessageSentModify', yield (listenerBridge === null || listenerBridge === void 0 ? void 0 : listenerBridge.messageEvent('IPreMessageSentExtend', message))));
            if (typeof result === 'object') {
                message = Object.assign(message, result);
                // Some app may have inserted malicious/invalid values in the message, let's check it again
                yield (0, exports.validateMessage)(message, room, user);
            }
        }
        (0, parseUrlsInMessage_1.parseUrlsInMessage)(message, previewUrls);
        message = yield core_services_1.Message.beforeSave({ message, room, user });
        if (!message) {
            return;
        }
        if (message._id && upsert) {
            const { _id } = message;
            delete message._id;
            yield models_1.Messages.updateOne({
                _id,
                'u._id': message.u._id,
            }, { $set: message }, { upsert: true });
            message._id = _id;
        }
        else {
            const messageAlreadyExists = message._id && (yield models_1.Messages.findOneById(message._id, { projection: { _id: 1 } }));
            if (messageAlreadyExists) {
                return;
            }
            const { insertedId } = yield models_1.Messages.insertOne(message);
            message._id = insertedId;
        }
        if ((_c = apps_1.Apps.self) === null || _c === void 0 ? void 0 : _c.isLoaded()) {
            // This returns a promise, but it won't mutate anything about the message
            // so, we don't really care if it is successful or fails
            void ((_d = apps_1.Apps.getBridges()) === null || _d === void 0 ? void 0 : _d.getListenerBridge().messageEvent('IPostMessageSent', message));
        }
        // TODO: is there an opportunity to send returned data to notifyOnMessageChange?
        yield (0, afterSaveMessage_1.afterSaveMessage)(message, room);
        void (0, notifyListener_1.notifyOnMessageChange)({ id: message._id });
        void (0, notifyListener_1.notifyOnRoomChangedById)(message.rid);
        return message;
    });
};
exports.sendMessage = sendMessage;
