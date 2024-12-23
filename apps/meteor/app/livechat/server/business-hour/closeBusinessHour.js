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
exports.closeBusinessHour = exports.closeBusinessHourByAgentIds = void 0;
const models_1 = require("@rocket.chat/models");
const patch_injection_1 = require("@rocket.chat/patch-injection");
const Helper_1 = require("./Helper");
const getAgentIdsForBusinessHour_1 = require("./getAgentIdsForBusinessHour");
const logger_1 = require("../lib/logger");
const closeBusinessHourByAgentIds = (businessHourId, agentIds) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.businessHourLogger.debug({
        msg: 'Closing business hour',
        businessHour: businessHourId,
        totalAgents: agentIds.length,
        top10AgentIds: agentIds.slice(0, 10),
    });
    yield models_1.Users.removeBusinessHourByAgentIds(agentIds, businessHourId);
    yield (0, Helper_1.makeAgentsUnavailableBasedOnBusinessHour)();
});
exports.closeBusinessHourByAgentIds = closeBusinessHourByAgentIds;
exports.closeBusinessHour = (0, patch_injection_1.makeFunction)((businessHour) => __awaiter(void 0, void 0, void 0, function* () {
    const agentIds = yield (0, getAgentIdsForBusinessHour_1.getAgentIdsForBusinessHour)();
    return (0, exports.closeBusinessHourByAgentIds)(businessHour._id, agentIds);
}));
