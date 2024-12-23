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
exports.getAgentIdsForBusinessHour = void 0;
const models_1 = require("@rocket.chat/models");
const getAllAgentIdsWithoutDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch departments with agents excluding archived ones (disabled ones still can be tied to business hours)
    // Then find the agents that are not in any of those departments
    const departmentIds = (yield models_1.LivechatDepartment.findNotArchived({ projection: { _id: 1 } }).toArray()).map(({ _id }) => _id);
    const agentIdsWithDepartment = yield models_1.LivechatDepartmentAgents.findAllAgentsConnectedToListOfDepartments(departmentIds);
    const agentIdsWithoutDepartment = (yield models_1.Users.findUsersInRolesWithQuery('livechat-agent', {
        _id: { $nin: agentIdsWithDepartment },
    }, { projection: { _id: 1 } }).toArray()).map((user) => user._id);
    return agentIdsWithoutDepartment;
});
const getAllAgentIdsWithDepartmentNotConnectedToBusinessHour = () => __awaiter(void 0, void 0, void 0, function* () {
    const activeDepartmentsWithoutBusinessHour = (yield models_1.LivechatDepartment.findActiveDepartmentsWithoutBusinessHour({
        projection: { _id: 1 },
    }).toArray()).map((dept) => dept._id);
    const agentIdsWithDepartmentNotConnectedToBusinessHour = yield models_1.LivechatDepartmentAgents.findAllAgentsConnectedToListOfDepartments(activeDepartmentsWithoutBusinessHour);
    return agentIdsWithDepartmentNotConnectedToBusinessHour;
});
const getAgentIdsForBusinessHour = () => __awaiter(void 0, void 0, void 0, function* () {
    const [withoutDepartment, withDepartmentNotConnectedToBusinessHour] = yield Promise.all([
        getAllAgentIdsWithoutDepartment(),
        getAllAgentIdsWithDepartmentNotConnectedToBusinessHour(),
    ]);
    return [...new Set([...withoutDepartment, ...withDepartmentNotConnectedToBusinessHour])];
});
exports.getAgentIdsForBusinessHour = getAgentIdsForBusinessHour;
