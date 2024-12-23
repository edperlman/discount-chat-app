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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewData = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const secondsToHHMMSS_1 = require("../../../lib/utils/secondsToHHMMSS");
class OverviewData {
    constructor(roomsModel) {
        this.roomsModel = roomsModel;
    }
    isActionAllowed(action) {
        if (!action) {
            return false;
        }
        return ['Conversations', 'Productivity'].includes(action);
    }
    callAction(action, ...args) {
        switch (action) {
            case 'Conversations':
                return this.Conversations(...args);
            case 'Productivity':
                return this.Productivity(...args);
            default:
                throw new Error('Invalid action');
        }
    }
    getKeyHavingMaxValue(map, def) {
        let maxValue = 0;
        let maxKey = def; // default
        map.forEach((value, key) => {
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
        });
        return maxKey;
    }
    sumAllMapKeys(map) {
        let sum = 0;
        map.forEach((value) => {
            sum += value;
        });
        return sum;
    }
    getBusiestDay(map) {
        let mostMessages = -1;
        let busiestDay = '-';
        map.forEach((value, key) => {
            const v = this.sumAllMapKeys(value);
            if (v > mostMessages) {
                mostMessages = v;
                busiestDay = key;
            }
        });
        return busiestDay;
    }
    getAllMapKeysSize(map) {
        let size = 0;
        [...map.keys()].forEach((key) => {
            var _a;
            size += ((_a = map.get(key)) === null || _a === void 0 ? void 0 : _a.size) || 0;
        });
        return size;
    }
    Conversations(from_1, to_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, timezone = 'UTC', t = (v) => v, extraQuery = {}) {
            var _a, e_1, _b, _c;
            const analyticsMap = new Map();
            let openConversations = 0; // open conversations
            let totalMessages = 0; // total msgs
            let totalConversations = 0; // Total conversations
            const days = to.diff(from, 'days') + 1; // total days
            const date = {
                gte: moment_timezone_1.default.tz(from, timezone).startOf('day').utc(),
                lte: moment_timezone_1.default.tz(to, timezone).endOf('day').utc(),
            };
            // @ts-expect-error - Check extraquery usage on this func
            const cursor = this.roomsModel.getAnalyticsBetweenDate(date, { departmentId }, extraQuery);
            try {
                for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                    _c = cursor_1_1.value;
                    _d = false;
                    const room = _c;
                    totalConversations++;
                    if (room.metrics && !room.metrics.chatDuration && !room.onHold) {
                        openConversations++;
                    }
                    const creationDay = moment_timezone_1.default.tz(room.ts, timezone).format('DD-MM-YYYY'); // @string: 01-01-2021
                    const creationHour = moment_timezone_1.default.tz(room.ts, timezone).format('H'); // @int : 0, 1, ... 23
                    if (!analyticsMap.has(creationDay)) {
                        analyticsMap.set(creationDay, new Map());
                    }
                    const dayMap = analyticsMap.get(creationDay);
                    if (!dayMap.has(creationHour)) {
                        dayMap.set(creationHour, 0);
                    }
                    dayMap.set(creationHour, dayMap.get(creationHour) ? dayMap.get(creationHour) + room.msgs : room.msgs);
                    totalMessages += room.msgs;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // @ts-expect-error - Check extraquery usage on this func
            const onHoldConversations = yield this.roomsModel.getOnHoldConversationsBetweenDate(from, to, departmentId, extraQuery);
            const busiestDayFromMap = this.getBusiestDay(analyticsMap); // returns busiest day based on the number of messages sent on that day
            const busiestHour = this.getKeyHavingMaxValue(analyticsMap.get(busiestDayFromMap) || new Map(), -1); // returns key with max value
            const busiestTimeFrom = busiestHour >= 0 ? moment_timezone_1.default.tz(`${busiestHour}`, 'H', timezone).format('hA') : ''; // @string: 12AM, 1AM ...
            const busiestTimeTo = busiestHour >= 0 ? moment_timezone_1.default.tz(`${busiestHour}`, 'H', timezone).add(1, 'hour').format('hA') : ''; // @string: 1AM, 2AM ...
            const busiestDay = busiestDayFromMap !== '-' ? moment_timezone_1.default.tz(busiestDayFromMap, 'DD-MM-YYYY', timezone).format('dddd') : ''; // @string: Monday, Tuesday ...
            return [
                {
                    title: 'Total_conversations',
                    value: totalConversations,
                },
                {
                    title: 'Open_conversations',
                    value: openConversations,
                },
                {
                    title: 'On_Hold_conversations',
                    value: onHoldConversations,
                },
                {
                    title: 'Total_messages',
                    value: totalMessages,
                },
                {
                    title: 'Busiest_day',
                    value: t(busiestDay) || '-',
                },
                {
                    title: 'Conversations_per_day',
                    value: (totalConversations / days).toFixed(2),
                },
                {
                    title: 'Busiest_time',
                    value: `${busiestTimeFrom}${busiestTimeTo ? ` - ${busiestTimeTo}` : ''}` || '-',
                },
            ];
        });
    }
    Productivity(from_1, to_1, departmentId_1, _timezone_1) {
        return __awaiter(this, arguments, void 0, function* (from, to, departmentId, _timezone, _t = (v) => v, extraQuery) {
            let avgResponseTime = 0;
            let firstResponseTime = 0;
            let avgReactionTime = 0;
            let count = 0;
            const date = {
                gte: from.toDate(),
                lte: to.toDate(),
            };
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics }) => {
                if ((metrics === null || metrics === void 0 ? void 0 : metrics.response) && metrics.reaction) {
                    avgResponseTime += metrics.response.avg;
                    firstResponseTime += metrics.response.ft;
                    avgReactionTime += metrics.reaction.ft;
                    count++;
                }
            });
            if (count) {
                avgResponseTime /= count;
                firstResponseTime /= count;
                avgReactionTime /= count;
            }
            const data = [
                {
                    title: 'Avg_response_time',
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(avgResponseTime.toFixed(2)),
                },
                {
                    title: 'Avg_first_response_time',
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(firstResponseTime.toFixed(2)),
                },
                {
                    title: 'Avg_reaction_time',
                    value: (0, secondsToHHMMSS_1.secondsToHHMMSS)(avgReactionTime.toFixed(2)),
                },
            ];
            return data;
        });
    }
}
exports.OverviewData = OverviewData;
