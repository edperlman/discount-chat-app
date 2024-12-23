"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePossibleNullMessageValues = exports.parseMessageAttachments = exports.parseMessageAttachment = exports.parseMessageTextToAstMarkdown = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const message_parser_1 = require("@rocket.chat/message-parser");
const isParsedMessage_1 = require("../views/room/MessageList/lib/isParsedMessage");
/**
 * Removes null values for known properties values.
 * Adds a property `md` to the message with the parsed message if is not provided.
 * if has `attachments` property, but attachment is missing `md` property, it will be added.
 * if translation is enabled and message contains `translations` property, it will be replaced by the parsed message.
 * @param message The message to be parsed.
 * @param parseOptions The options to be used in the parser.
 * @param autoTranslateOptions The auto translate options to be used in the parser.
 * @returns message normalized.
 */
const parseMessageTextToAstMarkdown = (message, parseOptions, autoTranslateOptions) => {
    var _a;
    const msg = (0, exports.removePossibleNullMessageValues)(message);
    const { showAutoTranslate, autoTranslateLanguage } = autoTranslateOptions;
    const translations = autoTranslateLanguage && (0, core_typings_1.isTranslatedMessage)(msg) && msg.translations;
    const translated = showAutoTranslate(message);
    const text = (translated && translations && translations[autoTranslateLanguage]) || msg.msg;
    return Object.assign(Object.assign(Object.assign({}, msg), { md: (0, core_typings_1.isE2EEMessage)(message) || (0, core_typings_1.isOTRMessage)(message) || (0, core_typings_1.isOTRAckMessage)(message) || translated
            ? textToMessageToken(text, parseOptions)
            : ((_a = msg.md) !== null && _a !== void 0 ? _a : textToMessageToken(text, parseOptions)) }), (msg.attachments && {
        attachments: (0, exports.parseMessageAttachments)(msg.attachments, parseOptions, { autoTranslateLanguage, translated }),
    }));
};
exports.parseMessageTextToAstMarkdown = parseMessageTextToAstMarkdown;
const parseMessageAttachment = (attachment, parseOptions, autoTranslateOptions) => {
    var _a, _b, _c;
    const { translated, autoTranslateLanguage } = autoTranslateOptions;
    if (!attachment.text && !attachment.description) {
        return attachment;
    }
    if ((0, core_typings_1.isQuoteAttachment)(attachment) && attachment.attachments) {
        attachment.attachments = (0, exports.parseMessageAttachments)(attachment.attachments, parseOptions, autoTranslateOptions);
    }
    const text = ((0, core_typings_1.isTranslatedAttachment)(attachment) && autoTranslateLanguage && ((_a = attachment === null || attachment === void 0 ? void 0 : attachment.translations) === null || _a === void 0 ? void 0 : _a[autoTranslateLanguage])) ||
        attachment.text ||
        attachment.description ||
        '';
    if ((0, core_typings_1.isFileAttachment)(attachment) && attachment.description) {
        attachment.descriptionMd = translated
            ? textToMessageToken(text, parseOptions)
            : ((_b = attachment.descriptionMd) !== null && _b !== void 0 ? _b : textToMessageToken(text, parseOptions));
    }
    return Object.assign(Object.assign({}, attachment), { md: translated ? textToMessageToken(text, parseOptions) : ((_c = attachment.md) !== null && _c !== void 0 ? _c : textToMessageToken(text, parseOptions)) });
};
exports.parseMessageAttachment = parseMessageAttachment;
const parseMessageAttachments = (attachments, parseOptions, autoTranslateOptions) => attachments.map((attachment) => (0, exports.parseMessageAttachment)(attachment, parseOptions, autoTranslateOptions));
exports.parseMessageAttachments = parseMessageAttachments;
const isNotNullOrUndefined = (value) => value !== null && value !== undefined;
// In a previous version of the app, some values were being set to null.
// This is a workaround to remove those null values.
// A migration script should be created to remove this code.
const removePossibleNullMessageValues = (_a) => {
    var { editedBy, editedAt, emoji, avatar, alias, customFields, groupable, attachments, reactions } = _a, message = __rest(_a, ["editedBy", "editedAt", "emoji", "avatar", "alias", "customFields", "groupable", "attachments", "reactions"]);
    return (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, message), (isNotNullOrUndefined(editedBy) && { editedBy })), (isNotNullOrUndefined(editedAt) && { editedAt })), (isNotNullOrUndefined(emoji) && { emoji })), (isNotNullOrUndefined(avatar) && { avatar })), (isNotNullOrUndefined(alias) && { alias })), (isNotNullOrUndefined(customFields) && { customFields })), (isNotNullOrUndefined(groupable) && { groupable })), (isNotNullOrUndefined(attachments) && { attachments })), (isNotNullOrUndefined(reactions) && { reactions })));
};
exports.removePossibleNullMessageValues = removePossibleNullMessageValues;
const textToMessageToken = (textOrRoot, parseOptions) => {
    if (!textOrRoot) {
        return [];
    }
    if ((0, isParsedMessage_1.isParsedMessage)(textOrRoot)) {
        return textOrRoot;
    }
    const parsedMessage = (0, message_parser_1.parse)(textOrRoot, parseOptions);
    const parsedMessageCleaned = parsedMessage[0].type !== 'LINE_BREAK' ? parsedMessage : parsedMessage.slice(1);
    return parsedMessageCleaned;
};
