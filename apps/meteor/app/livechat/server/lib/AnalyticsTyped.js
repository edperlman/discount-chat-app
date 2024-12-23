"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsOverviewDataCachedForRealtime = exports.getAnalyticsOverviewDataCached = exports.getAgentOverviewDataCached = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const mem_1 = __importDefault(require("mem"));
exports.getAgentOverviewDataCached = (0, mem_1.default)(core_services_1.OmnichannelAnalytics.getAgentOverviewData, {
    maxAge: process.env.TEST_MODE === 'true' ? 1 : 60000,
    cacheKey: JSON.stringify,
});
// Agent overview data on realtime is cached for 5 seconds
// while the data on the overview page is cached for 1 minute
exports.getAnalyticsOverviewDataCached = (0, mem_1.default)(core_services_1.OmnichannelAnalytics.getAnalyticsOverviewData, {
    maxAge: 60000,
    cacheKey: JSON.stringify,
});
exports.getAnalyticsOverviewDataCachedForRealtime = (0, mem_1.default)(core_services_1.OmnichannelAnalytics.getAnalyticsOverviewData, {
    maxAge: process.env.TEST_MODE === 'true' ? 1 : 5000,
    cacheKey: JSON.stringify,
});
