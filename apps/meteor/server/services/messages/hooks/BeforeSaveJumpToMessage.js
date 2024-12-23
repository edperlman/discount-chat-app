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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeSaveJumpToMessage = void 0;
const querystring_1 = __importDefault(require("querystring"));
const url_1 = __importDefault(require("url"));
const core_typings_1 = require("@rocket.chat/core-typings");
const createQuoteAttachment_1 = require("../../../../lib/createQuoteAttachment");
const recursiveRemoveAttachments = (attachments, deep = 1, quoteChainLimit) => {
    var _a;
    if (attachments && (0, core_typings_1.isQuoteAttachment)(attachments)) {
        if (deep < quoteChainLimit - 1) {
            (_a = attachments.attachments) === null || _a === void 0 ? void 0 : _a.map((msg) => recursiveRemoveAttachments(msg, deep + 1, quoteChainLimit));
        }
        else {
            delete attachments.attachments;
        }
    }
    return attachments;
};
const validateAttachmentDeepness = (message, quoteChainLimit) => {
    var _a;
    if (!(message === null || message === void 0 ? void 0 : message.attachments)) {
        return message;
    }
    if ((message.attachments && quoteChainLimit < 2) || isNaN(quoteChainLimit)) {
        delete message.attachments;
    }
    message.attachments = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a.map((attachment) => recursiveRemoveAttachments(attachment, 1, quoteChainLimit));
    return message;
};
const removeQuoteAttachments = (message) => {
    if (!message.attachments) {
        return;
    }
    message.attachments = message.attachments.filter((attachment) => !(0, core_typings_1.isQuoteAttachment)(attachment));
};
/**
 * Transform URLs in messages into quote attachments
 */
class BeforeSaveJumpToMessage {
    constructor(options) {
        this.getMessages = options.getMessages;
        this.getRooms = options.getRooms;
        this.canAccessRoom = options.canAccessRoom;
        this.getUserAvatarURL = options.getUserAvatarURL;
    }
    createAttachmentForMessageURLs(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, user: currentUser, config, }) {
            var _b;
            // Quote attachments are always rebuilt. Do not keep old ones since they may not still be linked to the message
            removeQuoteAttachments(message);
            // if no message is present, or the message doesn't have any URL, skip
            if (!((_b = message === null || message === void 0 ? void 0 : message.urls) === null || _b === void 0 ? void 0 : _b.length)) {
                return message;
            }
            const linkedMessages = message.urls
                .filter((item) => item.url.includes(config.siteUrl))
                .map((item) => {
                const urlObj = url_1.default.parse(item.url);
                // if the URL doesn't have query params (doesn't reference message) skip
                if (!urlObj.query) {
                    return;
                }
                const { msg: msgId } = querystring_1.default.parse(urlObj.query);
                if (typeof msgId !== 'string') {
                    return;
                }
                return { msgId, url: item.url };
            })
                .filter(Boolean);
            const msgs = yield this.getMessages(linkedMessages.map((linkedMsg) => linkedMsg === null || linkedMsg === void 0 ? void 0 : linkedMsg.msgId));
            const validMessages = msgs.filter((msg) => validateAttachmentDeepness(msg, config.chainLimit));
            const rooms = yield this.getRooms(validMessages.map((msg) => msg.rid));
            const roomsWithPermission = rooms &&
                (yield Promise.all(rooms.map((room) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (!!message.token && (0, core_typings_1.isOmnichannelRoom)(room) && !!((_a = room.v) === null || _a === void 0 ? void 0 : _a.token) && message.token === room.v.token) {
                        return room;
                    }
                    if (currentUser && (yield this.canAccessRoom(room, currentUser))) {
                        return room;
                    }
                }))));
            const validRooms = roomsWithPermission === null || roomsWithPermission === void 0 ? void 0 : roomsWithPermission.filter((room) => !!room);
            const { useRealName } = config;
            const quotes = [];
            for (const item of message.urls) {
                if (!item.url.includes(config.siteUrl)) {
                    continue;
                }
                const linkedMessage = linkedMessages.find((msg) => (msg === null || msg === void 0 ? void 0 : msg.url) === item.url);
                if (!linkedMessage) {
                    continue;
                }
                const messageFromUrl = validMessages.find((msg) => msg._id === linkedMessage.msgId);
                if (!messageFromUrl) {
                    continue;
                }
                if (!(validRooms === null || validRooms === void 0 ? void 0 : validRooms.find((room) => (room === null || room === void 0 ? void 0 : room._id) === messageFromUrl.rid))) {
                    continue;
                }
                item.ignoreParse = true;
                quotes.push((0, createQuoteAttachment_1.createQuoteAttachment)(messageFromUrl, item.url, useRealName, this.getUserAvatarURL(messageFromUrl.u.username)));
            }
            if (quotes.length > 0) {
                const currentAttachments = message.attachments || [];
                message.attachments = [...currentAttachments, ...quotes];
            }
            return message;
        });
    }
}
exports.BeforeSaveJumpToMessage = BeforeSaveJumpToMessage;
