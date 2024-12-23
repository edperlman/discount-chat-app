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
const faker_1 = require("@faker-js/faker");
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const moment_1 = __importDefault(require("moment"));
const api_data_1 = require("../../../data/api-data");
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const utils_1 = require("../../../data/livechat/utils");
const permissions_helper_1 = require("../../../data/permissions.helper");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - dashboards', function () {
    // This test is expected to take more time since we're simulating real time conversations to verify analytics
    this.timeout(60000);
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
    }));
    let department;
    const agents = [];
    let avgClosedRoomChatDuration = 0;
    const inactivityTimeout = 3;
    const TOTAL_MESSAGES = {
        min: 5,
        max: 10,
    };
    const DELAY_BETWEEN_MESSAGES = {
        min: 1000,
        max: (inactivityTimeout - 1) * 1000,
    };
    const TOTAL_ROOMS = 7;
    const simulateRealtimeConversation = (chatInfo) => __awaiter(this, void 0, void 0, function* () {
        const promises = chatInfo.map((info) => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const { room, visitor } = info;
            // send a few messages
            const numberOfMessages = random_1.Random.between(TOTAL_MESSAGES.min, TOTAL_MESSAGES.max);
            try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (var _d = true, _e = __asyncValues(Array(numberOfMessages - 1).keys()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const _ = _c;
                    // flip a coin to decide who will send the message
                    const willSendFromAgent = random_1.Random.between(0, 1) === 1;
                    if (willSendFromAgent) {
                        yield (0, rooms_1.sendAgentMessage)(room._id);
                    }
                    else {
                        yield (0, rooms_1.sendMessage)(room._id, faker_1.faker.lorem.sentence(), visitor.token);
                    }
                    const delay = random_1.Random.between(DELAY_BETWEEN_MESSAGES.min, DELAY_BETWEEN_MESSAGES.max);
                    yield (0, utils_1.sleep)(delay);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Last message is always from visitor so that the chat doesn't get abandoned due to
            // "Livechat_visitor_inactivity_timeout" setting
            yield (0, rooms_1.sendMessage)(room._id, faker_1.faker.lorem.sentence(), visitor.token);
        }));
        yield Promise.all(promises);
    });
    (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
        if (!constants_1.IS_EE) {
            return;
        }
        yield (0, permissions_helper_1.updateSetting)('Livechat_visitor_inactivity_timeout', inactivityTimeout);
        yield (0, permissions_helper_1.updateSetting)('Livechat_enable_business_hours', false);
        // create dummy test data for further tests
        const { department: createdDept, agent: agent1 } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
        department = createdDept;
        const agent2 = yield (0, users_1.createAnOnlineAgent)();
        yield (0, department_1.addOrRemoveAgentFromDepartment)(department._id, { agentId: agent2.user._id, username: agent2.user.username }, true);
        agents.push(agent1);
        agents.push(agent2);
        const roomCreationStart = (0, moment_1.default)();
        // start a few chats
        const promises = Array.from(Array(TOTAL_ROOMS).keys()).map((i) => {
            // 2 rooms by agent 1
            if (i < 2) {
                return (0, rooms_1.startANewLivechatRoomAndTakeIt)({ departmentId: department._id, agent: agent1.credentials });
            }
            return (0, rooms_1.startANewLivechatRoomAndTakeIt)({ departmentId: department._id, agent: agent2.credentials });
        });
        const results = yield Promise.all(promises);
        const chatInfo = results.map((result) => ({ room: result.room, visitor: result.visitor }));
        // simulate messages being exchanged between agents and visitors
        yield simulateRealtimeConversation(chatInfo);
        // put a chat on hold
        yield (0, rooms_1.sendAgentMessage)(chatInfo[1].room._id);
        yield (0, rooms_1.placeRoomOnHold)(chatInfo[1].room._id);
        // close a chat
        yield (0, rooms_1.closeOmnichannelRoom)(chatInfo[4].room._id);
        const room5ChatDuration = (0, moment_1.default)().diff(roomCreationStart, 'seconds');
        // close an abandoned chat
        yield (0, rooms_1.sendAgentMessage)(chatInfo[5].room._id);
        yield (0, utils_1.sleep)(inactivityTimeout * 1000); // wait for the chat to be considered abandoned
        yield (0, rooms_1.closeOmnichannelRoom)(chatInfo[5].room._id);
        const room6ChatDuration = (0, moment_1.default)().diff(roomCreationStart, 'seconds');
        avgClosedRoomChatDuration = (room5ChatDuration + room6ChatDuration) / 2;
    }));
    (0, mocha_1.describe)('livechat/analytics/dashboards/conversation-totalizers', () => {
        const expectedMetrics = [
            'Total_conversations',
            'Open_conversations',
            'On_Hold_conversations',
            'Total_messages',
            'Busiest_time',
            'Total_abandoned_chats',
            'Total_visitors',
        ];
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversation-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an array of conversation totalizers', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversation-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.totalizers).to.be.an('array');
                res.body.totalizers.forEach((prop) => (0, chai_1.expect)(expectedMetrics.includes(prop.title)).to.be.true);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversation-totalizers'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('totalizers');
            (0, chai_1.expect)(result.body.totalizers).to.be.an('array');
            (0, chai_1.expect)(result.body.totalizers).to.have.lengthOf(5);
            const expectedResult = [
                { title: 'Total_conversations', value: 7 },
                { title: 'Open_conversations', value: 4 },
                { title: 'On_Hold_conversations', value: 1 },
                // { title: 'Total_messages', value: 60 },
                { title: 'Total_visitors', value: 7 },
            ];
            expectedResult.forEach((expected) => {
                const resultItem = result.body.totalizers.find((item) => item.title === expected.title);
                (0, chai_1.expect)(resultItem).to.not.be.undefined;
                (0, chai_1.expect)(resultItem).to.have.property('value', expected.value);
            });
            const minMessages = TOTAL_MESSAGES.min * TOTAL_ROOMS;
            const totalMessages = result.body.totalizers.find((item) => item.title === 'Total_messages');
            (0, chai_1.expect)(totalMessages).to.not.be.undefined;
            const totalMessagesValue = parseInt(totalMessages.value);
            (0, chai_1.expect)(totalMessagesValue).to.be.greaterThanOrEqual(minMessages);
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/productivity-totalizers', () => {
        const expectedMetrics = ['Avg_response_time', 'Avg_first_response_time', 'Avg_reaction_time', 'Avg_of_waiting_time'];
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/productivity-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an array of productivity totalizers', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/productivity-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.totalizers).to.be.an('array');
                res.body.totalizers.forEach((prop) => (0, chai_1.expect)(expectedMetrics.includes(prop.title)).to.be.true);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/productivity-totalizers'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            // const expected = [
            // 	// There's a bug in the code for calculation of these 3 values.
            // 	// Due to which it always return 0
            // 	{ title: 'Avg_response_time', value: '00:00:00' },
            // 	{ title: 'Avg_first_response_time', value: '00:00:00' },
            // 	{ title: 'Avg_reaction_time', value: '00:00:00' },
            // 	{ title: 'Avg_of_waiting_time', value: '00:00:03' }, // approx 3, 5 delta
            // ];
            const avgWaitingTime = result.body.totalizers.find((item) => item.title === 'Avg_of_waiting_time');
            (0, chai_1.expect)(avgWaitingTime).to.not.be.undefined;
            /* const avgWaitingTimeValue = moment.duration(avgWaitingTime.value).asSeconds();
            expect(avgWaitingTimeValue).to.be.closeTo(DELAY_BETWEEN_MESSAGES.max / 1000, 5); */
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/chats-totalizers', () => {
        const expectedMetrics = ['Total_abandoned_chats', 'Avg_of_abandoned_chats', 'Avg_of_chat_duration_time'];
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/chats-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an array of chats totalizers', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/chats-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.totalizers).to.be.an('array');
                res.body.totalizers.forEach((prop) => (0, chai_1.expect)(expectedMetrics.includes(prop.title)).to.be.true);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/chats-totalizers'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const expected = [
                { title: 'Total_abandoned_chats', value: 1 },
                { title: 'Avg_of_abandoned_chats', value: '14%' },
                // { title: 'Avg_of_chat_duration_time', value: '00:00:01' },
            ];
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('totalizers');
            (0, chai_1.expect)(result.body.totalizers).to.be.an('array');
            expected.forEach((expected) => {
                const resultItem = result.body.totalizers.find((item) => item.title === expected.title);
                (0, chai_1.expect)(resultItem).to.not.be.undefined;
                (0, chai_1.expect)(resultItem).to.have.property('value', expected.value);
            });
            const resultAverageChatDuration = result.body.totalizers.find((item) => item.title === 'Avg_of_chat_duration_time');
            (0, chai_1.expect)(resultAverageChatDuration).to.not.be.undefined;
            const resultAverageChatDurationValue = moment_1.default.duration(resultAverageChatDuration.value).asSeconds();
            (0, chai_1.expect)(resultAverageChatDurationValue).to.be.closeTo(avgClosedRoomChatDuration, 5); // Keep a margin of 3 seconds
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/agents-productivity-totalizers', () => {
        const expectedMetrics = ['Busiest_time', 'Avg_of_available_service_time', 'Avg_of_service_time'];
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/agents-productivity-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an array of agents productivity totalizers', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/agents-productivity-totalizers'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.totalizers).to.be.an('array');
                res.body.totalizers.forEach((prop) => (0, chai_1.expect)(expectedMetrics.includes(prop.title)).to.be.true);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/agents-productivity-totalizers'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            // [
            //     { title: 'Busiest_time', value: '- -' },
            //     { title: 'Avg_of_available_service_time', value: '00:00:00' },
            //     { title: 'Avg_of_service_time', value: '00:00:16' } approx 17, 6 delta
            //   ],
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('totalizers');
            (0, chai_1.expect)(result.body.totalizers).to.be.an('array');
            const avgServiceTime = result.body.totalizers.find((item) => item.title === 'Avg_of_service_time');
            (0, chai_1.expect)(avgServiceTime).to.not.be.undefined;
            const avgServiceTimeValue = moment_1.default.duration(avgServiceTime.value).asSeconds();
            const minChatDuration = (DELAY_BETWEEN_MESSAGES.min * TOTAL_MESSAGES.min) / 1000;
            const maxChatDuration = (DELAY_BETWEEN_MESSAGES.max * TOTAL_MESSAGES.max) / 1000;
            (0, chai_1.expect)(avgServiceTimeValue).to.be.closeTo((minChatDuration + maxChatDuration) / 2, 10);
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/charts/chats', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an array of productivity totalizers', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('open');
                (0, chai_1.expect)(res.body).to.have.property('closed');
                (0, chai_1.expect)(res.body).to.have.property('queued');
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const expected = {
                open: 4,
                closed: 2,
                queued: 0,
                onhold: 1,
            };
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            Object.entries(expected).forEach(([key, value]) => {
                (0, chai_1.expect)(result.body).to.have.property(key, value);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/charts/chats-per-agent', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats-per-agent'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an object with open and closed chats by agent', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats-per-agent'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats-per-agent'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const expected = {
                agent0: { open: 1, closed: 0, onhold: 1 },
                agent1: { open: 3, closed: 2 },
            };
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            const agent0 = result.body[agents[0].user.username];
            const agent1 = result.body[agents[1].user.username];
            Object.entries(expected.agent0).forEach(([key, value]) => {
                (0, chai_1.expect)(agent0).to.have.property(key, value);
            });
            Object.entries(expected.agent1).forEach(([key, value]) => {
                (0, chai_1.expect)(agent1).to.have.property(key, value);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/charts/agents-status', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/agents-status'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an object with agents status metrics', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/agents-status'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offline');
                (0, chai_1.expect)(res.body).to.have.property('away');
                (0, chai_1.expect)(res.body).to.have.property('busy');
                (0, chai_1.expect)(res.body).to.have.property('available');
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/agents-status'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            // TODO: We can improve tests further by creating some agents with different status
            const expected = {
                offline: 0,
                away: 0,
                busy: 0,
                available: 2,
            };
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            Object.entries(expected).forEach(([key, value]) => {
                (0, chai_1.expect)(result.body).to.have.property(key, value);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/charts/chats-per-department', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats-per-department'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an object with open and closed chats by department', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats-per-department'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/chats-per-department'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            const expected = {
                department0: { open: 5, closed: 2 },
            };
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            const department0 = result.body[department.name];
            Object.entries(expected.department0).forEach(([key, value]) => {
                (0, chai_1.expect)(department0).to.have.property(key, value);
            });
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/charts/timings', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/timings'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an object with open and closed chats by department', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/timings'))
                .query({
                start: '2019-10-25T15:08:17.248Z',
                end: '2019-12-08T15:08:17.248Z',
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('response');
                (0, chai_1.expect)(res.body).to.have.property('reaction');
                (0, chai_1.expect)(res.body).to.have.property('chatDuration');
                (0, chai_1.expect)(res.body.response).to.have.property('avg');
                (0, chai_1.expect)(res.body.response).to.have.property('longest');
                (0, chai_1.expect)(res.body.reaction).to.have.property('avg');
                (0, chai_1.expect)(res.body.reaction).to.have.property('longest');
                (0, chai_1.expect)(res.body.chatDuration).to.have.property('avg');
                (0, chai_1.expect)(res.body.chatDuration).to.have.property('longest');
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const start = (0, moment_1.default)().subtract(1, 'days').toISOString();
            const end = (0, moment_1.default)().toISOString();
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/charts/timings'))
                .query({ start, end, departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            // const expected = {
            // 	response: { avg: 0, longest: 0.207 }, // avg between delayBetweenMessage.min and delayBetweenMessage.max
            // 	reaction: { avg: 0, longest: 0.221 }, // avg between delayBetweenMessage.min and delayBetweenMessage.max
            // 	chatDuration: { avg: 0, longest: 0.18 }, // avg should be about avgClosedRoomChatDuration, and longest should be greater than avgClosedRoomChatDuration and within delta of 20
            // 	success: true,
            // };
            const maxChatDuration = (DELAY_BETWEEN_MESSAGES.max * TOTAL_MESSAGES.max) / 1000;
            const responseValues = result.body.response;
            (0, chai_1.expect)(responseValues).to.have.property('avg');
            (0, chai_1.expect)(responseValues).to.have.property('longest');
            (0, chai_1.expect)(responseValues.avg).to.be.closeTo((DELAY_BETWEEN_MESSAGES.min + DELAY_BETWEEN_MESSAGES.max) / 2000, 5);
            (0, chai_1.expect)(responseValues.longest).to.be.lessThan(maxChatDuration);
            const reactionValues = result.body.reaction;
            (0, chai_1.expect)(reactionValues).to.have.property('avg');
            (0, chai_1.expect)(reactionValues).to.have.property('longest');
            (0, chai_1.expect)(reactionValues.avg).to.be.closeTo((DELAY_BETWEEN_MESSAGES.min + DELAY_BETWEEN_MESSAGES.max) / 2000, 5);
            (0, chai_1.expect)(reactionValues.longest).to.be.lessThan(maxChatDuration);
            const chatDurationValues = result.body.chatDuration;
            (0, chai_1.expect)(chatDurationValues).to.have.property('avg');
            (0, chai_1.expect)(chatDurationValues).to.have.property('longest');
            (0, chai_1.expect)(chatDurationValues.avg).to.be.closeTo(avgClosedRoomChatDuration, 5);
            (0, chai_1.expect)(chatDurationValues.longest).to.be.greaterThan(avgClosedRoomChatDuration);
            (0, chai_1.expect)(chatDurationValues.longest).to.be.lessThan(avgClosedRoomChatDuration + 20);
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/agent-overview', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: 'Total_conversations' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an "invalid-chart-name error" when the chart name is empty', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: '' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return empty when chart name is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: 'invalid-chart-name' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(Object.keys(res.body)).to.have.lengthOf(1);
            });
        }));
        (0, mocha_1.it)('should return an array of agent overview data', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: 'Total_conversations' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.head).to.be.an('array');
            (0, chai_1.expect)(result.body.data).to.be.an('array');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return agent overview data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: today, name: 'Total_conversations', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array');
            (0, chai_1.expect)(result.body.data).to.have.lengthOf(2);
            const user1Data = result.body.data.find((data) => data.name === agents[0].user.username);
            const user2Data = result.body.data.find((data) => data.name === agents[1].user.username);
            (0, chai_1.expect)(user1Data).to.not.be.undefined;
            (0, chai_1.expect)(user2Data).to.not.be.undefined;
            (0, chai_1.expect)(user1Data).to.have.property('value', '28.57%');
            (0, chai_1.expect)(user2Data).to.have.property('value', '71.43%');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for total conversations', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Total_conversations', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', '%_of_conversations');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for average chat durations', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Avg_chat_duration', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', 'Avg_chat_duration');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for total messages', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Total_messages', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', 'Total_messages');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for average first response times', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Avg_first_response_time', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', 'Avg_first_response_time');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for best first response times', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Best_first_response_time', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', 'Best_first_response_time');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for average response times', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Avg_response_time', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', 'Avg_response_time');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only return results in the provided date interval when searching for average reaction times', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: yesterday, to: yesterday, name: 'Avg_reaction_time', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body.head).to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(result.body.head[0]).to.have.property('name', 'Agent');
            (0, chai_1.expect)(result.body.head[1]).to.have.property('name', 'Avg_reaction_time');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.empty;
        }));
    });
    (0, mocha_1.describe)('[livechat/analytics/agent-overview] - Average first response time', () => {
        let agent;
        let originalFirstResponseTimeInSeconds;
        let roomId;
        const firstDelayInSeconds = 4;
        const secondDelayInSeconds = 8;
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            agent = yield (0, users_1.createAnOnlineAgent)();
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(agent.user);
        }));
        (0, mocha_1.it)('should return no average response time for an agent if no response has been sent in the period', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: today, to: today, name: 'Avg_first_response_time' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array');
            (0, chai_1.expect)(result.body.data).to.not.deep.include({ name: agent.user.username });
        }));
        (0, mocha_1.it)("should not consider system messages in agents' first response time metric", () => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            roomId = response.room._id;
            yield (0, utils_1.sleep)(firstDelayInSeconds * 1000);
            yield (0, rooms_1.sendAgentMessage)(roomId, 'first response from agent', agent.credentials);
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: today, to: today, name: 'Avg_first_response_time' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array');
            const agentData = result.body.data.find((agentOverviewData) => agentOverviewData.name === agent.user.username);
            (0, chai_1.expect)(agentData).to.not.be.undefined;
            (0, chai_1.expect)(agentData).to.have.property('name', agent.user.username);
            (0, chai_1.expect)(agentData).to.have.property('value');
            originalFirstResponseTimeInSeconds = moment_1.default.duration(agentData.value).asSeconds();
            (0, chai_1.expect)(originalFirstResponseTimeInSeconds).to.be.greaterThanOrEqual(firstDelayInSeconds);
        }));
        (0, mocha_1.it)('should correctly calculate the average time of first responses for an agent', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            roomId = response.room._id;
            yield (0, utils_1.sleep)(secondDelayInSeconds * 1000);
            yield (0, rooms_1.sendAgentMessage)(roomId, 'first response from agent', agent.credentials);
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: today, to: today, name: 'Avg_first_response_time' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.not.empty;
            const agentData = result.body.data.find((agentOverviewData) => agentOverviewData.name === agent.user.username);
            (0, chai_1.expect)(agentData).to.not.be.undefined;
            (0, chai_1.expect)(agentData).to.have.property('name', agent.user.username);
            (0, chai_1.expect)(agentData).to.have.property('value');
            const averageFirstResponseTimeInSeconds = moment_1.default.duration(agentData.value).asSeconds();
            (0, chai_1.expect)(averageFirstResponseTimeInSeconds).to.be.greaterThan(originalFirstResponseTimeInSeconds);
            (0, chai_1.expect)(averageFirstResponseTimeInSeconds).to.be.greaterThanOrEqual((firstDelayInSeconds + secondDelayInSeconds) / 2);
            (0, chai_1.expect)(averageFirstResponseTimeInSeconds).to.be.lessThan(secondDelayInSeconds);
        }));
    });
    (0, mocha_1.describe)('[livechat/analytics/agent-overview] - Best first response time', () => {
        let agent;
        let originalBestFirstResponseTimeInSeconds;
        let roomId;
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            agent = yield (0, users_1.createAnOnlineAgent)();
        }));
        (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(agent.user));
        (0, mocha_1.it)('should return no best response time for an agent if no response has been sent in the period', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: today, to: today, name: 'Best_first_response_time' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array');
            (0, chai_1.expect)(result.body.data).to.not.deep.include({ name: agent.user.username });
        }));
        (0, mocha_1.it)("should not consider system messages in agents' best response time metric", () => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            roomId = response.room._id;
            const delayInSeconds = 4;
            yield (0, utils_1.sleep)(delayInSeconds * 1000);
            yield (0, rooms_1.sendAgentMessage)(roomId, 'first response from agent', agent.credentials);
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: today, to: today, name: 'Best_first_response_time' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array').that.is.not.empty;
            const agentData = result.body.data.find((agentOverviewData) => agentOverviewData.name === agent.user.username);
            (0, chai_1.expect)(agentData).to.not.be.undefined;
            (0, chai_1.expect)(agentData).to.have.property('name', agent.user.username);
            (0, chai_1.expect)(agentData).to.have.property('value');
            originalBestFirstResponseTimeInSeconds = moment_1.default.duration(agentData.value).asSeconds();
            (0, chai_1.expect)(originalBestFirstResponseTimeInSeconds).to.be.greaterThanOrEqual(delayInSeconds);
        }));
        (0, mocha_1.it)('should correctly calculate the best first response time for an agent and there are multiple first responses in the period', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: agent.credentials });
            roomId = response.room._id;
            const delayInSeconds = 6;
            yield (0, utils_1.sleep)(delayInSeconds * 1000);
            yield (0, rooms_1.sendAgentMessage)(roomId, 'first response from agent', agent.credentials);
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agent-overview'))
                .query({ from: today, to: today, name: 'Best_first_response_time' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.have.property('success', true);
            (0, chai_1.expect)(result.body).to.have.property('head');
            (0, chai_1.expect)(result.body).to.have.property('data');
            (0, chai_1.expect)(result.body.data).to.be.an('array');
            const agentData = result.body.data.find((agentOverviewData) => agentOverviewData.name === agent.user.username);
            (0, chai_1.expect)(agentData).to.not.be.undefined;
            (0, chai_1.expect)(agentData).to.have.property('name', agent.user.username);
            (0, chai_1.expect)(agentData).to.have.property('value');
            const bestFirstResponseTimeInSeconds = moment_1.default.duration(agentData.value).asSeconds();
            (0, chai_1.expect)(bestFirstResponseTimeInSeconds).to.be.equal(originalBestFirstResponseTimeInSeconds);
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/overview', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: 'Conversations' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an "invalid-chart-name error" when the chart name is empty', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: '' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return empty when chart name is invalid', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: 'invalid-chart-name' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(Object.keys(res.body)).to.have.lengthOf(1);
            });
        }));
        (0, mocha_1.it)('should return an array of analytics overview data', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: '2020-01-01', to: '2020-01-02', name: 'Conversations' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.be.an('array');
            (0, chai_1.expect)(result.body).to.have.lengthOf(7);
            (0, chai_1.expect)(result.body[0]).to.have.property('title', 'Total_conversations');
            (0, chai_1.expect)(result.body[0]).to.have.property('value', 0);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return analytics overview data with correct values', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const today = (0, moment_1.default)().startOf('day').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: yesterday, to: today, name: 'Conversations', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.be.an('array');
            const expectedResult = [
                { title: 'Total_conversations', value: 13 },
                { title: 'Open_conversations', value: 10 },
                { title: 'On_Hold_conversations', value: 1 },
                // { title: 'Total_messages', value: 6 },
                // { title: 'Busiest_day', value: moment().format('dddd') },
                { title: 'Conversations_per_day', value: '6.50' },
                // { title: 'Busiest_time', value: '' },
            ];
            expectedResult.forEach((expected) => {
                const resultItem = result.body.find((item) => item.title === expected.title);
                (0, chai_1.expect)(resultItem).to.not.be.undefined;
                (0, chai_1.expect)(resultItem).to.have.property('value', expected.value);
            });
            const minMessages = TOTAL_MESSAGES.min * TOTAL_ROOMS;
            const totalMessages = result.body.find((item) => item.title === 'Total_messages');
            (0, chai_1.expect)(totalMessages).to.not.be.undefined;
            const totalMessagesValue = parseInt(totalMessages.value);
            (0, chai_1.expect)(totalMessagesValue).to.be.greaterThanOrEqual(minMessages);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only consider conversations in the provided time range when returning analytics conversations overview data', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: yesterday, to: yesterday, name: 'Conversations', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.be.an('array');
            const expectedResult = [
                { title: 'Total_conversations', value: 0 },
                { title: 'Open_conversations', value: 0 },
                { title: 'On_Hold_conversations', value: 0 },
                { title: 'Conversations_per_day', value: '0.00' },
            ];
            expectedResult.forEach((expected) => {
                const resultItem = result.body.find((item) => item.title === expected.title);
                (0, chai_1.expect)(resultItem).to.not.be.undefined;
                (0, chai_1.expect)(resultItem).to.have.property('value', expected.value);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should only consider conversations in the provided time range when returning analytics productivity overview data', () => __awaiter(this, void 0, void 0, function* () {
            const yesterday = (0, moment_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
            const result = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/overview'))
                .query({ from: yesterday, to: yesterday, name: 'Productivity', departmentId: department._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(result.body).to.be.an('array');
            const expectedResult = [
                { title: 'Avg_response_time', value: '00:00:00' },
                { title: 'Avg_first_response_time', value: '00:00:00' },
                { title: 'Avg_reaction_time', value: '00:00:00' },
            ];
            expectedResult.forEach((expected) => {
                const resultItem = result.body.find((item) => item.title === expected.title);
                (0, chai_1.expect)(resultItem).to.not.be.undefined;
                (0, chai_1.expect)(resultItem).to.have.property('value', expected.value);
            });
        }));
    });
});
