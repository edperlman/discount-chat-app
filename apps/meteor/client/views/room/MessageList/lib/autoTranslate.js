"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTranslationLanguageInAttachments = exports.hasTranslationLanguageInMessage = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const hasTranslationLanguageInMessage = (message, language) => { var _a; return (0, core_typings_1.isTranslatedMessage)(message) && Boolean((_a = message.translations) === null || _a === void 0 ? void 0 : _a[language]); };
exports.hasTranslationLanguageInMessage = hasTranslationLanguageInMessage;
const hasTranslationLanguageInAttachments = (attachments = [], language) => (0, core_typings_1.isTranslatedMessageAttachment)(attachments) && (attachments === null || attachments === void 0 ? void 0 : attachments.some((attachment) => { var _a; return (_a = attachment === null || attachment === void 0 ? void 0 : attachment.translations) === null || _a === void 0 ? void 0 : _a[language]; }));
exports.hasTranslationLanguageInAttachments = hasTranslationLanguageInAttachments;
