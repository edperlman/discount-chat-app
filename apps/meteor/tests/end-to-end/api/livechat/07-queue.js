"use strict";
/* eslint-env mocha */
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
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const permissions_helper_1 = require("../../../data/permissions.helper");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
const cleanupRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/queue')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
    const { queue } = response.body;
    try {
        for (var _d = true, queue_1 = __asyncValues(queue), queue_1_1; queue_1_1 = yield queue_1.next(), _a = queue_1_1.done, !_a; _d = true) {
            _c = queue_1_1.value;
            _d = false;
            const item = _c;
            const { body: { rooms }, } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ 'agents[]': item.user._id }).set(api_data_1.credentials);
            yield Promise.all(rooms.map((room) => api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: room._id, comment: faker_1.faker.lorem.sentence() })));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = queue_1.return)) yield _b.call(queue_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
(0, mocha_1.describe)('LIVECHAT - Queue', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([
            (0, permissions_helper_1.updateSetting)('Livechat_enabled', true),
            (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection'),
            (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never'),
            // this cleanup is required since previous tests left the DB dirty
            cleanupRooms(),
        ]);
    }));
    (0, mocha_1.describe)('livechat/queue', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/queue')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
        }));
        (0, mocha_1.it)('should return an array of queued metrics', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.queue).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
        (0, mocha_1.it)('should return an array of queued metrics even requested with count and offset params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.queue).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
    });
    (0, mocha_1.describe)('queue position', () => {
        let agent1;
        let agent2;
        let agent3;
        let deptd1;
        let deptd2;
        const roomsToClose = [];
        const visitors = [];
        const usersToDelete = [];
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            deptd1 = department;
            agent1 = agent;
            usersToDelete.push(agent.user);
            const newVisitor = yield (0, rooms_1.createVisitor)(deptd1._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            roomsToClose.push(newRoom);
            visitors.push(newVisitor);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(deptd1._id);
            if (deptd2) {
                yield (0, department_1.deleteDepartment)(deptd2._id);
            }
            yield Promise.all(roomsToClose.map((room) => (0, rooms_1.closeOmnichannelRoom)(room._id)));
            yield Promise.all(visitors.map((visitor) => (0, rooms_1.deleteVisitor)(visitor.token)));
            yield Promise.all(usersToDelete.map((user) => (0, users_helper_1.deleteUser)(user)));
        }));
        (0, mocha_1.it)('should have one item in the queue', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(1);
                const [queue] = res.body.queue;
                (0, chai_1.expect)(queue).to.have.property('chats', 1);
                (0, chai_1.expect)(queue).to.have.nested.property('user._id', agent1.user._id);
                (0, chai_1.expect)(queue).to.have.nested.property('department._id', deptd1._id);
            });
        }));
        (0, mocha_1.it)('should return empty results when filtering by another agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .query({ agentId: 'another-agent' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total', 0);
                (0, chai_1.expect)(res.body).to.have.property('count', 0);
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(0);
            });
        }));
        (0, mocha_1.it)('should increase chats when a new room for same department is created', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            roomsToClose.push(newRoom);
            visitors.push(newVisitor);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(1);
                const [queue] = res.body.queue;
                (0, chai_1.expect)(queue).to.have.property('chats', 2);
                (0, chai_1.expect)(queue).to.have.nested.property('user._id', agent1.user._id);
                (0, chai_1.expect)(queue).to.have.nested.property('department._id', deptd1._id);
            });
        }));
        (0, mocha_1.it)('should have two items when create room for another agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const { user } = yield (0, users_1.createAnOnlineAgent)();
            yield (0, department_1.addOrRemoveAgentFromDepartment)(deptd1._id, { agentId: user._id, username: user.username }, true);
            agent2 = { user };
            usersToDelete.push(user);
            const newVisitor = yield (0, rooms_1.createVisitor)(deptd1._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            roomsToClose.push(newRoom);
            visitors.push(newVisitor);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(2);
                const [queue1, queue2] = res.body.queue;
                (0, chai_1.expect)(queue1).to.have.property('chats', 2);
                (0, chai_1.expect)(queue1).to.have.nested.property('user._id', agent1.user._id);
                (0, chai_1.expect)(queue1).to.have.nested.property('department._id', deptd1._id);
                (0, chai_1.expect)(queue2).to.have.property('chats', 1);
                (0, chai_1.expect)(queue2).to.have.nested.property('user._id', agent2.user._id);
                (0, chai_1.expect)(queue2).to.have.nested.property('department._id', deptd1._id);
            });
        }));
        (0, mocha_1.it)('should be able to filter for second agent only', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .query({ agentId: agent2.user._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(1);
                const [queue1] = res.body.queue;
                (0, chai_1.expect)(queue1).to.have.property('chats', 1);
                (0, chai_1.expect)(queue1).to.have.nested.property('user._id', agent2.user._id);
                (0, chai_1.expect)(queue1).to.have.nested.property('department._id', deptd1._id);
            });
        }));
        (0, mocha_1.it)('should return empty if filter for a department without chats', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .query({ departmentId: 'no-chats' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total', 0);
                (0, chai_1.expect)(res.body).to.have.property('count', 0);
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(0);
            });
        }));
        (0, mocha_1.it)('should be able to filter for first department only', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .query({ departmentId: deptd1._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(2);
                const [queue1] = res.body.queue;
                (0, chai_1.expect)(queue1).to.have.property('chats', 2);
                (0, chai_1.expect)(queue1).to.have.nested.property('user._id', agent1.user._id);
                (0, chai_1.expect)(queue1).to.have.nested.property('department._id', deptd1._id);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should have three items when create room for another department', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department: dep2, agent: ag3 } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            agent3 = ag3;
            usersToDelete.push(ag3.user);
            deptd2 = dep2;
            const newVisitor = yield (0, rooms_1.createVisitor)(deptd2._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            roomsToClose.push(newRoom);
            visitors.push(newVisitor);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(3);
                const [queue1, queue2, queue3] = res.body.queue;
                (0, chai_1.expect)(queue1).to.have.property('chats', 2);
                (0, chai_1.expect)(queue1).to.have.nested.property('user._id', agent1.user._id);
                (0, chai_1.expect)(queue1).to.have.nested.property('department._id', deptd1._id);
                (0, chai_1.expect)(queue2).to.have.property('chats', 1);
                (0, chai_1.expect)(queue3).to.have.property('chats', 1);
            });
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should change the order when second department gets more rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor1 = yield (0, rooms_1.createVisitor)(deptd2._id);
            const newRoom1 = yield (0, rooms_1.createLivechatRoom)(newVisitor1.token);
            roomsToClose.push(newRoom1);
            visitors.push(newVisitor1);
            const newVisitor2 = yield (0, rooms_1.createVisitor)(deptd2._id);
            const newRoom2 = yield (0, rooms_1.createLivechatRoom)(newVisitor2.token);
            roomsToClose.push(newRoom2);
            visitors.push(newVisitor2);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.queue).to.be.an('array').of.length(3);
                const [queue1, queue2, queue3] = res.body.queue;
                (0, chai_1.expect)(queue1).to.have.property('chats', 3);
                (0, chai_1.expect)(queue1).to.have.nested.property('user._id', agent3.user._id);
                (0, chai_1.expect)(queue1).to.have.nested.property('department._id', deptd2._id);
                (0, chai_1.expect)(queue2).to.have.property('chats', 2);
                (0, chai_1.expect)(queue2).to.have.nested.property('user._id', agent1.user._id);
                (0, chai_1.expect)(queue2).to.have.nested.property('department._id', deptd1._id);
                (0, chai_1.expect)(queue3).to.have.property('chats', 1);
                (0, chai_1.expect)(queue3).to.have.nested.property('user._id', agent2.user._id);
                (0, chai_1.expect)(queue3).to.have.nested.property('department._id', deptd1._id);
            });
        }));
    });
});
