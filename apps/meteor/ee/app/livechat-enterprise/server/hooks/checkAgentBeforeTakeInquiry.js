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
const models_1 = require("@rocket.chat/models");
const Helper_1 = require("../../../../../app/livechat/server/lib/Helper");
const LivechatTyped_1 = require("../../../../../app/livechat/server/lib/LivechatTyped");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const Helper_2 = require("../lib/Helper");
const logger_1 = require("../lib/logger");
const validateMaxChats = (_a) => __awaiter(void 0, [_a], void 0, function* ({ agent, inquiry, }) {
    if (!(inquiry === null || inquiry === void 0 ? void 0 : inquiry._id) || !(agent === null || agent === void 0 ? void 0 : agent.agentId)) {
        throw new Error('No inquiry or agent provided');
    }
    const { agentId } = agent;
    if (!(yield LivechatTyped_1.Livechat.checkOnlineAgents(undefined, agent))) {
        throw new Error('Provided agent is not online');
    }
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return agent;
    }
    if (yield (0, Helper_1.allowAgentSkipQueue)(agent)) {
        logger_1.cbLogger.info(`Chat can be taken by Agent ${agentId}: agent can skip queue`);
        return agent;
    }
    const { department: departmentId } = inquiry;
    const maxNumberSimultaneousChat = yield (0, Helper_2.getMaxNumberSimultaneousChat)({
        agentId,
        departmentId,
    });
    if (maxNumberSimultaneousChat === 0) {
        logger_1.cbLogger.debug(`Chat can be taken by Agent ${agentId}: max number simultaneous chats on range`);
        return agent;
    }
    const user = yield models_1.Users.getAgentAndAmountOngoingChats(agentId);
    if (!user) {
        throw new Error('No valid agent found');
    }
    const { queueInfo: { chats = 0 } = {} } = user;
    const maxChats = typeof maxNumberSimultaneousChat === 'number' ? maxNumberSimultaneousChat : parseInt(maxNumberSimultaneousChat, 10);
    if (maxChats <= chats) {
        yield callbacks_1.callbacks.run('livechat.onMaxNumberSimultaneousChatsReached', inquiry);
        throw new Error('error-max-number-simultaneous-chats-reached');
    }
    logger_1.cbLogger.debug(`Agent ${agentId} can take inquiry ${inquiry._id}`);
    return agent;
});
callbacks_1.callbacks.add('livechat.checkAgentBeforeTakeInquiry', validateMaxChats, callbacks_1.callbacks.priority.MEDIUM, 'livechat-before-take-inquiry');
