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
const closeBusinessHour_1 = require("../../../app/livechat/server/business-hour/closeBusinessHour");
const Helper_1 = require("../../app/livechat-enterprise/server/business-hour/Helper");
closeBusinessHour_1.closeBusinessHour.patch((_next, businessHour) => __awaiter(void 0, void 0, void 0, function* () {
    const agentIds = yield (0, Helper_1.getAgentIdsToHandle)(businessHour);
    return (0, closeBusinessHour_1.closeBusinessHourByAgentIds)(businessHour._id, agentIds);
}));
