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
exports.sendMessageLivechat = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const LivechatTyped_1 = require("../lib/LivechatTyped");
const sendMessageLivechat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ message: { token, _id, rid, msg, file, files, attachments }, agent, }) {
    (0, check_1.check)(token, String);
    (0, check_1.check)(_id, String);
    (0, check_1.check)(rid, String);
    (0, check_1.check)(msg, String);
    (0, check_1.check)(agent, check_1.Match.Maybe({
        agentId: String,
        username: String,
    }));
    const guest = yield models_1.LivechatVisitors.getVisitorByToken(token, {
        projection: {
            name: 1,
            username: 1,
            department: 1,
            token: 1,
        },
    });
    if (!guest) {
        throw new meteor_1.Meteor.Error('invalid-token');
    }
    if (server_1.settings.get('Livechat_enable_message_character_limit') && msg.length > parseInt(server_1.settings.get('Livechat_message_character_limit'))) {
        throw new meteor_1.Meteor.Error('message-length-exceeds-character-limit');
    }
    return LivechatTyped_1.Livechat.sendMessage({
        guest,
        message: {
            _id,
            rid,
            msg,
            token,
            file,
            files,
            attachments,
        },
        agent,
        roomInfo: {
            source: {
                type: core_typings_1.OmnichannelSourceType.API,
            },
        },
    });
});
exports.sendMessageLivechat = sendMessageLivechat;
meteor_1.Meteor.methods({
    sendMessageLivechat(_a, agent_1) {
        return __awaiter(this, arguments, void 0, function* ({ token, _id, rid, msg, file, files, attachments }, agent) {
            return (0, exports.sendMessageLivechat)({ message: { token, _id, rid, msg, file, files, attachments }, agent });
        });
    },
});
