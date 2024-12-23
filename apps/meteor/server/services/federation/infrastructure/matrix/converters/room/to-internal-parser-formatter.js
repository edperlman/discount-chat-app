"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.toExternalQuoteMessageFormat = exports.toExternalMessageFormat = void 0;
const marked_1 = require("marked");
const INTERNAL_MENTIONS_FOR_EXTERNAL_USERS_REGEX = /@([0-9a-zA-Z-_.]+(@([0-9a-zA-Z-_.]+))?):+([0-9a-zA-Z-_.]+)(?=[^<>]*(?:<\w|$))/gm; // @username:server.com excluding any <a> tags
const INTERNAL_MENTIONS_FOR_INTERNAL_USERS_REGEX = /(?:^|(?<=\s))@([0-9a-zA-Z-_.]+(@([0-9a-zA-Z-_.]+))?)(?=[^<>]*(?:<\w|$))/gm; // @username, @username.name excluding any <a> tags and emails
const INTERNAL_GENERAL_REGEX = /(@all)|(@here)/gm;
const replaceMessageMentions = (message, mentionRegex, parseMatchFn) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    message.replace(mentionRegex, (match) => promises.push(parseMatchFn(match)));
    const mentions = yield Promise.all(promises);
    return message.replace(mentionRegex, () => { var _a; return ` ${(_a = mentions.shift()) === null || _a === void 0 ? void 0 : _a.html}`; });
});
const replaceMentionsFromLocalExternalUsersForExternalFormat = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { MentionPill } = yield Promise.resolve().then(() => __importStar(require('@vector-im/matrix-bot-sdk')));
    return replaceMessageMentions(message, INTERNAL_MENTIONS_FOR_EXTERNAL_USERS_REGEX, (match) => MentionPill.forUser(match.trimStart()));
});
const replaceInternalUsersMentionsForExternalFormat = (message, homeServerDomain) => __awaiter(void 0, void 0, void 0, function* () {
    const { MentionPill } = yield Promise.resolve().then(() => __importStar(require('@vector-im/matrix-bot-sdk')));
    return replaceMessageMentions(message, INTERNAL_MENTIONS_FOR_INTERNAL_USERS_REGEX, (match) => MentionPill.forUser(`${match.trimStart()}:${homeServerDomain}`));
});
const replaceInternalGeneralMentionsForExternalFormat = (message, externalRoomId) => __awaiter(void 0, void 0, void 0, function* () {
    const { MentionPill } = yield Promise.resolve().then(() => __importStar(require('@vector-im/matrix-bot-sdk')));
    return replaceMessageMentions(message, INTERNAL_GENERAL_REGEX, () => MentionPill.forRoom(externalRoomId));
});
const removeAllExtraBlankSpacesForASingleOne = (message) => message.replace(/\s+/g, ' ').trim();
const replaceInternalWithExternalMentions = (message, externalRoomId, homeServerDomain) => __awaiter(void 0, void 0, void 0, function* () {
    return replaceInternalUsersMentionsForExternalFormat(yield replaceMentionsFromLocalExternalUsersForExternalFormat(yield replaceInternalGeneralMentionsForExternalFormat(message, externalRoomId)), homeServerDomain);
});
const convertMarkdownToHTML = (message) => marked_1.marked.parse(message);
const toExternalMessageFormat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ externalRoomId, homeServerDomain, message, }) {
    return removeAllExtraBlankSpacesForASingleOne(convertMarkdownToHTML((yield replaceInternalWithExternalMentions(message, externalRoomId, homeServerDomain)).trim()));
});
exports.toExternalMessageFormat = toExternalMessageFormat;
const toExternalQuoteMessageFormat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, eventToReplyTo, externalRoomId, homeServerDomain, originalEventSender, }) {
    const { RichReply } = yield Promise.resolve().then(() => __importStar(require('@vector-im/matrix-bot-sdk')));
    const formattedMessage = convertMarkdownToHTML(message);
    const finalFormattedMessage = convertMarkdownToHTML(yield (0, exports.toExternalMessageFormat)({
        message,
        externalRoomId,
        homeServerDomain,
    }));
    const { formatted_body: formattedBody } = RichReply.createFor(externalRoomId, { event_id: eventToReplyTo, sender: originalEventSender }, formattedMessage, finalFormattedMessage);
    const { body } = RichReply.createFor(externalRoomId, { event_id: eventToReplyTo, sender: originalEventSender }, message, finalFormattedMessage);
    return {
        message: body,
        formattedMessage: formattedBody,
    };
});
exports.toExternalQuoteMessageFormat = toExternalQuoteMessageFormat;
