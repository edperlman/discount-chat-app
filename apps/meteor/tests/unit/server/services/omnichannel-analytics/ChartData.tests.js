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
const sinon_1 = __importDefault(require("sinon"));
const ChartData_1 = require("../../../../../server/services/omnichannel-analytics/ChartData");
describe('ChartData Analytics', () => {
    describe('isActionAllowed', () => {
        it('should return false if no action is provided', () => {
            const chart = new ChartData_1.ChartData({});
            (0, chai_1.expect)(chart.isActionAllowed(undefined)).to.be.false;
        });
        it('should return false if an invalid action is provided', () => {
            const chart = new ChartData_1.ChartData({});
            (0, chai_1.expect)(chart.isActionAllowed('invalid_action')).to.be.false;
        });
        it('should return true if a valid action is provided', () => {
            const chart = new ChartData_1.ChartData({});
            (0, chai_1.expect)(chart.isActionAllowed('Total_conversations')).to.be.true;
        });
    });
    describe('callAction', () => {
        it('should call the correct action', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDateWithMessages: () => [],
                getAnalyticsMetricsBetweenDate: () => [],
                getTotalConversationsBetweenDate: () => 0,
            });
            (0, chai_1.expect)(yield chart.callAction('Total_conversations', {})).to.be.equal(0);
        }));
        it('should throw an error if the action is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({});
            try {
                // @ts-expect-error - Invalid action
                yield chart.callAction('invalid_action', {});
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Invalid action');
            }
        }));
        it('should call the correct action with the correct parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDateWithMessages: () => [],
                getAnalyticsMetricsBetweenDate: () => [],
                getTotalConversationsBetweenDate: () => 0,
            });
            const spy = sinon_1.default.spy(chart, 'Total_conversations');
            const spy2 = sinon_1.default.spy(chart, 'Avg_chat_duration');
            const spy3 = sinon_1.default.spy(chart, 'Total_messages');
            const spy4 = sinon_1.default.spy(chart, 'Avg_first_response_time');
            const spy5 = sinon_1.default.spy(chart, 'Avg_reaction_time');
            yield chart.callAction('Total_conversations', {});
            (0, chai_1.expect)(spy.calledOnce).to.be.true;
            yield chart.callAction('Avg_chat_duration', {});
            (0, chai_1.expect)(spy2.calledOnce).to.be.true;
            yield chart.callAction('Total_messages', {});
            (0, chai_1.expect)(spy3.calledOnce).to.be.true;
            yield chart.callAction('Avg_first_response_time', {});
            (0, chai_1.expect)(spy4.calledOnce).to.be.true;
            yield chart.callAction('Avg_reaction_time', {});
            (0, chai_1.expect)(spy5.calledOnce).to.be.true;
        }));
    });
    describe('Total_conversations', () => {
        it('should return the total number of conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getTotalConversationsBetweenDate: () => __awaiter(void 0, void 0, void 0, function* () { return 10; }),
            });
            (0, chai_1.expect)(yield chart.Total_conversations({})).to.be.equal(10);
        }));
    });
    describe('Avg_chat_duration', () => {
        it('should return the average chat duration', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { chatDuration: 10 } }],
            });
            (0, chai_1.expect)(yield chart.Avg_chat_duration({})).to.be.equal(10);
        }));
        it('should properly calculate with more conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { chatDuration: 10 } }, { metrics: { chatDuration: 20 } }],
            });
            (0, chai_1.expect)(yield chart.Avg_chat_duration({})).to.be.equal(15);
        }));
        it('should return 0 if no conversations are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [],
            });
            (0, chai_1.expect)(yield chart.Avg_chat_duration({})).to.be.equal(0);
        }));
        it('should ignore conversations without chatDuration', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { chatDuration: 10 } }, { metrics: {} }],
            });
            (0, chai_1.expect)(yield chart.Avg_chat_duration({})).to.be.equal(10);
        }));
    });
    describe('Total_messages', () => {
        it('should return the total number of messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDateWithMessages: () => [{ msgs: 10 }],
            });
            (0, chai_1.expect)(yield chart.Total_messages({})).to.be.equal(10);
        }));
        it('should properly calculate with more conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDateWithMessages: () => [{ msgs: 10 }, { msgs: 20 }],
            });
            (0, chai_1.expect)(yield chart.Total_messages({})).to.be.equal(30);
        }));
        it('should return 0 if no conversations are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDateWithMessages: () => [],
            });
            (0, chai_1.expect)(yield chart.Total_messages({})).to.be.equal(0);
        }));
        it('should ignore conversations without msgs', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDateWithMessages: () => [{ msgs: 10 }, {}],
            });
            (0, chai_1.expect)(yield chart.Total_messages({})).to.be.equal(10);
        }));
    });
    describe('Avg_first_response_time', () => {
        it('should return the average first response time', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { ft: 10 } } }],
            });
            (0, chai_1.expect)(yield chart.Avg_first_response_time({})).to.be.equal(10);
        }));
        it('should properly calculate with more conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { ft: 10 } } }, { metrics: { response: { ft: 20 } } }],
            });
            (0, chai_1.expect)(yield chart.Avg_first_response_time({})).to.be.equal(15);
        }));
        it('should return 0 if no conversations are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [],
            });
            (0, chai_1.expect)(yield chart.Avg_first_response_time({})).to.be.equal(0);
        }));
        it('should ignore conversations without response', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { ft: 10 } } }, { metrics: {} }],
            });
            (0, chai_1.expect)(yield chart.Avg_first_response_time({})).to.be.equal(10);
        }));
    });
    describe('Best_first_response_time', () => {
        it('should return the best first response time', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { ft: 10 } } }],
            });
            (0, chai_1.expect)(yield chart.Best_first_response_time({})).to.be.equal(10);
        }));
        it('should properly calculate with more conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { ft: 10 } } }, { metrics: { response: { ft: 20 } } }],
            });
            (0, chai_1.expect)(yield chart.Best_first_response_time({})).to.be.equal(10);
        }));
        it('should return 0 if no conversations are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [],
            });
            (0, chai_1.expect)(yield chart.Best_first_response_time({})).to.be.equal(0);
        }));
        it('should ignore conversations without response', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { ft: 10 } } }, { metrics: {} }],
            });
            (0, chai_1.expect)(yield chart.Best_first_response_time({})).to.be.equal(10);
        }));
    });
    describe('Avg_response_time', () => {
        it('should return the average response time', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { avg: 10 } } }],
            });
            (0, chai_1.expect)(yield chart.Avg_response_time({})).to.be.equal(10);
        }));
        it('should properly calculate with more conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { avg: 10 } } }, { metrics: { response: { avg: 20 } } }],
            });
            (0, chai_1.expect)(yield chart.Avg_response_time({})).to.be.equal(15);
        }));
        it('should return 0 if no conversations are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [],
            });
            (0, chai_1.expect)(yield chart.Avg_response_time({})).to.be.equal(0);
        }));
        it('should ignore conversations without response', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { response: { avg: 10 } } }, { metrics: {} }],
            });
            (0, chai_1.expect)(yield chart.Avg_response_time({})).to.be.equal(10);
        }));
    });
    describe('Avg_reaction_time', () => {
        it('should return the average reaction time', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { reaction: { ft: 10 } } }],
            });
            (0, chai_1.expect)(yield chart.Avg_reaction_time({})).to.be.equal(10);
        }));
        it('should properly calculate with more conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { reaction: { ft: 10 } } }, { metrics: { reaction: { ft: 20 } } }],
            });
            (0, chai_1.expect)(yield chart.Avg_reaction_time({})).to.be.equal(15);
        }));
        it('should return 0 if no conversations are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [],
            });
            (0, chai_1.expect)(yield chart.Avg_reaction_time({})).to.be.equal(0);
        }));
        it('should ignore conversations without reaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const chart = new ChartData_1.ChartData({
                getAnalyticsMetricsBetweenDate: () => [{ metrics: { reaction: { ft: 10 } } }, { metrics: {} }],
            });
            (0, chai_1.expect)(yield chart.Avg_reaction_time({})).to.be.equal(10);
        }));
    });
});
