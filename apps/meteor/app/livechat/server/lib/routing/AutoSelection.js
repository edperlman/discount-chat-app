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
const callbacks_1 = require("../../../../../lib/callbacks");
const server_1 = require("../../../../settings/server");
const RoutingManager_1 = require("../RoutingManager");
/* Auto Selection Queuing method:
 *
 * default method where the agent with the least number
 * of open chats is paired with the incoming livechat
 */
class AutoSelection {
    constructor() {
        this.config = {
            previewRoom: false,
            showConnecting: false,
            showQueue: false,
            showQueueLink: true,
            returnQueue: false,
            enableTriggerAction: true,
            autoAssignAgent: true,
        };
    }
    getNextAgent(department, ignoreAgentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const extraQuery = yield callbacks_1.callbacks.run('livechat.applySimultaneousChatRestrictions', undefined, Object.assign({}, (department ? { departmentId: department } : {})));
            if (department) {
                return models_1.LivechatDepartmentAgents.getNextAgentForDepartment(department, server_1.settings.get('Livechat_enabled_when_agent_idle'), ignoreAgentId, extraQuery);
            }
            return models_1.Users.getNextAgent(ignoreAgentId, extraQuery);
        });
    }
}
RoutingManager_1.RoutingManager.registerMethod('Auto_Selection', AutoSelection);
