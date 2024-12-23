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
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const units_1 = require("../../../data/livechat/units");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('LIVECHAT - reports', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    let agent2;
    let agent3;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        if (!user.username) {
            throw new Error('user not created');
        }
        yield (0, units_1.createMonitor)(user.username);
        agent2 = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield (0, rooms_1.createAgent)();
        if (!user.username) {
            throw new Error('user not created');
        }
        yield (0, units_1.createMonitor)(user.username);
        const dep1 = yield (0, department_1.createDepartment)();
        yield (0, department_1.addOrRemoveAgentFromDepartment)(dep1._id, { agentId: 'rocketchat.internal.admin.test', username: 'rocketchat.internal.admin.test', count: 0, order: 0 }, true);
        const { room, visitor } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ departmentId: dep1._id });
        yield api_data_1.request
            .post((0, api_data_1.api)('livechat/room.saveInfo'))
            .set(api_data_1.credentials)
            .send({
            roomData: {
                _id: room._id,
                topic: 'new topic',
                tags: ['tag1', 'tag2'],
            },
            guestData: {
                _id: visitor._id,
            },
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        });
        yield (0, units_1.createUnit)(user._id, user.username, [dep1._id]);
        agent3 = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, users_helper_1.deleteUser)(agent2.user);
        yield (0, users_helper_1.deleteUser)(agent3.user);
    }));
    (0, mocha_1.describe)('livechat/analytics/dashboards/conversations-by-source', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-reports', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the start and end parameters are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-reports');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source')).set(api_data_1.credentials).query({ end: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source')).set(api_data_1.credentials).query({ start: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if dates are more than 1 year apart', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneYearAgo = new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: oneYearAgo, end: now })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when start is after end', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: now, end: oneHourAgo })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return the proper data when the parameters are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Note: this way all data will come as 0
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: now, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.total).to.be.equal(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return empty set for a monitor with no units', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(agent2.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return only the data from the unit the monitor belongs to', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(agent3.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.data.every((item) => item.value >= 0)).to.be.true;
            (0, chai_1.expect)(body.total).to.be.greaterThan(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return valid data when login as a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-source'))
                .set(api_data_1.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.data.every((item) => item.value >= 0)).to.be.true;
            (0, chai_1.expect)(body.total).to.be.greaterThan(0);
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/conversations-by-status', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-reports', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the start and end parameters are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-reports');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status')).set(api_data_1.credentials).query({ end: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status')).set(api_data_1.credentials).query({ start: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if dates are more than 1 year apart', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneYearAgo = new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: oneYearAgo, end: now })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when start is after end', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: now, end: oneHourAgo })
                .expect(400);
        }));
        (0, mocha_1.it)('should return the proper data when the parameters are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Note: this way all data will come as 0
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: now, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return empty set for a monitor with no units', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(agent2.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return the proper data when login as a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-status'))
                .set(api_data_1.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.data.every((item) => item.value >= 0)).to.be.true;
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/conversations-by-department', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-reports', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the start and end parameters are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-reports');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if dates are more than 1 year apart', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneYearAgo = new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: oneYearAgo, end: now })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when start is after end', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: now, end: oneHourAgo })
                .expect(400);
        }));
        (0, mocha_1.it)('should return the proper data when the parameters are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Note: this way all data will come as 0
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: now, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return empty set for a monitor with no units', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(agent2.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return the proper data when login as a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-department'))
                .set(api_data_1.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.data.every((item) => item.value >= 0)).to.be.true;
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/conversations-by-tags', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-reports', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the start and end parameters are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-reports');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags')).set(api_data_1.credentials).query({ end: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags')).set(api_data_1.credentials).query({ start: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if dates are more than 1 year apart', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneYearAgo = new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: oneYearAgo, end: now })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when start is after end', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: now, end: oneHourAgo })
                .expect(400);
        }));
        (0, mocha_1.it)('should return the proper data when the parameters are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Note: this way all data will come as 0
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: now, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return empty set for a monitor with no units', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(agent2.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return the proper data when login as a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-tags'))
                .set(api_data_1.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.data.every((item) => item.value >= 0)).to.be.true;
        }));
    });
    (0, mocha_1.describe)('livechat/analytics/dashboards/conversations-by-agent', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-reports', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the start and end parameters are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-reports');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent')).set(api_data_1.credentials).query({ end: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent')).set(api_data_1.credentials).query({ start: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should return an error when the start parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: 'test', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when the end parameter is not a valid date', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: '2020-01-01', end: 'test' })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if dates are more than 1 year apart', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneYearAgo = new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: oneYearAgo, end: now })
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when start is after end', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: now, end: oneHourAgo })
                .expect(400);
        }));
        (0, mocha_1.it)('should return the proper data when the parameters are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // Note: this way all data will come as 0
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: now, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
        }));
        (0, mocha_1.it)('should return empty set for a monitor with no units', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(agent2.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf(0);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should return the proper data when login as a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/analytics/dashboards/conversations-by-agent'))
                .set(api_data_1.credentials)
                .query({ start: oneHourAgo, end: now })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('data').and.to.be.an('array');
            (0, chai_1.expect)(body.data).to.have.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.data.every((item) => item.value >= 0)).to.be.true;
        }));
    });
});
