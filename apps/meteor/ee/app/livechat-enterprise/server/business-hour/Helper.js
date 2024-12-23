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
exports.removeBusinessHourByAgentIds = exports.openBusinessHour = exports.getAgentIdsToHandle = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const Helper_1 = require("../../../../../app/livechat/server/business-hour/Helper");
const getAgentIdsForBusinessHour_1 = require("../../../../../app/livechat/server/business-hour/getAgentIdsForBusinessHour");
const logger_1 = require("../../../../../app/livechat/server/lib/logger");
const getAgentIdsToHandle = (businessHour) => __awaiter(void 0, void 0, void 0, function* () {
    if (businessHour.type === core_typings_1.LivechatBusinessHourTypes.DEFAULT) {
        return (0, getAgentIdsForBusinessHour_1.getAgentIdsForBusinessHour)();
    }
    const departmentIds = (yield models_1.LivechatDepartment.findEnabledByBusinessHourId(businessHour._id, {
        projection: { _id: 1 },
    }).toArray()).map((dept) => dept._id);
    return (yield models_1.LivechatDepartmentAgents.findByDepartmentIds(departmentIds, {
        projection: { agentId: 1 },
    }).toArray()).map((dept) => dept.agentId);
});
exports.getAgentIdsToHandle = getAgentIdsToHandle;
const openBusinessHour = (businessHour_1, ...args_1) => __awaiter(void 0, [businessHour_1, ...args_1], void 0, function* (businessHour, updateLivechatStatus = true) {
    const agentIds = yield (0, exports.getAgentIdsToHandle)(businessHour);
    logger_1.businessHourLogger.debug({
        msg: 'Opening business hour',
        businessHour: businessHour._id,
        totalAgents: agentIds.length,
        top10AgentIds: agentIds.slice(0, 10),
    });
    yield models_1.Users.addBusinessHourByAgentIds(agentIds, businessHour._id);
    yield (0, Helper_1.makeOnlineAgentsAvailable)(agentIds);
    if (updateLivechatStatus) {
        yield (0, Helper_1.makeAgentsUnavailableBasedOnBusinessHour)();
    }
});
exports.openBusinessHour = openBusinessHour;
const removeBusinessHourByAgentIds = (agentIds, businessHourId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!agentIds.length) {
        return;
    }
    yield models_1.Users.removeBusinessHourByAgentIds(agentIds, businessHourId);
    yield (0, Helper_1.makeAgentsUnavailableBasedOnBusinessHour)();
});
exports.removeBusinessHourByAgentIds = removeBusinessHourByAgentIds;
