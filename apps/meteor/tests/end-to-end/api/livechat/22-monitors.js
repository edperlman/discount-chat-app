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
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Omnichannel - Monitors', () => {
    let manager;
    let monitor;
    let noUnitDepartment;
    let unitDepartment;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_accept_chats_with_no_agents', true);
        yield (0, users_helper_1.setUserActiveStatus)('rocketchat.internal.admin.test', true);
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        if (!user.username) {
            throw new Error('user not created');
        }
        yield (0, rooms_1.createManager)(user.username);
        manager = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        if (!user.username) {
            throw new Error('user not created');
        }
        yield (0, units_1.createMonitor)(user.username);
        monitor = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        noUnitDepartment = yield (0, department_1.createDepartment)();
        unitDepartment = yield (0, department_1.createDepartment)();
        yield (0, units_1.createUnit)(monitor.user._id, monitor.user.username, [unitDepartment._id]);
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updatePermission)('transfer-livechat-guest', ['admin', 'livechat-manager', 'livechat-agent', 'livechat-monitor']);
    }));
    (0, mocha_1.describe)('Monitors', () => {
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should properly create a new monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)(`livechat:addMonitor`))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:addMonitor',
                    params: [user.username],
                    id: '101',
                    msg: 'method',
                }),
            })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should not fail when trying to create a monitor that already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)(`livechat:addMonitor`))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:addMonitor',
                    params: [user.username],
                    id: '101',
                    msg: 'method',
                }),
            })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should fail when trying to create a monitor with an invalid username', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)(`livechat:addMonitor`))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:addMonitor',
                    params: ['invalid-username'],
                    id: '101',
                    msg: 'method',
                }),
            })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
            const parsedBody = JSON.parse(body.message);
            (0, chai_1.expect)(parsedBody.error).to.have.property('error').to.be.equal('error-invalid-user');
        }));
        (0, mocha_1.it)('should fail when trying to create a monitor with an empty username', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)(`livechat:addMonitor`))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:addMonitor',
                    params: [''],
                    id: '101',
                    msg: 'method',
                }),
            })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
            const parsedBody = JSON.parse(body.message);
            (0, chai_1.expect)(parsedBody.error).to.have.property('error').to.be.equal('error-invalid-user');
        }));
        (0, mocha_1.it)('should remove a monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)(`livechat:removeMonitor`))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:removeMonitor',
                    params: [user.username],
                    id: '101',
                    msg: 'method',
                }),
            })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
        (0, mocha_1.it)('should not fail when trying to remove a monitor that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)(`livechat:removeMonitor`))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:removeMonitor',
                    params: [user.username],
                    id: '101',
                    msg: 'method',
                }),
            })
                .expect(200);
            (0, chai_1.expect)(body.success).to.be.true;
        }));
    });
    (0, mocha_1.describe)('[GET] livechat/monitors', () => {
        (0, mocha_1.it)('should fail if manage-livechat-monitors permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('manage-livechat-monitors');
            return api_data_1.request.get((0, api_data_1.api)('livechat/monitors')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return all monitors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('manage-livechat-monitors');
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/monitors')).set(api_data_1.credentials).query({ text: user.username }).expect(200);
            (0, chai_1.expect)(body).to.have.property('monitors');
            (0, chai_1.expect)(body.monitors).to.have.lengthOf(1);
            (0, chai_1.expect)(body.monitors[0]).to.have.property('username', user.username);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('livechat/monitors/:username', () => {
        (0, mocha_1.it)('should fail if manage-livechat-monitors permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('manage-livechat-monitors');
            return api_data_1.request.get((0, api_data_1.api)('livechat/monitors/123')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return a monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('manage-livechat-monitors');
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/monitors/${user.username}`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('username', user.username);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('Monitors & Rooms', () => {
        (0, mocha_1.it)('should not return a room of a department that the monitor is not assigned to', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)(noUnitDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('rooms').that.is.an('array');
            (0, chai_1.expect)(body.rooms.find((r) => r._id === room._id)).to.not.exist;
        }));
        (0, mocha_1.it)('should return a room of a department the monitor is assigned to', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)(unitDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('rooms').that.is.an('array');
            (0, chai_1.expect)(body.rooms.find((r) => r._id === room._id)).to.exist;
        }));
    });
    (0, mocha_1.describe)('Monitors & Departments', () => {
        (0, mocha_1.it)('should not return a department that the monitor is not assigned to', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .query({ onlyMyDepartments: true })
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments').that.is.an('array');
            (0, chai_1.expect)(body.departments.find((d) => d._id === noUnitDepartment._id)).to.not.exist;
        }));
        (0, mocha_1.it)('should return a department that the monitor is assigned to', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .query({ onlyMyDepartments: true })
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments').that.is.an('array');
            (0, chai_1.expect)(body.departments.length).to.be.equal(1);
            (0, chai_1.expect)(body.departments.find((d) => d._id === unitDepartment._id)).to.exist;
        }));
        (0, mocha_1.it)('should return both created departments to a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .query({ onlyMyDepartments: true, sort: '{ "_updatedAt": 1 }' })
                .set(manager.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments').that.is.an('array');
            (0, chai_1.expect)(body.departments.find((d) => d._id === noUnitDepartment._id)).to.exist;
            (0, chai_1.expect)(body.departments.find((d) => d._id === unitDepartment._id)).to.exist;
        }));
        (0, mocha_1.it)('should not return a department when monitor is only assigned as agent there', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.createAgent)(monitor.user.username);
            yield (0, department_1.addOrRemoveAgentFromDepartment)(noUnitDepartment._id, { agentId: monitor.user._id, username: monitor.user.username, count: 0, order: 0 }, true);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .query({ onlyMyDepartments: true })
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments').that.is.an('array');
            (0, chai_1.expect)(body.departments.length).to.be.equal(1);
            (0, chai_1.expect)(body.departments.find((d) => d._id === noUnitDepartment._id)).to.not.exist;
        }));
    });
    (0, mocha_1.describe)('Monitors & Forward', () => {
        (0, mocha_1.it)('should successfully forward a room to another agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)(unitDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(monitor.credentials)
                .send({
                roomId: room._id,
                userId: 'rocketchat.internal.admin.test',
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            const room2 = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(room2).to.have.property('servedBy').that.is.an('object');
            (0, chai_1.expect)(room2.servedBy).to.have.property('_id', 'rocketchat.internal.admin.test');
        }));
        (0, mocha_1.it)('should successfully forward a room to a department', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)(noUnitDepartment._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(monitor.credentials)
                .send({
                roomId: room._id,
                departmentId: unitDepartment._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            const room2 = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(room2.departmentId).to.be.equal(unitDepartment._id);
        }));
    });
});
