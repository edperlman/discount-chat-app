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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../../app/api/server");
const getPaginationItems_1 = require("../../../../../app/api/server/helpers/getPaginationItems");
const agents_1 = require("../../../../../app/livechat/server/lib/analytics/agents");
server_1.API.v1.addRoute('livechat/analytics/agents/average-service-time', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isLivechatAnalyticsAgentsAverageServiceTimeProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { agents, total } = yield (0, agents_1.findAllAverageServiceTimeAsync)({
                start: startDate,
                end: endDate,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                agents,
                count: agents.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/agents/total-service-time', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isLivechatAnalyticsAgentsTotalServiceTimeProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { agents, total } = yield (0, agents_1.findAllServiceTimeAsync)({
                start: startDate,
                end: endDate,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                agents,
                count: agents.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/agents/available-for-service-history', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsAgentsAvailableForServiceHistoryProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { fullReport } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const { agents, total } = yield (0, agents_1.findAvailableServiceTimeHistoryAsync)({
                start,
                end,
                fullReport: fullReport === 'true',
                options: { offset, count },
            });
            return server_1.API.v1.success({
                agents,
                count: agents.length,
                offset,
                total,
            });
        });
    },
});
