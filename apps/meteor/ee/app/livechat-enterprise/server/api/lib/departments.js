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
exports.hasAccessToDepartment = exports.getDepartmentsWhichUserCanAccess = void 0;
const models_1 = require("@rocket.chat/models");
const logger_1 = require("../../lib/logger");
const getDepartmentsWhichUserCanAccess = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, includeDisabled = false) {
    const departments = yield models_1.LivechatDepartmentAgents.find({
        agentId: userId,
    }, {
        projection: {
            departmentId: 1,
        },
    }).toArray();
    const monitoredDepartments = yield models_1.LivechatUnit.findMonitoredDepartmentsByMonitorId(userId, includeDisabled);
    const combinedDepartments = [
        ...departments.map((department) => department.departmentId),
        ...monitoredDepartments.map((department) => department._id),
    ];
    return [...new Set(combinedDepartments)];
});
exports.getDepartmentsWhichUserCanAccess = getDepartmentsWhichUserCanAccess;
const hasAccessToDepartment = (userId, departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield models_1.LivechatDepartmentAgents.findOneByAgentIdAndDepartmentId(userId, departmentId, { projection: { _id: 1 } });
    if (department) {
        logger_1.helperLogger.debug(`User ${userId} has access to department ${departmentId} because they are an agent`);
        return true;
    }
    const monitorAccess = yield models_1.LivechatDepartment.checkIfMonitorIsMonitoringDepartmentById(userId, departmentId);
    logger_1.helperLogger.debug(`User ${userId} ${monitorAccess ? 'has' : 'does not have'} access to department ${departmentId} because they are a monitor`);
    return monitorAccess;
});
exports.hasAccessToDepartment = hasAccessToDepartment;
