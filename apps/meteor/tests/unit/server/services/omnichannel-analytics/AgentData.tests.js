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
const chai_1 = require("chai");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sinon_1 = __importDefault(require("sinon"));
const AgentData_1 = require("../../../../../server/services/omnichannel-analytics/AgentData");
describe('AgentData Analytics', () => {
    describe('updateMap', () => {
        it('should update an empty map', () => {
            const map = new Map();
            const agentOverview = new AgentData_1.AgentOverviewData({});
            agentOverview.updateMap(map, 'test', 1);
            (0, chai_1.expect)(map.get('test')).to.be.equal(1);
        });
        it('should update an existing key on a map', () => {
            const map = new Map();
            map.set('test', 1);
            const agentOverview = new AgentData_1.AgentOverviewData({});
            agentOverview.updateMap(map, 'test', 2);
            (0, chai_1.expect)(map.get('test')).to.be.equal(3);
        });
    });
    describe('sortByValue', () => {
        it('should sort an array of objects by value key', () => {
            const agentOverview = new AgentData_1.AgentOverviewData({});
            const array = [{ value: '1' }, { value: '3' }, { value: '2' }];
            agentOverview.sortByValue(array);
            (0, chai_1.expect)(array).to.be.deep.equal([{ value: '1' }, { value: '2' }, { value: '3' }]);
        });
        it('should sort an array of objects by value key in inverse order when `inv` is true', () => {
            const agentOverview = new AgentData_1.AgentOverviewData({});
            const array = [{ value: '1' }, { value: '3' }, { value: '2' }];
            agentOverview.sortByValue(array, true);
            (0, chai_1.expect)(array).to.be.deep.equal([{ value: '3' }, { value: '2' }, { value: '1' }]);
        });
    });
    describe('isActionAllowed', () => {
        it('should return true when action is valid', () => {
            const agentOverview = new AgentData_1.AgentOverviewData({});
            (0, chai_1.expect)(agentOverview.isActionAllowed('Total_conversations')).to.be.true;
        });
        it('should return false when action is invalid', () => {
            const agentOverview = new AgentData_1.AgentOverviewData({});
            (0, chai_1.expect)(agentOverview.isActionAllowed('invalid')).to.be.false;
        });
        it('should return false when action is undefined', () => {
            const agentOverview = new AgentData_1.AgentOverviewData({});
            (0, chai_1.expect)(agentOverview.isActionAllowed(undefined)).to.be.false;
        });
    });
    describe('callAction', () => {
        it('should throw an error when action is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const agentOverview = new AgentData_1.AgentOverviewData({});
            try {
                // @ts-expect-error - test
                // eslint-disable-next-line prettier/prettier, no-return-await
                yield agentOverview.callAction('invalid', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            }
            catch (e) {
                (0, chai_1.expect)(e).to.be.instanceOf(Error);
            }
        }));
        it('should call a valid action', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockModel = {
                getAnalyticsMetricsBetweenDateWithMessages: () => [],
                getAnalyticsMetricsBetweenDate: () => [],
            };
            const agentOverview = new AgentData_1.AgentOverviewData(mockModel);
            const spy = sinon_1.default.spy(agentOverview, 'Total_conversations');
            const spy2 = sinon_1.default.spy(agentOverview, 'Total_messages');
            const spy3 = sinon_1.default.spy(agentOverview, 'Avg_chat_duration');
            const spy4 = sinon_1.default.spy(agentOverview, 'Avg_first_response_time');
            const spy5 = sinon_1.default.spy(agentOverview, 'Best_first_response_time');
            const spy6 = sinon_1.default.spy(agentOverview, 'Avg_reaction_time');
            const spy7 = sinon_1.default.spy(agentOverview, 'Avg_response_time');
            yield agentOverview.callAction('Total_conversations', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy.calledOnce).to.be.true;
            yield agentOverview.callAction('Total_messages', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy2.calledOnce).to.be.true;
            yield agentOverview.callAction('Avg_chat_duration', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy3.calledOnce).to.be.true;
            yield agentOverview.callAction('Avg_first_response_time', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy4.calledOnce).to.be.true;
            yield agentOverview.callAction('Best_first_response_time', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy5.calledOnce).to.be.true;
            yield agentOverview.callAction('Avg_reaction_time', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy6.calledOnce).to.be.true;
            yield agentOverview.callAction('Avg_response_time', (0, moment_timezone_1.default)(), (0, moment_timezone_1.default)());
            (0, chai_1.expect)(spy7.calledOnce).to.be.true;
        }));
    });
    describe('Total_Conversations', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: '%_of_conversations' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '100.00%',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: '%_of_conversations' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data with multiple agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '50.00%',
                    },
                    {
                        name: 'agent 2',
                        value: '50.00%',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: '%_of_conversations' },
                ],
            });
        }));
        it('should properly calculate when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '66.67%',
                    },
                    {
                        name: 'agent 2',
                        value: '33.33%',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: '%_of_conversations' },
                ],
            });
        }));
        it('should ignore conversations that are not served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: undefined,
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_conversations((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: '%_of_conversations' },
                ],
            });
        }));
    });
    describe('Avg_chat_duration', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_chat_duration((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_chat_duration' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                chatDuration: 100,
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_chat_duration((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '00:01:40',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_chat_duration' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data with multiple agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                chatDuration: 100,
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                chatDuration: 200,
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_chat_duration((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '00:01:40',
                    },
                    {
                        name: 'agent 2',
                        value: '00:03:20',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_chat_duration' },
                ],
            });
        }));
        it('should properly calculate when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                chatDuration: 100,
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                chatDuration: 200,
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                chatDuration: 200,
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_chat_duration((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '00:02:30',
                    },
                    {
                        name: 'agent 2',
                        value: '00:03:20',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_chat_duration' },
                ],
            });
        }));
        it('should ignore conversations not being served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            metrics: {
                                chatDuration: 100,
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_chat_duration((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_chat_duration' },
                ],
            });
        }));
        it('should ignore conversations with no metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: undefined,
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {},
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_chat_duration((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_chat_duration' },
                ],
            });
        }));
    });
    describe('Total_messages', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_messages((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Total_messages' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            msgs: 10,
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_messages((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: 10,
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Total_messages' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data with multiple agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            msgs: 10,
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            msgs: 20,
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_messages((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 2',
                        value: 20,
                    },
                    {
                        name: 'agent 1',
                        value: 10,
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Total_messages' },
                ],
            });
        }));
        it('should properly calculate when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            msgs: 10,
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            msgs: 20,
                        },
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            msgs: 20,
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_messages((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: 30,
                    },
                    {
                        name: 'agent 2',
                        value: 20,
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Total_messages' },
                ],
            });
        }));
        it('should ignore conversations that are not served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDateWithMessages(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            msgs: 10,
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            msgs: 20,
                        },
                        {
                            servedBy: undefined,
                            msgs: 20,
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Total_messages((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 2',
                        value: 20,
                    },
                    {
                        name: 'agent 1',
                        value: 10,
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Total_messages' },
                ],
            });
        }));
    });
    describe('Avg_first_response_time', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_first_response_time' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 100,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '00:01:40',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_first_response_time' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data with multiple agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 100,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                response: {
                                    ft: 200,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '00:01:40',
                    },
                    {
                        name: 'agent 2',
                        value: '00:03:20',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_first_response_time' },
                ],
            });
        }));
        it('should calculate correctly when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 100,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                response: {
                                    ft: 200,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 200,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    {
                        name: 'agent 1',
                        value: '00:02:30',
                    },
                    {
                        name: 'agent 2',
                        value: '00:03:20',
                    },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_first_response_time' },
                ],
            });
        }));
        it('should ignore conversations not being served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: undefined,
                            metrics: {
                                response: {
                                    ft: 100,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_first_response_time' },
                ],
            });
        }));
        it('should ignore conversations with no metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: undefined,
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Avg_first_response_time' },
                ],
            });
        }));
    });
    describe('Best_first_response_time', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Best_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Best_first_response_time' },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 100,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                response: {
                                    ft: 200,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 3',
                            },
                            metrics: {
                                response: {
                                    ft: 50,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 4',
                            },
                            metrics: {
                                response: {
                                    ft: 150,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 5',
                            },
                            metrics: {
                                response: {
                                    ft: 250,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 6',
                            },
                            metrics: {
                                response: {
                                    ft: 300,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Best_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    { name: 'agent 1', value: '00:01:40' },
                    { name: 'agent 2', value: '00:03:20' },
                    { name: 'agent 3', value: '00:00:50' },
                    { name: 'agent 4', value: '00:02:30' },
                    { name: 'agent 5', value: '00:04:10' },
                    { name: 'agent 6', value: '00:05:00' },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Best_first_response_time' },
                ],
            });
        }));
        it('should properly calculate when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 100,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                response: {
                                    ft: 200,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 3',
                            },
                            metrics: {
                                response: {
                                    ft: 50,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 4',
                            },
                            metrics: {
                                response: {
                                    ft: 150,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 5',
                            },
                            metrics: {
                                response: {
                                    ft: 250,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 6',
                            },
                            metrics: {
                                response: {
                                    ft: 300,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    ft: 200,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Best_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    { name: 'agent 1', value: '00:01:40' },
                    { name: 'agent 2', value: '00:03:20' },
                    { name: 'agent 3', value: '00:00:50' },
                    { name: 'agent 4', value: '00:02:30' },
                    { name: 'agent 5', value: '00:04:10' },
                    { name: 'agent 6', value: '00:05:00' },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Best_first_response_time' },
                ],
            });
        }));
        it('should ignore conversations not being served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [{ servedBy: undefined, metrics: { response: { ft: 100 } } }];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Best_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Best_first_response_time' },
                ],
            });
        }));
        it('should ignore conversations with no metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [{ servedBy: { username: 'agent 1' }, metrics: undefined }];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Best_first_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    { name: 'Best_first_response_time' },
                ],
            });
        }));
    });
    describe('Avg_response_time', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    avg: 100,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [{ name: 'agent 1', value: '00:01:40' }],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data with multiple agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    avg: 100,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                response: {
                                    avg: 200,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    { name: 'agent 1', value: '00:01:40' },
                    { name: 'agent 2', value: '00:03:20' },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
            });
        }));
        it('should calculate correctly when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    avg: 100,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 2',
                            },
                            metrics: {
                                response: {
                                    avg: 200,
                                },
                            },
                        },
                        {
                            servedBy: {
                                username: 'agent 1',
                            },
                            metrics: {
                                response: {
                                    avg: 200,
                                },
                            },
                        },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    { name: 'agent 1', value: '00:02:30' },
                    { name: 'agent 2', value: '00:03:20' },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
            });
        }));
        it('should ignore conversations not being served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [{ servedBy: undefined, metrics: { response: { avg: 100 } } }];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
            });
        }));
        it('should ignore conversations with no metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [
                        { servedBy: { username: 'agent 1' }, metrics: undefined },
                        { servedBy: { username: 'agent 2' }, metrics: {} },
                    ];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_response_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_response_time',
                    },
                ],
            });
        }));
    });
    describe('Avg_reaction_time', () => {
        it('should return an ConversationData object with empty data when model call returns empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_reaction_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    return [{ servedBy: { username: 'agent 1' }, metrics: { reaction: { ft: 100 } } }];
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_reaction_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [{ name: 'agent 1', value: '00:01:40' }],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
            });
        }));
        it('should return an ConversationData object with data when model call returns data with multiple agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    const data = [
                        { servedBy: { username: 'agent 1' }, metrics: { reaction: { ft: 100 } } },
                        { servedBy: { username: 'agent 2' }, metrics: { reaction: { ft: 200 } } },
                    ];
                    return data;
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_reaction_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    { name: 'agent 1', value: '00:01:40' },
                    { name: 'agent 2', value: '00:03:20' },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
            });
        }));
        it('should calculate correctly when agents have multiple conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    const data = [
                        { servedBy: { username: 'agent 1' }, metrics: { reaction: { ft: 100 } } },
                        { servedBy: { username: 'agent 2' }, metrics: { reaction: { ft: 200 } } },
                        { servedBy: { username: 'agent 1' }, metrics: { reaction: { ft: 200 } } },
                    ];
                    return data;
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_reaction_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [
                    { name: 'agent 1', value: '00:02:30' },
                    { name: 'agent 2', value: '00:03:20' },
                ],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
            });
        }));
        it('should ignore conversations not being served by any agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    const data = [{ servedBy: undefined, metrics: { reaction: { ft: 100 } } }];
                    return data;
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_reaction_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
            });
        }));
        it('should ignore conversations with no metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            const modelMock = {
                getAnalyticsMetricsBetweenDate(_params) {
                    const data = [
                        { servedBy: { username: 'agent 1' }, metrics: undefined },
                        { servedBy: { username: 'agent 2' }, metrics: {} },
                    ];
                    return data;
                },
            };
            const agentOverview = new AgentData_1.AgentOverviewData(modelMock);
            const result = yield agentOverview.Avg_reaction_time((0, moment_timezone_1.default)(), (0, moment_timezone_1.default)(), 'departmentId');
            (0, chai_1.expect)(result).to.be.deep.equal({
                data: [],
                head: [
                    {
                        name: 'Agent',
                    },
                    {
                        name: 'Avg_reaction_time',
                    },
                ],
            });
        }));
    });
});
