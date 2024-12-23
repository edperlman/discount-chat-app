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
exports.onlineAgents = exports.monitorAgents = void 0;
const logger_1 = require("@rocket.chat/logger");
const server_1 = require("../../../../settings/server");
const LivechatTyped_1 = require("../LivechatTyped");
const logger = new logger_1.Logger('AgentStatusWatcher');
exports.monitorAgents = false;
let actionTimeout = 60000;
let action = 'none';
let comment = '';
server_1.settings.watch('Livechat_agent_leave_action_timeout', (value) => {
    if (typeof value !== 'number') {
        return;
    }
    actionTimeout = value * 1000;
});
server_1.settings.watch('Livechat_agent_leave_action', (value) => {
    exports.monitorAgents = value !== 'none';
    action = value;
});
server_1.settings.watch('Livechat_agent_leave_comment', (value) => {
    if (typeof value !== 'string') {
        return;
    }
    comment = value;
});
exports.onlineAgents = {
    users: new Set(),
    queue: new Map(),
    add(userId) {
        if (this.exists(userId)) {
            return;
        }
        if (this.queue.has(userId)) {
            clearTimeout(this.queue.get(userId));
            this.queue.delete(userId);
        }
        this.users.add(userId);
    },
    remove(userId) {
        if (!this.exists(userId)) {
            return;
        }
        this.users.delete(userId);
        if (this.queue.has(userId)) {
            clearTimeout(this.queue.get(userId));
        }
        this.queue.set(userId, setTimeout(this.runAgentLeaveAction, actionTimeout, userId));
    },
    exists(userId) {
        return this.users.has(userId);
    },
    runAgentLeaveAction: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        exports.onlineAgents.users.delete(userId);
        exports.onlineAgents.queue.delete(userId);
        try {
            if (action === 'close') {
                return yield LivechatTyped_1.Livechat.closeOpenChats(userId, comment);
            }
            if (action === 'forward') {
                return yield LivechatTyped_1.Livechat.forwardOpenChats(userId);
            }
        }
        catch (e) {
            logger.error({
                msg: `Cannot perform action ${action}`,
                err: e,
            });
        }
    }),
};
