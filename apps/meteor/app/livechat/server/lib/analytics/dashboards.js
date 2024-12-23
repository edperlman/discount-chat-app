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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllResponseTimeMetricsAsyncCached = exports.findAllChatMetricsByDepartmentAsyncCached = exports.findAllAgentsStatusAsyncCached = exports.findAllChatMetricsByAgentAsyncCached = exports.findAllChatsStatusAsyncCached = exports.getProductivityMetricsAsyncCached = exports.getChatsMetricsAsyncCached = exports.getAgentsProductivityMetricsAsyncCached = exports.getConversationsMetricsAsyncCached = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const moment_1 = __importDefault(require("moment"));
const secondsToHHMMSS_1 = require("../../../../../lib/utils/secondsToHHMMSS");
const server_1 = require("../../../../settings/server");
const AnalyticsTyped_1 = require("../AnalyticsTyped");
const departments_1 = require("./departments");
const findAllChatsStatusAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    return {
        open: yield models_1.LivechatRooms.countAllOpenChatsBetweenDate({ start, end, departmentId }),
        closed: yield models_1.LivechatRooms.countAllClosedChatsBetweenDate({ start, end, departmentId }),
        queued: yield models_1.LivechatRooms.countAllQueuedChatsBetweenDate({ start, end, departmentId }),
        onhold: yield models_1.LivechatRooms.getOnHoldConversationsBetweenDate(start, end, departmentId),
    };
});
const getProductivityMetricsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined, user, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const totalizers = (yield core_services_1.OmnichannelAnalytics.getAnalyticsOverviewData({
        daterange: {
            from: start,
            to: end,
        },
        analyticsOptions: {
            name: 'Productivity',
        },
        departmentId,
        utcOffset: user === null || user === void 0 ? void 0 : user.utcOffset,
        language: (user === null || user === void 0 ? void 0 : user.language) || server_1.settings.get('Language') || 'en',
    })) || [];
    const averageWaitingTime = yield (0, departments_1.findAllAverageWaitingTimeAsync)({
        start: new Date(start),
        end: new Date(end),
        departmentId,
    });
    const totalOfWaitingTime = averageWaitingTime.departments.length;
    const sumOfWaitingTime = averageWaitingTime.departments.reduce((acc, serviceTime) => {
        acc += serviceTime.averageWaitingTimeInSeconds;
        return acc;
    }, 0);
    const totalOfAvarageWaitingTime = totalOfWaitingTime === 0 ? 0 : sumOfWaitingTime / totalOfWaitingTime;
    return {
        totalizers: [...totalizers, { title: 'Avg_of_waiting_time', value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(totalOfAvarageWaitingTime) }],
    };
});
const getAgentsProductivityMetricsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined, user, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    // TODO: check type of date
    const averageOfAvailableServiceTime = (yield models_1.LivechatAgentActivity.findAllAverageAvailableServiceTime({
        date: parseInt((0, moment_1.default)(start).format('YYYYMMDD')),
        departmentId,
    }))[0];
    const averageOfServiceTime = yield (0, departments_1.findAllAverageServiceTimeAsync)({
        start: new Date(start),
        end: new Date(end),
        departmentId,
    });
    const totalizers = (yield core_services_1.OmnichannelAnalytics.getAnalyticsOverviewData({
        daterange: {
            from: start,
            to: end,
        },
        analyticsOptions: {
            name: 'Conversations',
        },
        departmentId,
        utcOffset: user.utcOffset,
        language: user.language || server_1.settings.get('Language') || 'en',
    })) || [];
    const totalOfServiceTime = averageOfServiceTime.departments.length;
    const sumOfServiceTime = averageOfServiceTime.departments.reduce((acc, serviceTime) => {
        acc += serviceTime.averageServiceTimeInSeconds;
        return acc;
    }, 0);
    const totalOfAverageAvailableServiceTime = averageOfAvailableServiceTime
        ? averageOfAvailableServiceTime.averageAvailableServiceTimeInSeconds
        : 0;
    const totalOfAverageServiceTime = totalOfServiceTime === 0 ? 0 : sumOfServiceTime / totalOfServiceTime;
    return {
        totalizers: [
            ...totalizers.filter((metric) => metric.title === 'Busiest_time'),
            {
                title: 'Avg_of_available_service_time',
                value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(totalOfAverageAvailableServiceTime),
            },
            { title: 'Avg_of_service_time', value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(totalOfAverageServiceTime) },
        ],
    };
});
const getChatsMetricsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const abandonedRooms = yield (0, departments_1.findAllNumberOfAbandonedRoomsAsync)({
        start,
        end,
        departmentId,
    });
    const averageOfAbandonedRooms = yield (0, departments_1.findPercentageOfAbandonedRoomsAsync)({
        start,
        end,
        departmentId,
    });
    const averageOfChatDurationTime = yield (0, departments_1.findAllAverageOfChatDurationTimeAsync)({
        start,
        end,
        departmentId,
    });
    const totalOfAbandonedRooms = averageOfAbandonedRooms.departments.length;
    const totalOfChatDurationTime = averageOfChatDurationTime.departments.length;
    const sumOfPercentageOfAbandonedRooms = averageOfAbandonedRooms.departments.reduce((acc, abandonedRoom) => {
        acc += abandonedRoom.percentageOfAbandonedChats;
        return acc;
    }, 0);
    const sumOfChatDurationTime = averageOfChatDurationTime.departments.reduce((acc, chatDurationTime) => {
        acc += chatDurationTime.averageChatDurationTimeInSeconds;
        return acc;
    }, 0);
    const totalAbandonedRooms = abandonedRooms.departments.reduce((acc, item) => {
        acc += item.abandonedRooms;
        return acc;
    }, 0);
    const totalOfAverageAbandonedRooms = totalOfAbandonedRooms === 0 ? 0 : sumOfPercentageOfAbandonedRooms / totalOfAbandonedRooms;
    const totalOfAverageChatDurationTime = totalOfChatDurationTime === 0 ? 0 : sumOfChatDurationTime / totalOfChatDurationTime;
    return {
        totalizers: [
            { title: 'Total_abandoned_chats', value: totalAbandonedRooms },
            { title: 'Avg_of_abandoned_chats', value: `${totalOfAverageAbandonedRooms}%` },
            {
                title: 'Avg_of_chat_duration_time',
                value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(totalOfAverageChatDurationTime),
            },
        ],
    };
});
const getConversationsMetricsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, user, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const totalizers = (yield (0, AnalyticsTyped_1.getAnalyticsOverviewDataCachedForRealtime)(Object.assign(Object.assign({ daterange: {
            from: start,
            to: end,
        }, analyticsOptions: {
            name: 'Conversations',
        } }, (departmentId && departmentId !== 'undefined' && { departmentId })), { utcOffset: user.utcOffset, language: user.language || server_1.settings.get('Language') || 'en' }))) || [];
    const metrics = ['Total_conversations', 'Open_conversations', 'On_Hold_conversations', 'Total_messages'];
    const visitorsCount = yield models_1.LivechatVisitors.countVisitorsBetweenDate({
        start: new Date(start),
        end: new Date(end),
        department: departmentId,
    });
    return {
        totalizers: [
            ...totalizers.filter((metric) => metrics.includes(metric.title)),
            { title: 'Total_visitors', value: visitorsCount },
        ],
    };
});
const findAllChatMetricsByAgentAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const open = yield models_1.LivechatRooms.countAllOpenChatsByAgentBetweenDate({
        start,
        end,
        departmentId,
    });
    const closed = yield models_1.LivechatRooms.countAllClosedChatsByAgentBetweenDate({
        start,
        end,
        departmentId,
    });
    const onhold = yield models_1.LivechatRooms.countAllOnHoldChatsByAgentBetweenDate({
        start,
        end,
        departmentId,
    });
    const result = {};
    (open || []).forEach((agent) => {
        result[agent._id] = { open: agent.chats, closed: 0, onhold: 0 };
    });
    (closed || []).forEach((agent) => {
        result[agent._id] = {
            open: result[agent._id] ? result[agent._id].open : 0,
            closed: agent.chats,
        };
    });
    (onhold || []).forEach((agent) => {
        result[agent._id] = Object.assign(Object.assign({}, result[agent._id]), { onhold: agent.chats });
    });
    return result;
});
const findAllAgentsStatusAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ departmentId = undefined }) { return (yield models_1.Users.countAllAgentsStatus({ departmentId }))[0]; });
const findAllChatMetricsByDepartmentAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const open = yield models_1.LivechatRooms.countAllOpenChatsByDepartmentBetweenDate({
        start,
        end,
        departmentId,
    });
    const closed = yield models_1.LivechatRooms.countAllClosedChatsByDepartmentBetweenDate({
        start,
        end,
        departmentId,
    });
    const result = {};
    (open || []).forEach((department) => {
        result[department.name] = { open: department.chats, closed: 0 };
    });
    (closed || []).forEach((department) => {
        result[department.name] = {
            open: result[department.name] ? result[department.name].open : 0,
            closed: department.chats,
        };
    });
    return result;
});
const findAllResponseTimeMetricsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId = undefined, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const responseTimes = (yield models_1.LivechatRooms.calculateResponseTimingsBetweenDates({ start, end, departmentId }))[0];
    const reactionTimes = (yield models_1.LivechatRooms.calculateReactionTimingsBetweenDates({ start, end, departmentId }))[0];
    const durationTimings = (yield models_1.LivechatRooms.calculateDurationTimingsBetweenDates({ start, end, departmentId }))[0];
    return {
        response: {
            avg: responseTimes ? responseTimes.avg : 0,
            longest: responseTimes ? responseTimes.longest : 0,
        },
        reaction: {
            avg: reactionTimes ? reactionTimes.avg : 0,
            longest: reactionTimes ? reactionTimes.longest : 0,
        },
        chatDuration: {
            avg: durationTimings ? durationTimings.avg : 0,
            longest: durationTimings ? durationTimings.longest : 0,
        },
    };
});
exports.getConversationsMetricsAsyncCached = (0, mem_1.default)(getConversationsMetricsAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.getAgentsProductivityMetricsAsyncCached = (0, mem_1.default)(getAgentsProductivityMetricsAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.getChatsMetricsAsyncCached = (0, mem_1.default)(getChatsMetricsAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.getProductivityMetricsAsyncCached = (0, mem_1.default)(getProductivityMetricsAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.findAllChatsStatusAsyncCached = (0, mem_1.default)(findAllChatsStatusAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.findAllChatMetricsByAgentAsyncCached = (0, mem_1.default)(findAllChatMetricsByAgentAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.findAllAgentsStatusAsyncCached = (0, mem_1.default)(findAllAgentsStatusAsync, { maxAge: 5000, cacheKey: JSON.stringify });
exports.findAllChatMetricsByDepartmentAsyncCached = (0, mem_1.default)(findAllChatMetricsByDepartmentAsync, {
    maxAge: 5000,
    cacheKey: JSON.stringify,
});
exports.findAllResponseTimeMetricsAsyncCached = (0, mem_1.default)(findAllResponseTimeMetricsAsync, { maxAge: 5000, cacheKey: JSON.stringify });
