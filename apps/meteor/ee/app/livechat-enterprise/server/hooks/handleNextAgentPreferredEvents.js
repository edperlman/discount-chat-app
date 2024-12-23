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
const notifyListener_1 = require("../../../../../app/lib/server/lib/notifyListener");
const RoutingManager_1 = require("../../../../../app/livechat/server/lib/RoutingManager");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
let contactManagerPreferred = false;
let lastChattedAgentPreferred = false;
const normalizeDefaultAgent = (agent) => {
    if (!agent) {
        return null;
    }
    const { _id: agentId, username } = agent;
    return { agentId, username };
};
const getDefaultAgent = (username) => __awaiter(void 0, void 0, void 0, function* () {
    if (!username) {
        return null;
    }
    return normalizeDefaultAgent(yield models_1.Users.findOneOnlineAgentByUserList(username, { projection: { _id: 1, username: 1 } }));
});
server_1.settings.watch('Livechat_last_chatted_agent_routing', (value) => {
    lastChattedAgentPreferred = value;
    if (!lastChattedAgentPreferred) {
        callbacks_1.callbacks.remove('livechat.onMaxNumberSimultaneousChatsReached', 'livechat-on-max-number-simultaneous-chats-reached');
        callbacks_1.callbacks.remove('livechat.afterTakeInquiry', 'livechat-save-default-agent-after-take-inquiry');
        return;
    }
    callbacks_1.callbacks.add('livechat.afterTakeInquiry', (_a, agent_1) => __awaiter(void 0, [_a, agent_1], void 0, function* ({ inquiry }, agent) {
        var _b;
        if (!inquiry || !agent) {
            return inquiry;
        }
        if (!((_b = RoutingManager_1.RoutingManager.getConfig()) === null || _b === void 0 ? void 0 : _b.autoAssignAgent)) {
            return inquiry;
        }
        const { v: { token } = {} } = inquiry;
        if (!token) {
            return inquiry;
        }
        yield models_1.LivechatVisitors.updateLastAgentByToken(token, Object.assign(Object.assign({}, agent), { ts: new Date() }));
        return inquiry;
    }), callbacks_1.callbacks.priority.MEDIUM, 'livechat-save-default-agent-after-take-inquiry');
    callbacks_1.callbacks.add('livechat.onMaxNumberSimultaneousChatsReached', (inquiry) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!(inquiry === null || inquiry === void 0 ? void 0 : inquiry.defaultAgent)) {
            return inquiry;
        }
        if (!((_a = RoutingManager_1.RoutingManager.getConfig()) === null || _a === void 0 ? void 0 : _a.autoAssignAgent)) {
            return inquiry;
        }
        yield models_1.LivechatInquiry.removeDefaultAgentById(inquiry._id);
        void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(inquiry, 'updated', {
            defaultAgent: undefined,
        });
        return models_1.LivechatInquiry.findOneById(inquiry._id);
    }), callbacks_1.callbacks.priority.MEDIUM, 'livechat-on-max-number-simultaneous-chats-reached');
});
server_1.settings.watch('Omnichannel_contact_manager_routing', (value) => {
    contactManagerPreferred = value;
});
callbacks_1.callbacks.add('livechat.checkDefaultAgentOnNewRoom', (defaultAgent, defaultGuest) => __awaiter(void 0, void 0, void 0, function* () {
    if (defaultAgent || !defaultGuest) {
        return defaultAgent;
    }
    const { _id: guestId } = defaultGuest;
    const guest = yield models_1.LivechatVisitors.findOneEnabledById(guestId, {
        projection: { lastAgent: 1, token: 1, contactManager: 1 },
    });
    if (!guest) {
        return defaultAgent;
    }
    const { lastAgent, token, contactManager } = guest;
    const guestManager = (contactManager === null || contactManager === void 0 ? void 0 : contactManager.username) && contactManagerPreferred && getDefaultAgent(contactManager === null || contactManager === void 0 ? void 0 : contactManager.username);
    if (guestManager) {
        return guestManager;
    }
    if (!lastChattedAgentPreferred) {
        return defaultAgent;
    }
    const guestAgent = (lastAgent === null || lastAgent === void 0 ? void 0 : lastAgent.username) && getDefaultAgent(lastAgent === null || lastAgent === void 0 ? void 0 : lastAgent.username);
    if (guestAgent) {
        return guestAgent;
    }
    const room = yield models_1.LivechatRooms.findOneLastServedAndClosedByVisitorToken(token, {
        projection: { servedBy: 1 },
    });
    if (!(room === null || room === void 0 ? void 0 : room.servedBy)) {
        return defaultAgent;
    }
    const { servedBy: { username: usernameByRoom }, } = room;
    if (!usernameByRoom) {
        return defaultAgent;
    }
    const lastRoomAgent = normalizeDefaultAgent(yield models_1.Users.findOneOnlineAgentByUserList(usernameByRoom, { projection: { _id: 1, username: 1 } }));
    return lastRoomAgent !== null && lastRoomAgent !== void 0 ? lastRoomAgent : defaultAgent;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-check-default-agent-new-room');
