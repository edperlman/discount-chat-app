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
const server_2 = require("../../../../settings/server");
const AnalyticsTyped_1 = require("../../lib/AnalyticsTyped");
server_1.API.v1.addRoute('livechat/analytics/agent-overview', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsAgentOverviewProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, departmentId, from, to } = this.queryParams;
            if (!name) {
                throw new Error('invalid-chart-name');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { _id: 1, utcOffset: 1 } });
            return server_1.API.v1.success(yield (0, AnalyticsTyped_1.getAgentOverviewDataCached)({
                departmentId,
                utcOffset: (user === null || user === void 0 ? void 0 : user.utcOffset) || 0,
                daterange: { from, to },
                chartOptions: { name },
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/overview', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsOverviewProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, departmentId, from, to } = this.queryParams;
            if (!name) {
                throw new Error('invalid-chart-name');
            }
            const user = yield models_1.Users.findOneById(this.userId, { projection: { _id: 1, utcOffset: 1 } });
            const language = (user === null || user === void 0 ? void 0 : user.language) || server_2.settings.get('Language') || 'en';
            return server_1.API.v1.success(yield (0, AnalyticsTyped_1.getAnalyticsOverviewDataCached)({
                departmentId,
                utcOffset: (user === null || user === void 0 ? void 0 : user.utcOffset) || 0,
                daterange: { from, to },
                analyticsOptions: { name },
                language,
            }));
        });
    },
});
