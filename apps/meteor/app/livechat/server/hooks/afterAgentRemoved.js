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
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
callbacks_1.callbacks.add('livechat.afterAgentRemoved', (_a) => __awaiter(void 0, [_a], void 0, function* ({ agent }) {
    const departments = yield models_1.LivechatDepartmentAgents.findByAgentId(agent._id).toArray();
    const [{ modifiedCount }, { deletedCount }] = yield Promise.all([
        models_1.Users.removeAgent(agent._id),
        models_1.LivechatDepartmentAgents.removeByAgentId(agent._id),
        agent.username && models_1.LivechatVisitors.removeContactManagerByUsername(agent.username),
        departments.length && models_1.LivechatDepartment.decreaseNumberOfAgentsByIds(departments.map(({ departmentId }) => departmentId)),
    ]);
    if (modifiedCount > 0) {
        void (0, notifyListener_1.notifyOnUserChange)({
            id: agent._id,
            clientAction: 'updated',
            diff: {
                operator: false,
                livechat: null,
                statusLivechat: null,
                extension: null,
                openBusinessHours: null,
            },
        });
    }
    if (deletedCount > 0) {
        departments.forEach((depAgent) => {
            void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChanged)({
                _id: depAgent._id,
                agentId: agent._id,
                departmentId: depAgent.departmentId,
            }, 'removed');
        });
    }
}));
