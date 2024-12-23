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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhookMessage = void 0;
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const getRoomByNameOrIdWithOptionToJoin_1 = require("./getRoomByNameOrIdWithOptionToJoin");
const sendMessage_1 = require("./sendMessage");
const arrayUtils_1 = require("../../../../lib/utils/arrayUtils");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const system_1 = require("../../../../server/lib/logger/system");
const canSendMessage_1 = require("../../../authorization/server/functions/canSendMessage");
const processWebhookMessage = function (messageObj_1, user_1) {
    return __awaiter(this, arguments, void 0, function* (messageObj, user, defaultValues = { channel: '', alias: '', avatar: '', emoji: '' }) {
        var _a, e_1, _b, _c;
        const sentData = [];
        const channels = [...new Set((0, arrayUtils_1.ensureArray)(messageObj.channel || messageObj.roomId || defaultValues.channel))];
        try {
            for (var _d = true, channels_1 = __asyncValues(channels), channels_1_1; channels_1_1 = yield channels_1.next(), _a = channels_1_1.done, !_a; _d = true) {
                _c = channels_1_1.value;
                _d = false;
                const channel = _c;
                const channelType = channel[0];
                let channelValue = channel.substr(1);
                let room;
                switch (channelType) {
                    case '#':
                        room = yield (0, getRoomByNameOrIdWithOptionToJoin_1.getRoomByNameOrIdWithOptionToJoin)({
                            user,
                            nameOrId: channelValue,
                            joinChannel: true,
                        });
                        break;
                    case '@':
                        room = yield (0, getRoomByNameOrIdWithOptionToJoin_1.getRoomByNameOrIdWithOptionToJoin)({
                            user,
                            nameOrId: channelValue,
                            type: 'd',
                        });
                        break;
                    default:
                        channelValue = channelType + channelValue;
                        // Try to find the room by id or name if they didn't include the prefix.
                        room = yield (0, getRoomByNameOrIdWithOptionToJoin_1.getRoomByNameOrIdWithOptionToJoin)({
                            user,
                            nameOrId: channelValue,
                            joinChannel: true,
                            errorOnEmpty: false,
                        });
                        if (room) {
                            break;
                        }
                        // We didn't get a room, let's try finding direct messages
                        room = yield (0, getRoomByNameOrIdWithOptionToJoin_1.getRoomByNameOrIdWithOptionToJoin)({
                            user,
                            nameOrId: channelValue,
                            tryDirectByUserIdOnly: true,
                            type: 'd',
                        });
                        if (room) {
                            break;
                        }
                        // No room, so throw an error
                        throw new meteor_1.Meteor.Error('invalid-channel');
                }
                if (messageObj.attachments && !Array.isArray(messageObj.attachments)) {
                    system_1.SystemLogger.warn({
                        msg: 'Attachments should be Array, ignoring value',
                        attachments: messageObj.attachments,
                    });
                    messageObj.attachments = undefined;
                }
                const message = {
                    alias: messageObj.username || messageObj.alias || defaultValues.alias,
                    msg: (0, stringUtils_1.trim)(messageObj.text || messageObj.msg || ''),
                    attachments: messageObj.attachments || [],
                    parseUrls: messageObj.parseUrls !== undefined ? messageObj.parseUrls : !messageObj.attachments,
                    bot: messageObj.bot,
                    groupable: messageObj.groupable !== undefined ? messageObj.groupable : false,
                    tmid: messageObj.tmid,
                    customFields: messageObj.customFields,
                };
                if (!underscore_1.default.isEmpty(messageObj.icon_url) || !underscore_1.default.isEmpty(messageObj.avatar)) {
                    message.avatar = messageObj.icon_url || messageObj.avatar;
                }
                else if (!underscore_1.default.isEmpty(messageObj.icon_emoji) || !underscore_1.default.isEmpty(messageObj.emoji)) {
                    message.emoji = messageObj.icon_emoji || messageObj.emoji;
                }
                else if (!underscore_1.default.isEmpty(defaultValues.avatar)) {
                    message.avatar = defaultValues.avatar;
                }
                else if (!underscore_1.default.isEmpty(defaultValues.emoji)) {
                    message.emoji = defaultValues.emoji;
                }
                if (Array.isArray(message.attachments)) {
                    for (let i = 0; i < message.attachments.length; i++) {
                        const attachment = message.attachments[i];
                        if (attachment.msg) {
                            attachment.text = (0, stringUtils_1.trim)(attachment.msg);
                            delete attachment.msg;
                        }
                    }
                }
                yield (0, canSendMessage_1.validateRoomMessagePermissionsAsync)(room, Object.assign({ uid: user._id }, user));
                const messageReturn = yield (0, sendMessage_1.sendMessage)(user, message, room);
                sentData.push({ channel, message: messageReturn });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = channels_1.return)) yield _b.call(channels_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return sentData;
    });
};
exports.processWebhookMessage = processWebhookMessage;
