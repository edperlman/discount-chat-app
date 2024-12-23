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
const server_fetch_1 = require("@rocket.chat/server-fetch");
const meteor_1 = require("meteor/meteor");
const system_1 = require("../../../../../server/lib/logger/system");
const server_1 = require("../../../../settings/server");
const RoutingManager_1 = require("../RoutingManager");
class ExternalQueue {
    constructor() {
        this.config = {
            previewRoom: false,
            showConnecting: false,
            showQueue: false,
            showQueueLink: false,
            returnQueue: false,
            enableTriggerAction: true,
            autoAssignAgent: true,
        };
    }
    getNextAgent(department, ignoreAgentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(this.getAgentFromExternalQueue(department, ignoreAgentId));
            }
            try {
                const results = (yield Promise.all(promises)).filter(Boolean);
                if (!results.length) {
                    throw new meteor_1.Meteor.Error('no-agent-online', 'Sorry, no online agents');
                }
                return results[0];
            }
            catch (err) {
                system_1.SystemLogger.error({ msg: 'Error requesting agent from external queue.', err });
                throw err;
            }
        });
    }
    getAgentFromExternalQueue(department, ignoreAgentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield (0, server_fetch_1.serverFetch)(`${server_1.settings.get('Livechat_External_Queue_URL')}`, {
                    headers: {
                        'User-Agent': 'RocketChat Server',
                        'Accept': 'application/json',
                        'X-RocketChat-Secret-Token': server_1.settings.get('Livechat_External_Queue_Token'),
                    },
                    params: Object.assign(Object.assign({}, (department && { departmentId: department })), (ignoreAgentId && { ignoreAgentId })),
                });
                const result = (yield request.json());
                if (result === null || result === void 0 ? void 0 : result.username) {
                    const agent = yield models_1.Users.findOneOnlineAgentByUserList(result.username);
                    if (!(agent === null || agent === void 0 ? void 0 : agent.username)) {
                        return;
                    }
                    return {
                        agentId: agent._id,
                        username: agent.username,
                    };
                }
            }
            catch (err) {
                system_1.SystemLogger.error({ msg: 'Error requesting agent from external queue.', err });
            }
        });
    }
}
RoutingManager_1.RoutingManager.registerMethod('External', ExternalQueue);
