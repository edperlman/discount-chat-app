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
exports.getOnlineAgents = getOnlineAgents;
const models_1 = require("@rocket.chat/models");
function getOnlineAgents(department, agent) {
    return __awaiter(this, void 0, void 0, function* () {
        if (agent === null || agent === void 0 ? void 0 : agent.agentId) {
            return models_1.Users.findOnlineAgents(agent.agentId);
        }
        if (department) {
            const departmentAgents = yield models_1.LivechatDepartmentAgents.getOnlineForDepartment(department);
            if (!departmentAgents) {
                return;
            }
            const agentIds = yield departmentAgents.map(({ agentId }) => agentId).toArray();
            if (!agentIds.length) {
                return;
            }
            return models_1.Users.findByIds([...new Set(agentIds)]);
        }
        return models_1.Users.findOnlineAgents();
    });
}
