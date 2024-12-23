"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSidebarMessage = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const emojione_1 = __importDefault(require("emojione"));
const markdown_1 = require("../../../app/markdown/lib/markdown");
const normalizeSidebarMessage = (message, t) => {
    if (message.msg) {
        return (0, string_helpers_1.escapeHTML)((0, markdown_1.filterMarkdown)(emojione_1.default.shortnameToUnicode(message.msg)));
    }
    if (message.attachments) {
        const attachment = message.attachments.find((attachment) => attachment.title || attachment.description);
        if (attachment === null || attachment === void 0 ? void 0 : attachment.description) {
            return (0, string_helpers_1.escapeHTML)(attachment.description);
        }
        if (attachment === null || attachment === void 0 ? void 0 : attachment.title) {
            return (0, string_helpers_1.escapeHTML)(attachment.title);
        }
        return t('Sent_an_attachment');
    }
};
exports.normalizeSidebarMessage = normalizeSidebarMessage;
