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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const rooms_1 = require("../../../data/livechat/rooms");
const permissions_helper_1 = require("../../../data/permissions.helper");
const constants_1 = require("../../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] LIVECHAT - dashboards', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
        yield (0, rooms_1.createAgent)();
    }));
    (0, mocha_1.describe)('livechat/analytics/agents/average-service-time', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/average-service-time'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inq = yield (0, rooms_1.fetchInquiry)(room._id);
            yield (0, rooms_1.takeInquiry)(inq._id);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.agents).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('_id');
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('username');
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('averageServiceTimeInSeconds').that.is.a('number');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/agents/total-service-time', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/total-service-time'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of agents', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.agents).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('_id');
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('username');
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('serviceTimeDuration').that.is.a('number');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/agents/available-for-service-history', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/available-for-service-history'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/available-for-service-history'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/available-for-service-history'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/available-for-service-history'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/available-for-service-history'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of agents', () => __awaiter(void 0, void 0, void 0, function* () {
            // Toggling to populate agent activity collection
            yield (0, rooms_1.createAgent)();
            yield (0, rooms_1.makeAgentUnavailable)();
            yield (0, rooms_1.makeAgentAvailable)();
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/agents/available-for-service-history'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.agents).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('username');
            (0, chai_1.expect)(body.agents[0]).to.have.a.property('availableTimeInSeconds').that.is.a('number');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/amount-of-chats', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/amount-of-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/amount-of-chats'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/amount-of-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/amount-of-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/amount-of-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/amount-of-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('rooms').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/average-service-time', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-service-time'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('averageServiceTimeInSeconds').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/average-chat-duration-time', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-chat-duration-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-chat-duration-time'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-chat-duration-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-chat-duration-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-chat-duration-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-chat-duration-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('averageChatDurationTimeInSeconds').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/total-service-time', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-service-time'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-service-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('chats').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('serviceTimeDuration').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/average-waiting-time', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-waiting-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-waiting-time'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-waiting-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-waiting-time'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-waiting-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/average-waiting-time'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('averageWaitingTimeInSeconds').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/total-transferred-chats', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-transferred-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-transferred-chats'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-transferred-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-transferred-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-transferred-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-transferred-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('numberOfTransferredRooms').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/total-abandoned-chats', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_visitor_inactivity_timeout', 0);
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inq = yield (0, rooms_1.fetchInquiry)(room._id);
            yield (0, rooms_1.takeInquiry)(inq._id);
            yield (0, rooms_1.sendMessage)(room._id, 'first message', visitor.token);
            yield (0, rooms_1.sendAgentMessage)(room._id);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/total-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('abandonedRooms').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/departments/percentage-abandoned-chats', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/percentage-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: '2020-01-02' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if start is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/percentage-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ end: '2020-01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not present as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/percentage-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if start is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/percentage-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01x', end: date })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if end is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/percentage-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: '2020-x01-02' })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_visitor_inactivity_timeout', 0);
            const date = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/departments/percentage-abandoned-chats'))
                .set(api_data_1.credentials)
                .query({ start: date, end: new Date().toISOString() })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.departments).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('percentageOfAbandonedChats').that.is.a('number');
            (0, chai_1.expect)(body.departments[0]).to.have.a.property('_id');
        }));
    });
});
