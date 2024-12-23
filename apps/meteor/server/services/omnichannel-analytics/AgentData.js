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
exports.AgentOverviewData = void 0;
const secondsToHHMMSS_1 = require("../../../lib/utils/secondsToHHMMSS");
class AgentOverviewData {
    constructor(roomsModel) {
        this.roomsModel = roomsModel;
    }
    updateMap(map, key, value) {
        const currentKeyValue = map.get(key);
        map.set(key, currentKeyValue ? currentKeyValue + value : value);
    }
    sortByValue(data, inv = false) {
        data.sort((a, b) => {
            // sort array
            if (parseFloat(a.value) > parseFloat(b.value)) {
                return inv ? -1 : 1; // if inv, reverse sort
            }
            if (parseFloat(a.value) < parseFloat(b.value)) {
                return inv ? 1 : -1;
            }
            return 0;
        });
    }
    isActionAllowed(action) {
        if (!action) {
            return false;
        }
        return [
            'Total_conversations',
            'Avg_chat_duration',
            'Total_messages',
            'Avg_first_response_time',
            'Best_first_response_time',
            'Avg_response_time',
            'Avg_reaction_time',
        ].includes(action);
    }
    callAction(action, ...args) {
        switch (action) {
            case 'Total_conversations':
                return this.Total_conversations(...args);
            case 'Avg_chat_duration':
                return this.Avg_chat_duration(...args);
            case 'Total_messages':
                return this.Total_messages(...args);
            case 'Avg_first_response_time':
                return this.Avg_first_response_time(...args);
            case 'Best_first_response_time':
                return this.Best_first_response_time(...args);
            case 'Avg_response_time':
                return this.Avg_response_time(...args);
            case 'Avg_reaction_time':
                return this.Avg_reaction_time(...args);
            default:
                throw new Error('Invalid action');
        }
    }
    Total_conversations(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            let total = 0;
            const agentConversations = new Map(); // stores total conversations for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: '%_of_conversations',
                    },
                ],
                data: [],
            };
            yield this.roomsModel
                .getAnalyticsMetricsBetweenDateWithMessages('l', date, {
                departmentId,
            }, {}, extraQuery)
                .forEach((room) => {
                if (room.servedBy) {
                    this.updateMap(agentConversations, room.servedBy.username, 1);
                    total++;
                }
            });
            agentConversations.forEach((value, key) => {
                // calculate percentage
                const percentage = ((value / total) * 100).toFixed(2);
                data.data.push({
                    name: key,
                    value: `${percentage}%`,
                });
            });
            this.sortByValue(data.data, true); // reverse sort array
            return data;
        });
    }
    Avg_chat_duration(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            const agentChatDurations = new Map(); // stores total conversations for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_chat_duration',
                    },
                ],
                data: [],
            };
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics, servedBy }) => {
                if (servedBy && metrics && metrics.chatDuration) {
                    if (agentChatDurations.has(servedBy.username)) {
                        agentChatDurations.set(servedBy.username, {
                            chatDuration: agentChatDurations.get(servedBy.username).chatDuration + metrics.chatDuration,
                            total: agentChatDurations.get(servedBy.username).total + 1,
                        });
                    }
                    else {
                        agentChatDurations.set(servedBy.username, {
                            chatDuration: metrics.chatDuration,
                            total: 1,
                        });
                    }
                }
            });
            agentChatDurations.forEach((obj, key) => {
                // calculate percentage
                const avg = (obj.chatDuration / obj.total).toFixed(2);
                data.data.push({
                    name: key,
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(avg),
                });
            });
            this.sortByValue(data.data, true); // reverse sort array
            return data;
        });
    }
    Total_messages(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            const agentMessages = new Map(); // stores total conversations for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Total_messages',
                    },
                ],
                data: [],
            };
            // we don't want to count visitor messages
            const extraFilter = { $lte: ['$token', null] };
            yield this.roomsModel
                .getAnalyticsMetricsBetweenDateWithMessages('l', date, { departmentId }, extraFilter, extraQuery)
                .forEach(({ servedBy, msgs }) => {
                if (servedBy) {
                    this.updateMap(agentMessages, servedBy.username, msgs);
                }
            });
            agentMessages.forEach((value, key) => {
                // calculate percentage
                data.data.push({
                    name: key,
                    value,
                });
            });
            this.sortByValue(data.data, true); // reverse sort array
            return data;
        });
    }
    Avg_first_response_time(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            const agentAvgRespTime = new Map(); // stores avg response time for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_first_response_time',
                    },
                ],
                data: [],
            };
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics, servedBy }) => {
                if (servedBy && metrics && metrics.response && metrics.response.ft) {
                    if (agentAvgRespTime.has(servedBy.username)) {
                        agentAvgRespTime.set(servedBy.username, {
                            frt: agentAvgRespTime.get(servedBy.username).frt + metrics.response.ft,
                            total: agentAvgRespTime.get(servedBy.username).total + 1,
                        });
                    }
                    else {
                        agentAvgRespTime.set(servedBy.username, {
                            frt: metrics.response.ft,
                            total: 1,
                        });
                    }
                }
            });
            agentAvgRespTime.forEach((obj, key) => {
                // calculate avg
                const avg = obj.frt / obj.total;
                data.data.push({
                    name: key,
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(avg.toFixed(2)),
                });
            });
            this.sortByValue(data.data, false); // sort array
            return data;
        });
    }
    Best_first_response_time(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            const agentFirstRespTime = new Map(); // stores avg response time for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Best_first_response_time',
                    },
                ],
                data: [],
            };
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics, servedBy }) => {
                if (servedBy && metrics && metrics.response && metrics.response.ft) {
                    if (agentFirstRespTime.has(servedBy.username)) {
                        agentFirstRespTime.set(servedBy.username, Math.min(agentFirstRespTime.get(servedBy.username), metrics.response.ft));
                    }
                    else {
                        agentFirstRespTime.set(servedBy.username, metrics.response.ft);
                    }
                }
            });
            agentFirstRespTime.forEach((value, key) => {
                // calculate avg
                data.data.push({
                    name: key,
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(value.toFixed(2)),
                });
            });
            this.sortByValue(data.data, false); // sort array
            return data;
        });
    }
    Avg_response_time(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            const agentAvgRespTime = new Map(); // stores avg response time for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
                data: [],
            };
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics, servedBy }) => {
                if (servedBy && metrics && metrics.response && metrics.response.avg) {
                    if (agentAvgRespTime.has(servedBy.username)) {
                        agentAvgRespTime.set(servedBy.username, {
                            avg: agentAvgRespTime.get(servedBy.username).avg + metrics.response.avg,
                            total: agentAvgRespTime.get(servedBy.username).total + 1,
                        });
                    }
                    else {
                        agentAvgRespTime.set(servedBy.username, {
                            avg: metrics.response.avg,
                            total: 1,
                        });
                    }
                }
            });
            agentAvgRespTime.forEach((obj, key) => {
                // calculate avg
                const avg = obj.avg / obj.total;
                data.data.push({
                    name: key,
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(avg.toFixed(2)),
                });
            });
            this.sortByValue(data.data, false); // sort array
            return data;
        });
    }
    Avg_reaction_time(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, extraQuery = {}) {
            const agentAvgReactionTime = new Map(); // stores avg reaction time for each agent
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            const data = {
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
                data: [],
            };
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics, servedBy }) => {
                if (servedBy && metrics && metrics.reaction && metrics.reaction.ft) {
                    if (agentAvgReactionTime.has(servedBy.username)) {
                        agentAvgReactionTime.set(servedBy.username, {
                            frt: agentAvgReactionTime.get(servedBy.username).frt + metrics.reaction.ft,
                            total: agentAvgReactionTime.get(servedBy.username).total + 1,
                        });
                    }
                    else {
                        agentAvgReactionTime.set(servedBy.username, {
                            frt: metrics.reaction.ft,
                            total: 1,
                        });
                    }
                }
            });
            agentAvgReactionTime.forEach((obj, key) => {
                // calculate avg
                const avg = obj.frt / obj.total;
                data.data.push({
                    name: key,
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(avg.toFixed(2)),
                });
            });
            this.sortByValue(data.data, false); // sort array
            return data;
        });
    }
}
exports.AgentOverviewData = AgentOverviewData;
