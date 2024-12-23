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
const core_typings_1 = require("@rocket.chat/core-typings");
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const businessHours_1 = require("../../../data/livechat/businessHours");
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - Agents', () => {
    let agent;
    let manager;
    let agent2;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
        agent = yield (0, rooms_1.createAgent)();
        manager = yield (0, rooms_1.createManager)();
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield (0, rooms_1.createAgent)(user.username);
        yield (0, rooms_1.makeAgentAvailable)(userCredentials);
        agent2 = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, users_helper_1.deleteUser)(agent2.user);
    }));
    // TODO: missing test cases for POST method
    (0, mocha_1.describe)('GET livechat/users/:type', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('edit-omnichannel-contact', []);
            yield (0, permissions_helper_1.updatePermission)('transfer-livechat-guest', []);
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/users/agent')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should throw an error when the type is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/invalid-type'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Invalid type');
            });
        }));
        (0, mocha_1.it)('should return an array of agents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('edit-omnichannel-contact', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('transfer-livechat-guest', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                const agentRecentlyCreated = res.body.users.find((user) => agent._id === user._id);
                (0, chai_1.expect)(agentRecentlyCreated === null || agentRecentlyCreated === void 0 ? void 0 : agentRecentlyCreated._id).to.be.equal(agent._id);
            });
        }));
        (0, mocha_1.it)('should return an array of available agents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('edit-omnichannel-contact', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('transfer-livechat-guest', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .query({ onlyAvailable: true })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.users.every((u) => u.statusLivechat === 'available')).to.be.true;
            });
        }));
        (0, mocha_1.it)('should return an array of available/unavailable agents when onlyAvailable is false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .query({ onlyAvailable: false })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.users.every((u) => !u.statusLivechat || ['available', 'not-available'].includes(u.statusLivechat))).to.be.true;
            });
        }));
        (0, mocha_1.it)('should return offline agents when showIdleAgents is true', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.setUserStatus)(agent2.credentials, core_typings_1.UserStatus.OFFLINE);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .query({ showIdleAgents: true })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.users.every((u) => !u.status || [core_typings_1.UserStatus.ONLINE, core_typings_1.UserStatus.OFFLINE, core_typings_1.UserStatus.AWAY, core_typings_1.UserStatus.BUSY].includes(u.status))).to.be.true;
            });
        }));
        (0, mocha_1.it)('should return only online agents when showIdleAgents is false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.setUserStatus)(agent2.credentials, core_typings_1.UserStatus.ONLINE);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .query({ showIdleAgents: false })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.users.every((u) => u.status !== core_typings_1.UserStatus.OFFLINE)).to.be.true;
            });
        }));
        (0, mocha_1.it)('should return an array of managers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/users/manager'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.users).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                const managerRecentlyCreated = res.body.users.find((user) => manager._id === user._id);
                (0, chai_1.expect)(managerRecentlyCreated === null || managerRecentlyCreated === void 0 ? void 0 : managerRecentlyCreated._id).to.be.equal(manager._id);
            });
        }));
    });
    (0, mocha_1.describe)('POST livechat/users/:type', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .send({
                username: 'test-agent',
            })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when type is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/users/invalid-type'))
                .set(api_data_1.credentials)
                .send({
                username: 'test-agent',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error when username is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .send({
                username: 'mr-not-valid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return a valid user when all goes fine', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/users/agent'))
                .set(api_data_1.credentials)
                .send({
                username: user.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('user');
                (0, chai_1.expect)(res.body.user).to.have.property('_id');
                (0, chai_1.expect)(res.body.user).to.have.property('username');
            });
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should properly create a manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/users/manager'))
                .set(api_data_1.credentials)
                .send({
                username: user.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('user');
                (0, chai_1.expect)(res.body.user).to.have.property('_id');
                (0, chai_1.expect)(res.body.user).to.have.property('username');
            });
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('GET livechat/users/:type/:_id', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/users/agent/id${agent._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        })).timeout(5000);
        (0, mocha_1.it)('should return an error when type is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/users/invalid-type/invalid-id${agent._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
        })).timeout(5000);
        (0, mocha_1.it)('should return an error when _id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/users/agent/invalid-id')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        })).timeout(5000);
        (0, mocha_1.it)('should return a valid user when all goes fine', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const agent = yield (0, rooms_1.createAgent)();
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/users/agent/${agent._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('user');
                (0, chai_1.expect)(res.body.user).to.have.property('_id');
                (0, chai_1.expect)(res.body.user).to.have.property('username');
                (0, chai_1.expect)(res.body.user).to.not.have.property('roles');
            });
        }));
        (0, mocha_1.it)('should return { user: null } when user is not an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/users/agent/${user._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('user');
                (0, chai_1.expect)(res.body.user).to.be.null;
            });
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('DELETE livechat/users/:type/:_id', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request.delete((0, api_data_1.api)(`livechat/users/agent/id`)).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        })).timeout(5000);
        (0, mocha_1.it)('should return an error when type is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request.delete((0, api_data_1.api)(`livechat/users/invalid-type/id`)).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        })).timeout(5000);
        (0, mocha_1.it)('should return an error when _id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/users/agent/invalid-id')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        })).timeout(5000);
        (0, mocha_1.it)('should return a valid user when all goes fine', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const agent = yield (0, rooms_1.createAgent)();
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/users/agent/${agent._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('livechat/agents/:agentId/departments', () => {
        let dep1;
        let dep2;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            dep1 = yield (0, department_1.createDepartment)({
                enabled: true,
                name: random_1.Random.id(),
                showOnRegistration: true,
                email: `${random_1.Random.id()}@example.com`,
                showOnOfflineForm: true,
            }, [{ agentId: api_data_1.credentials['X-User-Id'] }]);
            dep2 = yield (0, department_1.createDepartment)({
                enabled: false,
                name: random_1.Random.id(),
                email: `${random_1.Random.id()}@example.com`,
                showOnRegistration: true,
                showOnOfflineForm: true,
            }, [{ agentId: api_data_1.credentials['X-User-Id'] }]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(dep1._id);
            yield (0, department_1.deleteDepartment)(dep2._id);
        }));
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/agents/${agent._id}/departments`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['livechat-manager', 'livechat-agent', 'admin']);
        }));
        (0, mocha_1.it)('should return an empty array of departments when the agentId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/agents/invalid-id/departments'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return an array of departments when the agentId is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/agents/${agent._id}/departments`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments').and.to.be.an('array');
                (0, chai_1.expect)(res.body.departments.length).to.be.equal(2);
                res.body.departments.forEach((department) => {
                    (0, chai_1.expect)(department.agentId).to.be.equal(agent._id);
                    (0, chai_1.expect)(department).to.have.property('departmentName').that.is.a('string');
                });
            });
        }));
        (0, mocha_1.it)('should return only enabled departments when param `enabledDepartmentsOnly` is true ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/agents/${agent._id}/departments`))
                .set(api_data_1.credentials)
                .query({ enabledDepartmentsOnly: true })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments').and.to.be.an('array');
                (0, chai_1.expect)(res.body.departments.length).to.be.equal(1);
                (0, chai_1.expect)(res.body.departments[0].departmentEnabled).to.be.true;
            });
        }));
    });
    (0, mocha_1.describe)('livechat/agent.info/:rid/:token', () => {
        (0, mocha_1.it)('should fail when token in url params is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)(`livechat/agent.info/soemthing/invalid-token`)).expect(400);
        }));
        (0, mocha_1.it)('should fail when token is valid but rid isnt', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.get((0, api_data_1.api)(`livechat/agent.info/invalid-rid/${visitor.token}`)).expect(400);
        }));
        /* it('should fail when room is not being served by any agent', async () => {
            await updateSetting('Livechat_Routing_Method', 'Manual_Selection');
            const visitor = await createVisitor();
            const room = await createLivechatRoom(visitor.token);
            await request.get(api(`livechat/agent.info/${room._id}/${visitor.token}`)).expect(400);
        }); */
        (0, mocha_1.it)('should return a valid agent when the room is being served and the room belongs to visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inq = yield (0, rooms_1.fetchInquiry)(room._id);
            yield (0, rooms_1.takeInquiry)(inq._id, agent2.credentials);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)(`livechat/agent.info/${room._id}/${visitor.token}`));
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('agent');
            (0, chai_1.expect)(body.agent).to.have.property('_id', agent2.user._id);
        }));
    });
    (0, mocha_1.describe)('livechat/agent.next/:token', () => {
        (0, mocha_1.it)('should fail when token in url params is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)(`livechat/agent.next/invalid-token`)).expect(400);
        }));
        (0, mocha_1.it)('should return success when visitor with token has an open room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.get((0, api_data_1.api)(`livechat/agent.next/${visitor.token}`)).expect(200);
        }));
        (0, mocha_1.it)('should fail if theres no open room for visitor and algo is manual selection', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.get((0, api_data_1.api)(`livechat/agent.next/${visitor.token}`)).expect(400);
        }));
        // TODO: test cases when algo is Auto_Selection
    });
    (0, mocha_1.describe)('livechat/agent.status', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission to change its own status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/agent.status')).set(api_data_1.credentials).send({ status: 'not-available' }).expect(403);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent', 'livechat-manager']);
        }));
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission to change other status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(api_data_1.credentials)
                .send({ status: 'not-available', agentId: agent2.user._id })
                .expect(403);
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
        }));
        (0, mocha_1.it)('should return an error if user is not an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)({ roles: ['livechat-manager'] });
            const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(userCredentials)
                .send({ status: 'available', agentId: user._id })
                .expect(404)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Agent not found');
            });
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should return an error if status is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(agent2.credentials)
                .send({ status: 'invalid-status', agentId: agent2.user._id })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should return an error if agentId param is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(agent2.credentials)
                .send({ status: 'available', agentId: 'invalid-agent-id' })
                .expect(404)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Agent not found');
            });
        }));
        (0, mocha_1.it)('should change logged in users status', () => __awaiter(void 0, void 0, void 0, function* () {
            const currentUser = yield (0, users_helper_1.getMe)(agent2.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(agent2.credentials)
                .send({ status: newStatus, agentId: currentUser._id })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('status', newStatus);
            });
        }));
        (0, mocha_1.it)('should allow managers to change other agents status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            const currentUser = yield (0, users_helper_1.getMe)(agent2.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(api_data_1.credentials)
                .send({ status: newStatus, agentId: currentUser._id })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('status', newStatus);
            });
        }));
        (0, mocha_1.it)('should throw an error if agent tries to make themselves available outside of Business hour', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, businessHours_1.makeDefaultBusinessHourActiveAndClosed)();
            const currentUser = yield (0, users_helper_1.getMe)(agent2.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(agent2.credentials)
                .send({ status: newStatus, agentId: currentUser._id })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-business-hours-are-closed');
            });
        }));
        (0, mocha_1.it)('should not allow managers to make other agents available outside business hour', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-agents', ['admin']);
            const currentUser = yield (0, users_helper_1.getMe)(agent2.credentials);
            const currentStatus = currentUser.statusLivechat;
            const newStatus = currentStatus === 'available' ? 'not-available' : 'available';
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/agent.status'))
                .set(api_data_1.credentials)
                .send({ status: newStatus, agentId: currentUser._id })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('status', currentStatus);
            });
            yield (0, businessHours_1.disableDefaultBusinessHour)();
        }));
    });
    (0, mocha_1.describe)('Agent sidebar', () => {
        let testUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(credentials2);
            testUser = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser.user);
        }));
        (0, mocha_1.it)('should return an empty list of rooms for a newly created agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('rooms.get')).set(testUser.credentials).send({}).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.update.filter((r) => r.t === 'l')).to.have.lengthOf(0);
        }));
        (0, mocha_1.it)('should have a new room in his sidebar after taking a conversation from the queue', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: testUser.credentials });
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('rooms.get')).set(testUser.credentials).send({}).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            const livechatRooms = body.update.filter((r) => r.t === 'l');
            (0, chai_1.expect)(livechatRooms).to.have.lengthOf(1);
            (0, chai_1.expect)(body.update.find((r) => r._id === room._id)).to.be.an('object');
            (0, chai_1.expect)(body.update.find((r) => r._id === 'GENERAL')).to.be.an('object');
        }));
        (0, mocha_1.it)('should not have the room if user moves room back to queue', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: testUser.credentials });
            yield (0, rooms_1.moveBackToQueue)(room._id, testUser.credentials);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('rooms.get'))
                .set(testUser.credentials)
                .query({ updatedSince: new Date(new Date().getTime() - 2000) })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.update.find((r) => r._id === room._id)).to.be.undefined;
        }));
        (0, mocha_1.it)('should not have the room if the user closes the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({ agent: testUser.credentials });
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('rooms.get')).set(testUser.credentials).expect(200);
            (0, chai_1.expect)(body.update.find((r) => r._id === room._id)).to.be.undefined;
        }));
    });
});
