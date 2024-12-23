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
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
callbacks_1.callbacks.add('livechat.beforeDelegateAgent', (agent_1, ...args_1) => __awaiter(void 0, [agent_1, ...args_1], void 0, function* (agent, { department } = {}) {
    if (agent) {
        return agent;
    }
    if (!server_1.settings.get('Livechat_assign_new_conversation_to_bot')) {
        return null;
    }
    if (department) {
        return models_1.LivechatDepartmentAgents.getNextBotForDepartment(department);
    }
    return models_1.Users.getNextBotAgent();
}), callbacks_1.callbacks.priority.HIGH, 'livechat-before-delegate-agent');
