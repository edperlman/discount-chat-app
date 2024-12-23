"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuoteAttachment = createQuoteAttachment;
const core_typings_1 = require("@rocket.chat/core-typings");
const getUserDisplayName_1 = require("./getUserDisplayName");
function createQuoteAttachment(message, messageLink, useRealName, userAvatarUrl) {
    return Object.assign(Object.assign({ text: message.msg, md: message.md }, ((0, core_typings_1.isTranslatedMessage)(message) && { translations: message === null || message === void 0 ? void 0 : message.translations })), { message_link: messageLink, author_name: message.alias || (0, getUserDisplayName_1.getUserDisplayName)(message.u.name, message.u.username, useRealName), author_icon: userAvatarUrl, attachments: message.attachments || [], ts: message.ts });
}
