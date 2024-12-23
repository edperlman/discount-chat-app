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
const RoutingManager_1 = require("../../../../../../app/livechat/server/lib/RoutingManager");
/* Load Rotation Queuing method:
 * Routing method where the agent with the oldest routing time is the next agent to serve incoming chats
 */
class LoadRotation {
    constructor() {
        this._config = {
            previewRoom: false,
            showConnecting: false,
            showQueue: false,
            showQueueLink: false,
            returnQueue: false,
            enableTriggerAction: true,
            autoAssignAgent: true,
        };
    }
    get config() {
        return this._config;
    }
    getNextAgent(department, ignoreAgentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextAgent = yield models_1.Users.getLastAvailableAgentRouted(department, ignoreAgentId);
            if (!nextAgent) {
                return;
            }
            const { agentId, username } = nextAgent;
            return { agentId, username };
        });
    }
}
RoutingManager_1.RoutingManager.registerMethod('Load_Rotation', LoadRotation);
