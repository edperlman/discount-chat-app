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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const Helper_1 = require("../lib/Helper");
callbacks_1.callbacks.add('beforeJoinRoom', (user, room) => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return user;
    }
    if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
        return user;
    }
    const { departmentId } = room;
    const maxNumberSimultaneousChat = yield (0, Helper_1.getMaxNumberSimultaneousChat)({
        agentId: user._id,
        departmentId,
    });
    if (maxNumberSimultaneousChat === 0) {
        return user;
    }
    const userSubs = yield models_1.Users.getAgentAndAmountOngoingChats(user._id);
    if (!userSubs) {
        return user;
    }
    const { queueInfo: { chats = 0 } = {} } = userSubs;
    if (maxNumberSimultaneousChat <= chats) {
        throw new meteor_1.Meteor.Error('error-max-number-simultaneous-chats-reached', 'Not allowed');
    }
    return user;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-before-join-room');
