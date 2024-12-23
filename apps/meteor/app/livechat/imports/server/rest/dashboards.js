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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../api/server");
const dashboards_1 = require("../../../server/lib/analytics/dashboards");
server_1.API.v1.addRoute('livechat/analytics/dashboards/conversation-totalizers', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isGETDashboardTotalizerParams,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { utcOffset: 1, language: 1 } });
            if (!user) {
                return server_1.API.v1.failure('User not found');
            }
            const totalizers = yield (0, dashboards_1.getConversationsMetricsAsyncCached)({ start, end, departmentId, user });
            return server_1.API.v1.success(totalizers);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/agents-productivity-totalizers', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { utcOffset: 1, language: 1 } });
            if (!user) {
                return server_1.API.v1.failure('User not found');
            }
            const totalizers = yield (0, dashboards_1.getAgentsProductivityMetricsAsyncCached)({ start, end, departmentId, user });
            return server_1.API.v1.success(totalizers);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/chats-totalizers', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const totalizers = yield (0, dashboards_1.getChatsMetricsAsyncCached)({ start: startDate, end: endDate, departmentId });
            return server_1.API.v1.success(totalizers);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/productivity-totalizers', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { utcOffset: 1, language: 1 } });
            if (!user) {
                return server_1.API.v1.failure('User not found');
            }
            const totalizers = yield (0, dashboards_1.getProductivityMetricsAsyncCached)({ start, end, departmentId, user });
            return server_1.API.v1.success(totalizers);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/charts/chats', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const result = yield (0, dashboards_1.findAllChatsStatusAsyncCached)({ start: startDate, end: endDate, departmentId });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/charts/chats-per-agent', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const result = yield (0, dashboards_1.findAllChatMetricsByAgentAsyncCached)({ start: startDate, end: endDate, departmentId });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/charts/agents-status', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardsAgentStatusParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { departmentId } = this.queryParams;
            const result = yield (0, dashboards_1.findAllAgentsStatusAsyncCached)({ departmentId });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/charts/chats-per-department', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const result = (yield (0, dashboards_1.findAllChatMetricsByDepartmentAsyncCached)({ start: startDate, end: endDate, departmentId }));
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/charts/timings', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isGETDashboardTotalizerParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const result = yield (0, dashboards_1.findAllResponseTimeMetricsAsyncCached)({ start: startDate, end: endDate, departmentId });
            return server_1.API.v1.success(result);
        });
    },
});
