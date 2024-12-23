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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const normalizeMessageFileUpload_1 = require("../../../utils/server/functions/normalizeMessageFileUpload");
const getMetricValue = (metric, defaultValue) => metric !== null && metric !== void 0 ? metric : defaultValue;
const calculateTimeDifference = (startTime, now) => (now.getTime() - new Date(startTime).getTime()) / 1000;
const calculateAvgResponseTime = (totalResponseTime, newResponseTime, responseCount) => (totalResponseTime + newResponseTime) / (responseCount + 1);
const getFirstResponseAnalytics = (visitorLastQuery, agentJoinTime, totalResponseTime, responseCount, now) => {
    const responseTime = calculateTimeDifference(visitorLastQuery, now);
    const reactionTime = calculateTimeDifference(agentJoinTime, now);
    const avgResponseTime = calculateAvgResponseTime(totalResponseTime, responseTime, responseCount);
    return {
        firstResponseDate: now,
        firstResponseTime: responseTime,
        responseTime,
        avgResponseTime,
        firstReactionDate: now,
        firstReactionTime: reactionTime,
        reactionTime,
    };
};
const getSubsequentResponseAnalytics = (visitorLastQuery, totalResponseTime, responseCount, now) => {
    const responseTime = calculateTimeDifference(visitorLastQuery, now);
    const avgResponseTime = calculateAvgResponseTime(totalResponseTime, responseTime, responseCount);
    return {
        responseTime,
        avgResponseTime,
        reactionTime: responseTime,
    };
};
const getAnalyticsData = (room, now) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const visitorLastQuery = getMetricValue((_b = (_a = room.metrics) === null || _a === void 0 ? void 0 : _a.v) === null || _b === void 0 ? void 0 : _b.lq, room.ts);
    const agentLastReply = getMetricValue((_d = (_c = room.metrics) === null || _c === void 0 ? void 0 : _c.servedBy) === null || _d === void 0 ? void 0 : _d.lr, room.ts);
    const agentJoinTime = getMetricValue((_e = room.servedBy) === null || _e === void 0 ? void 0 : _e.ts, room.ts);
    const totalResponseTime = getMetricValue((_g = (_f = room.metrics) === null || _f === void 0 ? void 0 : _f.response) === null || _g === void 0 ? void 0 : _g.tt, 0);
    const responseCount = getMetricValue((_j = (_h = room.metrics) === null || _h === void 0 ? void 0 : _h.response) === null || _j === void 0 ? void 0 : _j.total, 0);
    if (agentLastReply === room.ts) {
        return getFirstResponseAnalytics(visitorLastQuery, agentJoinTime, totalResponseTime, responseCount, now);
    }
    if (visitorLastQuery > agentLastReply) {
        return getSubsequentResponseAnalytics(visitorLastQuery, totalResponseTime, responseCount, now);
    }
};
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room, roomUpdater }) {
    if (!message || (0, core_typings_1.isEditedMessage)(message) || (0, core_typings_1.isSystemMessage)(message)) {
        return message;
    }
    if (message.file) {
        message = Object.assign(Object.assign({}, (yield (0, normalizeMessageFileUpload_1.normalizeMessageFileUpload)(message))), { _updatedAt: message._updatedAt });
    }
    if ((0, core_typings_1.isMessageFromVisitor)(message)) {
        models_1.LivechatRooms.getAnalyticsUpdateQueryBySentByVisitor(room, message, roomUpdater);
    }
    else {
        const analyticsData = getAnalyticsData(room, new Date());
        models_1.LivechatRooms.getAnalyticsUpdateQueryBySentByAgent(room, message, analyticsData, roomUpdater);
    }
    return message;
}), callbacks_1.callbacks.priority.LOW, 'saveAnalyticsData');
