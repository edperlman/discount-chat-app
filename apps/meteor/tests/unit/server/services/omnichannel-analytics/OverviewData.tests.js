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
/* eslint-disable new-cap */
const chai_1 = require("chai");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sinon_1 = __importDefault(require("sinon"));
const mockData_1 = require("./mockData");
const OverviewData_1 = require("../../../../../server/services/omnichannel-analytics/OverviewData");
const analytics = (date) => {
    // filter the mockData array with the date param with moment
    return mockData_1.conversations.filter((c) => (0, moment_timezone_1.default)(c.ts).isBetween(date.gte, date.lte, undefined, '[]'));
};
describe('OverviewData Analytics', () => {
    describe('isActionAllowed', () => {
        it('should return false if no action is provided', () => {
            const overview = new OverviewData_1.OverviewData({});
            (0, chai_1.expect)(overview.isActionAllowed(undefined)).to.be.false;
        });
        it('should return false if an invalid action is provided', () => {
            const overview = new OverviewData_1.OverviewData({});
            (0, chai_1.expect)(overview.isActionAllowed('invalid_action')).to.be.false;
        });
        it('should return true if a valid action is provided', () => {
            const overview = new OverviewData_1.OverviewData({});
            (0, chai_1.expect)(overview.isActionAllowed('Conversations')).to.be.true;
        });
    });
    describe('callAction', () => {
        it('should fail if the action is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({});
            try {
                // @ts-expect-error - Invalid action
                yield overview.callAction('invalid_action', {});
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Invalid action');
            }
        }));
        it('should call the correct action with the correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsBetweenDate: () => [],
                getOnHoldConversationsBetweenDate: () => 0,
                getAnalyticsMetricsBetweenDate: () => [],
            });
            const spy = sinon_1.default.spy(overview, 'Conversations');
            const spy2 = sinon_1.default.spy(overview, 'Productivity');
            yield overview.callAction('Conversations', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), '', 'UTC');
            (0, chai_1.expect)(spy.calledOnce).to.be.true;
            yield overview.callAction('Productivity', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), '', 'UTC', (v) => v);
            (0, chai_1.expect)(spy2.calledOnce).to.be.true;
        }));
    });
    describe('getKeyHavingMaxValue', () => {
        it('should return the key with the max value', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            (0, chai_1.expect)(overview.getKeyHavingMaxValue(map, 'd')).to.be.equal('c');
        });
        it('should return the default key if the map is empty', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            (0, chai_1.expect)(overview.getKeyHavingMaxValue(map, 'd')).to.be.equal('d');
        });
    });
    describe('getAllMapKeysSize', () => {
        it('should return the sum of all map keys', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            (0, chai_1.expect)(overview.sumAllMapKeys(map)).to.be.equal(6);
        });
        it('should return 0 if the map is empty', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            (0, chai_1.expect)(overview.sumAllMapKeys(map)).to.be.equal(0);
        });
    });
    describe('getBusiestDay', () => {
        it('should return the day with the most messages', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            map.set('Monday', new Map([
                ['1', 1],
                ['2', 2],
            ]));
            map.set('Tuesday', new Map([
                ['13', 1],
                ['15', 2],
            ]));
            map.set('Sunday', new Map([
                ['12', 2],
                ['23', 2],
            ]));
            (0, chai_1.expect)(overview.getBusiestDay(map)).to.be.equal('Sunday');
        });
        it('should return the first day with the most messages if theres a tie', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            map.set('Monday', new Map([
                ['1', 1],
                ['2', 2],
            ]));
            map.set('Tuesday', new Map([
                ['13', 1],
                ['15', 2],
            ]));
            map.set('Sunday', new Map([
                ['12', 1],
                ['23', 2],
            ]));
            (0, chai_1.expect)(overview.getBusiestDay(map)).to.be.equal('Monday');
        });
        it('should return the default key if the map is empty', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            (0, chai_1.expect)(overview.getBusiestDay(map)).to.be.equal('-');
        });
    });
    describe('sumAllMapKeys', () => {
        it('should return the sum of all map keys', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            map.set('a', 1);
            map.set('b', 2);
            map.set('c', 3);
            (0, chai_1.expect)(overview.sumAllMapKeys(map)).to.be.equal(6);
        });
        it('should return 0 if the map is empty', () => {
            const overview = new OverviewData_1.OverviewData({});
            const map = new Map();
            (0, chai_1.expect)(overview.sumAllMapKeys(map)).to.be.equal(0);
        });
    });
    describe('Conversations', () => {
        it('should return all values as 0 when theres no data', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsBetweenDate: () => [],
                getOnHoldConversationsBetweenDate: () => 0,
            });
            const result = yield overview.Conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), '', 'UTC', (v) => v, {});
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Total_conversations', value: 0 },
                { title: 'Open_conversations', value: 0 },
                { title: 'On_Hold_conversations', value: 0 },
                { title: 'Total_messages', value: 0 },
                { title: 'Busiest_day', value: '-' },
                { title: 'Conversations_per_day', value: '0.00' },
                { title: 'Busiest_time', value: '-' },
            ]);
        }));
        it('should return all values as 0 when theres data but not on the period we pass', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsBetweenDate: () => analytics({ gte: (0, moment_timezone_1.default)().set('month', 9).toDate(), lte: (0, moment_timezone_1.default)().set('month', 9).toDate() }),
                getOnHoldConversationsBetweenDate: () => 0,
            });
            const result = yield overview.Conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), '', 'UTC', (v) => v, {});
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Total_conversations', value: 0 },
                { title: 'Open_conversations', value: 0 },
                { title: 'On_Hold_conversations', value: 0 },
                { title: 'Total_messages', value: 0 },
                { title: 'Busiest_day', value: '-' },
                { title: 'Conversations_per_day', value: '0.00' },
                { title: 'Busiest_time', value: '-' },
            ]);
        }));
        it('should return the correct values when theres data on the period we pass', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsBetweenDate: (date) => analytics(date),
                getOnHoldConversationsBetweenDate: () => 1,
            });
            // Fixed date to assure we get the same data
            const result = yield overview.Conversations(moment_timezone_1.default.utc().set('month', 10).set('year', 2023).set('date', 12).startOf('day'), moment_timezone_1.default.utc().set('month', 10).set('year', 2023).set('date', 12).endOf('day'), '', 'UTC', (v) => v, {});
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Total_conversations', value: 1 },
                { title: 'Open_conversations', value: 0 },
                { title: 'On_Hold_conversations', value: 1 },
                { title: 'Total_messages', value: 93 },
                { title: 'Busiest_day', value: 'Sunday' },
                { title: 'Conversations_per_day', value: '1.00' },
                { title: 'Busiest_time', value: '11AM - 12PM' },
            ]);
        }));
        it('should only return conversation metrics related to the provided period, and not consider previous or following days', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsBetweenDate: (date) => analytics(date),
                getOnHoldConversationsBetweenDate: () => 1,
            });
            // choosing this specific date since the day before and after are not empty
            const targetDate = moment_timezone_1.default.utc().set('month', 10).set('year', 2023).set('date', 23);
            // Fixed date to assure we get the same data
            const result = yield overview.Conversations(targetDate.startOf('day'), targetDate.endOf('day'), '', 'UTC');
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Total_conversations', value: 1 },
                { title: 'Open_conversations', value: 0 },
                { title: 'On_Hold_conversations', value: 1 },
                { title: 'Total_messages', value: 14 },
                { title: 'Busiest_day', value: 'Thursday' },
                { title: 'Conversations_per_day', value: '1.00' },
                { title: 'Busiest_time', value: '7AM - 8AM' },
            ]);
        }));
        it('should return all values as 0 when there is no data in the provided period, but there is data in the previous and following days', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsBetweenDate: (date) => analytics(date),
                getOnHoldConversationsBetweenDate: () => 0,
            });
            // choosing this specific date since the day before and after are not empty
            const targetDate = moment_timezone_1.default.utc().set('month', 10).set('year', 2023).set('date', 13);
            const result = yield overview.Conversations(targetDate.startOf('day'), targetDate.endOf('day'), '', 'UTC');
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Total_conversations', value: 0 },
                { title: 'Open_conversations', value: 0 },
                { title: 'On_Hold_conversations', value: 0 },
                { title: 'Total_messages', value: 0 },
                { title: 'Busiest_day', value: '-' },
                { title: 'Conversations_per_day', value: '0.00' },
                { title: 'Busiest_time', value: '-' },
            ]);
        }));
    });
    describe('Productivity', () => {
        it('should return all values as 0 when theres no data', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsMetricsBetweenDate: () => ({
                    forEach: () => [],
                }),
            });
            const result = yield overview.Productivity((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), '', 'UTC', (v) => v, {});
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Avg_response_time', value: '00:00:00' },
                { title: 'Avg_first_response_time', value: '00:00:00' },
                { title: 'Avg_reaction_time', value: '00:00:00' },
            ]);
        }));
        it('should return all values as 0 when theres data but not on the period we pass', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsMetricsBetweenDate: (_, date) => analytics(date),
            });
            const result = yield overview.Productivity((0, moment_timezone_1.default)().set('month', 9), (0, moment_timezone_1.default)().set('month', 9), '', 'UTC', (v) => v, {});
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Avg_response_time', value: '00:00:00' },
                { title: 'Avg_first_response_time', value: '00:00:00' },
                { title: 'Avg_reaction_time', value: '00:00:00' },
            ]);
        }));
        it('should return the correct values when theres data on the period we pass', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsMetricsBetweenDate: (_, date) => analytics(date),
            });
            const result = yield overview.Productivity((0, moment_timezone_1.default)().set('month', 10).set('year', 2023).startOf('month'), (0, moment_timezone_1.default)().set('month', 10).set('year', 2023).endOf('month'), '', 'UTC');
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Avg_response_time', value: '00:00:07' },
                { title: 'Avg_first_response_time', value: '00:00:10' },
                { title: 'Avg_reaction_time', value: '00:00:49' },
            ]);
        }));
        it('should only return productivity metrics related to the provided period, and not consider previous or following days', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsMetricsBetweenDate: (_, date) => analytics(date),
            });
            // choosing this specific date since the day before and after are not empty
            const targetDate = (0, moment_timezone_1.default)().set('month', 10).set('year', 2023).set('date', 25);
            const result = yield overview.Productivity(targetDate.startOf('day'), targetDate.clone().endOf('day'), '', 'UTC');
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Avg_response_time', value: '00:00:01' },
                { title: 'Avg_first_response_time', value: '00:00:04' },
                { title: 'Avg_reaction_time', value: '00:02:03' },
            ]);
        }));
        it('should return all values as 0 when there is no data in the provided period, but there is data in the previous and following days', () => __awaiter(void 0, void 0, void 0, function* () {
            const overview = new OverviewData_1.OverviewData({
                getAnalyticsMetricsBetweenDate: (_, date) => analytics(date),
            });
            // choosing this specific date since the day before and after are not empty
            const targetDate = moment_timezone_1.default.utc().set('month', 10).set('year', 2023).set('date', 13);
            const result = yield overview.Productivity(targetDate.startOf('day'), targetDate.endOf('day'), '', 'UTC');
            (0, chai_1.expect)(result).to.be.deep.equal([
                { title: 'Avg_response_time', value: '00:00:00' },
                { title: 'Avg_first_response_time', value: '00:00:00' },
                { title: 'Avg_reaction_time', value: '00:00:00' },
            ]);
        }));
    });
});
