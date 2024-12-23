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
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] LIVECHAT - Units', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['livechat-manager', 'livechat-monitor', 'admin']);
    }));
    (0, mocha_1.describe)('[GET] livechat/units', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request
                .get((0, api_data_1.api)('livechat/units'))
                .set(api_data_1.credentials)
                .send({
                unitData: {
                    name: 'test',
                    enabled: true,
                },
                unitMonitors: [],
                unitDepartments: [],
            })
                .expect(403);
        }));
        (0, mocha_1.it)('should return a list of units', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/units')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.units).to.be.an('array').with.lengthOf.greaterThan(0);
            const unitFound = body.units.find((u) => u._id === unit._id);
            (0, chai_1.expect)(unitFound).to.have.property('_id', unit._id);
            (0, chai_1.expect)(unitFound).to.have.property('name', unit.name);
            (0, chai_1.expect)(unitFound).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(unitFound).to.have.property('numDepartments', 1);
            (0, chai_1.expect)(unitFound).to.have.property('type', 'u');
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should return a list of units matching the provided filter', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/units')).query({ text: unit.name }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.units).to.be.an('array').with.lengthOf(1);
            const unitFound = body.units.find((u) => u._id === unit._id);
            (0, chai_1.expect)(unitFound).to.have.property('_id', unit._id);
            (0, chai_1.expect)(unitFound).to.have.property('name', unit.name);
            (0, chai_1.expect)(unitFound).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(unitFound).to.have.property('numDepartments', 1);
            (0, chai_1.expect)(unitFound).to.have.property('type', 'u');
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should properly paginate the result set', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/units')).query({ count: 1 }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body).to.have.property('units').and.to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(body).to.have.property('count').and.to.be.equal(1);
            const unit = body.units[0];
            const { body: body2 } = yield api_data_1.request.get((0, api_data_1.api)('livechat/units')).query({ count: 1, offset: 1 }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body2).to.have.property('units').and.to.be.an('array').with.lengthOf(1);
            const unit2 = body2.units[0];
            (0, chai_1.expect)(unit._id).to.not.be.equal(unit2._id);
        }));
        (0, mocha_1.it)('should sort the result set based on provided fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id], 'A test 1234');
            const unit2 = yield (0, units_1.createUnit)(user._id, user.username, [department._id], 'a test 1234');
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/units'))
                .query({ sort: JSON.stringify({ name: 1 }), text: 'test', count: 2 })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('units').and.to.be.an('array').with.lengthOf(2);
            (0, chai_1.expect)(body.units[0]._id).to.be.equal(unit._id);
            (0, chai_1.expect)(body.units[1]._id).to.be.equal(unit2._id);
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('[POST] livechat/units', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request
                .post((0, api_data_1.api)('livechat/units'))
                .set(api_data_1.credentials)
                .send({
                unitData: {
                    name: 'test',
                    enabled: true,
                },
                unitMonitors: [],
                unitDepartments: [],
            })
                .expect(403);
        }));
        (0, mocha_1.it)('should return a created unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/units'))
                .set(api_data_1.credentials)
                .send({
                unitData: { name: 'test', visibility: 'public', enabled: true, description: 'test' },
                unitMonitors: [{ monitorId: user._id, username: user.username }],
                unitDepartments: [{ departmentId: department._id }],
            })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id');
            (0, chai_1.expect)(body).to.have.property('name', 'test');
            (0, chai_1.expect)(body).to.have.property('visibility', 'public');
            (0, chai_1.expect)(body).to.have.property('type', 'u');
            (0, chai_1.expect)(body).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(body).to.have.property('numDepartments', 1);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should return a unit with no monitors if a user who is not a monitor is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            const department = yield (0, rooms_1.createDepartment)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/units'))
                .set(api_data_1.credentials)
                .send({
                unitData: { name: 'test', visibility: 'public', enabled: true, description: 'test' },
                unitMonitors: [{ monitorId: user._id, username: user.username }],
                unitDepartments: [{ departmentId: department._id }],
            })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('numMonitors', 0);
            (0, chai_1.expect)(body).to.have.property('name', 'test');
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('[GET] livechat/units/:id', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request.get((0, api_data_1.api)('livechat/units/123')).set(api_data_1.credentials).send().expect(403);
        }));
        (0, mocha_1.it)('should return a unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/units/${unit._id}`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id', unit._id);
            (0, chai_1.expect)(body).to.have.property('name', unit.name);
            (0, chai_1.expect)(body).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(body).to.have.property('numDepartments', 1);
            (0, chai_1.expect)(body).to.have.property('type', 'u');
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('[POST] livechat/units/:id', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request.post((0, api_data_1.api)('livechat/units/123')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should fail if unit does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/units/123'))
                .set(api_data_1.credentials)
                .send({
                unitData: { name: 'test', visibility: 'public', enabled: true, description: 'test' },
                unitMonitors: [{ monitorId: user._id, username: user.username }],
                unitDepartments: [{ departmentId: department._id }],
            })
                .expect(400);
            (0, chai_1.expect)(body).to.have.property('success', false);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should return a updated unit', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/units/${unit._id}`))
                .set(api_data_1.credentials)
                .send({
                unitData: { name: 'test', visibility: 'private', enabled: true, description: 'test' },
                unitMonitors: [{ monitorId: user._id, username: user.username }],
                unitDepartments: [{ departmentId: department._id }],
            })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id');
            (0, chai_1.expect)(body).to.have.property('name', 'test');
            (0, chai_1.expect)(body).to.have.property('visibility', 'private');
            (0, chai_1.expect)(body).to.have.property('type', 'u');
            (0, chai_1.expect)(body).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(body).to.have.property('numDepartments', 1);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should move the department to the latest unit that attempted to assign it', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit1 = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const unit2 = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/units/${unit1._id}/departments`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments');
            (0, chai_1.expect)(body.departments).to.have.lengthOf(0);
            (0, chai_1.expect)(unit2.numDepartments).to.be.equal(1);
        }));
        (0, mocha_1.it)('should remove the department from the unit if it is not passed in the request', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit1 = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/units/${unit1._id}`))
                .set(api_data_1.credentials)
                .send({
                unitData: { name: unit1.name, visibility: unit1.visibility },
                unitMonitors: [{ monitorId: user._id, username: user.username }],
                unitDepartments: [],
            })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id', unit1._id);
            (0, chai_1.expect)(body).to.have.property('numDepartments', 0);
        }));
        (0, mocha_1.it)('should remove the monitor from the unit if it is not passed in the request', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit1 = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/units/${unit1._id}`))
                .set(api_data_1.credentials)
                .send({
                unitData: { name: unit1.name, visibility: unit1.visibility },
                unitMonitors: [],
                unitDepartments: [{ departmentId: department._id }],
            })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id', unit1._id);
            (0, chai_1.expect)(body).to.have.property('numMonitors', 0);
        }));
    });
    (0, mocha_1.describe)('[DELETE] livechat/units/:id', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request.delete((0, api_data_1.api)('livechat/units/123')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return a deleted unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/units/${unit._id}`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.be.a('number').equal(1);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('livechat/units/:unitId/departments', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request.get((0, api_data_1.api)('livechat/units/123/departments')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return departments associated with a unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/units/${unit._id}/departments`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments');
            (0, chai_1.expect)(body.departments).to.have.lengthOf(1);
            (0, chai_1.expect)(body.departments[0]).to.have.property('_id', department._id);
            (0, chai_1.expect)(body.departments[0]).to.have.property('name', department.name);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('livechat/units/:unitId/departments/available', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', []);
            return api_data_1.request.get((0, api_data_1.api)('livechat/units/123/departments/available')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return departments not associated with a unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-units', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/units/${unit._id}/departments/available`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('departments');
            (0, chai_1.expect)(body.departments).to.have.lengthOf.greaterThan(0);
            const myUnit = body.departments.find((d) => d.parentId === unit._id);
            (0, chai_1.expect)(myUnit).to.not.be.undefined.and.not.be.null;
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('livechat/units/:unitId/monitors', () => {
        (0, mocha_1.it)('should fail if manage-livechat-units permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-monitors', []);
            return api_data_1.request.get((0, api_data_1.api)('livechat/units/123/monitors')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return monitors associated with a unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-monitors', ['admin']);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(user.username);
            const department = yield (0, rooms_1.createDepartment)();
            const unit = yield (0, units_1.createUnit)(user._id, user.username, [department._id]);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/units/${unit._id}/monitors`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('monitors');
            (0, chai_1.expect)(body.monitors).to.have.lengthOf(1);
            (0, chai_1.expect)(body.monitors[0]).to.have.property('monitorId', user._id);
            (0, chai_1.expect)(body.monitors[0]).to.have.property('username', user.username);
            // cleanup
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('[POST] livechat/department', () => {
        let monitor1;
        let monitor1Credentials;
        let monitor2;
        let monitor2Credentials;
        let unit;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            monitor1 = yield (0, users_helper_1.createUser)();
            monitor2 = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(monitor1.username);
            monitor1Credentials = yield (0, users_helper_1.login)(monitor1.username, user_1.password);
            yield (0, units_1.createMonitor)(monitor2.username);
            monitor2Credentials = yield (0, users_helper_1.login)(monitor2.username, user_1.password);
            unit = yield (0, units_1.createUnit)(monitor1._id, monitor1.username, []);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return Promise.all([(0, users_helper_1.deleteUser)(monitor1), (0, users_helper_1.deleteUser)(monitor2), (0, units_1.deleteUnit)(unit)]); }));
        (0, mocha_1.it)('should fail creating department when providing an invalid property in the department unit object', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: { name: 'Fail-Test', enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
                departmentUnit: { invalidProperty: true },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        });
        (0, mocha_1.it)('should fail creating a department into an existing unit that a monitor does not supervise', () => __awaiter(void 0, void 0, void 0, function* () {
            const department = yield (0, rooms_1.createDepartment)(undefined, undefined, undefined, undefined, { _id: unit._id }, monitor2Credentials);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 0);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.not.have.property('parentId');
            (0, chai_1.expect)(fullDepartment).to.not.have.property('ancestors');
            yield (0, department_1.deleteDepartment)(department._id);
        }));
        (0, mocha_1.it)('should succesfully create a department into an existing unit as an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const department = yield (0, rooms_1.createDepartment)(undefined, undefined, undefined, undefined, { _id: unit._id });
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
            yield (0, department_1.deleteDepartment)(department._id);
        }));
        (0, mocha_1.it)('should succesfully create a department into an existing unit that a monitor supervises', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const department = yield (0, rooms_1.createDepartment)(undefined, undefined, undefined, undefined, { _id: unit._id }, monitor1Credentials);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
            yield (0, department_1.deleteDepartment)(department._id);
        }));
        (0, mocha_1.it)('unit should end up with 0 departments after removing all of them', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 0);
        }));
    });
    (0, mocha_1.describe)('[PUT] livechat/department', () => {
        let monitor1;
        let monitor1Credentials;
        let monitor2;
        let monitor2Credentials;
        let unit;
        let department;
        let baseDepartment;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            monitor1 = yield (0, users_helper_1.createUser)();
            monitor2 = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(monitor1.username);
            monitor1Credentials = yield (0, users_helper_1.login)(monitor1.username, user_1.password);
            yield (0, units_1.createMonitor)(monitor2.username);
            monitor2Credentials = yield (0, users_helper_1.login)(monitor2.username, user_1.password);
            department = yield (0, rooms_1.createDepartment)();
            baseDepartment = yield (0, rooms_1.createDepartment)();
            unit = yield (0, units_1.createUnit)(monitor1._id, monitor1.username, [baseDepartment._id]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return Promise.all([
                (0, users_helper_1.deleteUser)(monitor1),
                (0, users_helper_1.deleteUser)(monitor2),
                (0, units_1.deleteUnit)(unit),
                (0, department_1.deleteDepartment)(department._id),
                (0, department_1.deleteDepartment)(baseDepartment._id),
            ]);
        }));
        (0, mocha_1.it)("should fail updating a department's unit when providing an invalid property in the department unit object", () => {
            const updatedName = 'updated-department-name';
            return api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .send({
                department: { name: updatedName, enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
                departmentUnit: { invalidProperty: true },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Match error: Unknown key in field departmentUnit.invalidProperty');
            });
        });
        (0, mocha_1.it)("should fail updating a department's unit when providing an invalid _id type in the department unit object", () => {
            const updatedName = 'updated-department-name';
            return api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .send({
                department: { name: updatedName, enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
                departmentUnit: { _id: true },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Match error: Expected string, got boolean in field departmentUnit._id');
            });
        });
        (0, mocha_1.it)('should fail removing the last department from a unit', () => {
            const updatedName = 'updated-department-name';
            return api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${baseDepartment._id}`))
                .set(api_data_1.credentials)
                .send({
                department: { name: updatedName, enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
                departmentUnit: {},
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-unit-cant-be-empty');
            });
        });
        (0, mocha_1.it)('should succesfully add an existing department to a unit as an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const updatedName = 'updated-department-name';
            const updatedDepartment = yield (0, rooms_1.updateDepartment)({
                userCredentials: api_data_1.credentials,
                departmentId: department._id,
                name: updatedName,
                departmentUnit: { _id: unit._id },
            });
            (0, chai_1.expect)(updatedDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(updatedDepartment).to.have.property('type', 'd');
            (0, chai_1.expect)(updatedDepartment).to.have.property('_id', department._id);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
        (0, mocha_1.it)('should succesfully remove an existing department from a unit as an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedName = 'updated-department-name';
            const updatedDepartment = yield (0, rooms_1.updateDepartment)({
                userCredentials: api_data_1.credentials,
                departmentId: department._id,
                name: updatedName,
                departmentUnit: {},
            });
            (0, chai_1.expect)(updatedDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(updatedDepartment).to.have.property('type', 'd');
            (0, chai_1.expect)(updatedDepartment).to.have.property('_id', department._id);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId').that.is.null;
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.null;
        }));
        (0, mocha_1.it)('should fail adding a department into an existing unit that a monitor does not supervise', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedName = 'updated-department-name2';
            const updatedDepartment = yield (0, rooms_1.updateDepartment)({
                userCredentials: monitor2Credentials,
                departmentId: department._id,
                name: updatedName,
                departmentUnit: { _id: unit._id },
            });
            (0, chai_1.expect)(updatedDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(updatedDepartment).to.have.property('type', 'd');
            (0, chai_1.expect)(updatedDepartment).to.have.property('_id', department._id);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId').that.is.null;
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.null;
        }));
        (0, mocha_1.it)('should succesfully add a department into an existing unit that a monitor supervises', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const updatedName = 'updated-department-name3';
            const updatedDepartment = yield (0, rooms_1.updateDepartment)({
                userCredentials: monitor1Credentials,
                departmentId: department._id,
                name: updatedName,
                departmentUnit: { _id: unit._id },
            });
            (0, chai_1.expect)(updatedDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(updatedDepartment).to.have.property('type', 'd');
            (0, chai_1.expect)(updatedDepartment).to.have.property('_id', department._id);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
        (0, mocha_1.it)('should fail removing a department from a unit that a monitor does not supervise', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const updatedName = 'updated-department-name4';
            const updatedDepartment = yield (0, rooms_1.updateDepartment)({
                userCredentials: monitor2Credentials,
                departmentId: department._id,
                name: updatedName,
                departmentUnit: {},
            });
            (0, chai_1.expect)(updatedDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(updatedDepartment).to.have.property('type', 'd');
            (0, chai_1.expect)(updatedDepartment).to.have.property('_id', department._id);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
        (0, mocha_1.it)('should succesfully remove a department from a unit that a monitor supervises', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedName = 'updated-department-name5';
            const updatedDepartment = yield (0, rooms_1.updateDepartment)({
                userCredentials: monitor1Credentials,
                departmentId: department._id,
                name: updatedName,
                departmentUnit: {},
            });
            (0, chai_1.expect)(updatedDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(updatedDepartment).to.have.property('type', 'd');
            (0, chai_1.expect)(updatedDepartment).to.have.property('_id', department._id);
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(department._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('name', updatedName);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId').that.is.null;
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.null;
        }));
    });
    (0, mocha_1.describe)('[POST] livechat:saveDepartment', () => {
        let monitor1;
        let monitor1Credentials;
        let monitor2;
        let monitor2Credentials;
        let unit;
        const departmentName = 'Test-Department-Livechat-Method';
        let testDepartmentId = '';
        let baseDepartment;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            monitor1 = yield (0, users_helper_1.createUser)();
            monitor2 = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(monitor1.username);
            monitor1Credentials = yield (0, users_helper_1.login)(monitor1.username, user_1.password);
            yield (0, units_1.createMonitor)(monitor2.username);
            monitor2Credentials = yield (0, users_helper_1.login)(monitor2.username, user_1.password);
            baseDepartment = yield (0, rooms_1.createDepartment)();
            unit = yield (0, units_1.createUnit)(monitor1._id, monitor1.username, [baseDepartment._id]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return Promise.all([
                (0, users_helper_1.deleteUser)(monitor1),
                (0, users_helper_1.deleteUser)(monitor2),
                (0, units_1.deleteUnit)(unit),
                (0, department_1.deleteDepartment)(testDepartmentId),
                (0, department_1.deleteDepartment)(baseDepartment._id),
            ]);
        }));
        (0, mocha_1.it)('should fail creating department when providing an invalid _id type in the department unit object', () => {
            return api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:saveDepartment'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:saveDepartment',
                    params: [
                        '',
                        { name: 'Fail-Test', enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
                        [],
                        { _id: true },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.property('errorType', 'Meteor.Error');
                (0, chai_1.expect)(data.error).to.have.property('error', 'error-invalid-department-unit');
            });
        });
        (0, mocha_1.it)('should fail removing last department from unit', () => {
            return api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:saveDepartment'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:saveDepartment',
                    params: [
                        baseDepartment._id,
                        { name: 'Fail-Test', enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
                        [],
                        {},
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.property('errorType', 'Meteor.Error');
                (0, chai_1.expect)(data.error).to.have.property('error', 'error-unit-cant-be-empty');
            });
        });
        (0, mocha_1.it)('should fail creating a department into an existing unit that a monitor does not supervise', () => __awaiter(void 0, void 0, void 0, function* () {
            const departmentName = 'Fail-Test';
            const department = yield (0, department_1.createDepartmentWithMethod)({
                userCredentials: monitor2Credentials,
                name: departmentName,
                departmentUnit: { _id: unit._id },
            });
            testDepartmentId = department._id;
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.not.have.property('parentId');
            (0, chai_1.expect)(fullDepartment).to.not.have.property('ancestors');
            yield (0, department_1.deleteDepartment)(testDepartmentId);
        }));
        (0, mocha_1.it)('should succesfully create a department into an existing unit as an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const testDepartment = yield (0, department_1.createDepartmentWithMethod)({ name: departmentName, departmentUnit: { _id: unit._id } });
            testDepartmentId = testDepartment._id;
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
        (0, mocha_1.it)('should succesfully remove an existing department from a unit as an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.createDepartmentWithMethod)({ name: departmentName, departmentUnit: {}, departmentId: testDepartmentId });
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId').that.is.null;
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.null;
        }));
        (0, mocha_1.it)('should succesfully add an existing department to a unit as an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, department_1.createDepartmentWithMethod)({ name: departmentName, departmentUnit: { _id: unit._id }, departmentId: testDepartmentId });
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
        (0, mocha_1.it)('should succesfully remove a department from a unit that a monitor supervises', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.createDepartmentWithMethod)({
                name: departmentName,
                departmentUnit: {},
                departmentId: testDepartmentId,
                userCredentials: monitor1Credentials,
            });
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 1);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId').that.is.null;
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.null;
        }));
        (0, mocha_1.it)('should succesfully add an existing department to a unit that a monitor supervises', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, department_1.createDepartmentWithMethod)({
                name: departmentName,
                departmentUnit: { _id: unit._id },
                departmentId: testDepartmentId,
                userCredentials: monitor1Credentials,
            });
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
        (0, mocha_1.it)('should fail removing a department from a unit that a monitor does not supervise', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, department_1.createDepartmentWithMethod)({
                name: departmentName,
                departmentUnit: {},
                departmentId: testDepartmentId,
                userCredentials: monitor2Credentials,
            });
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
            yield (0, department_1.deleteDepartment)(testDepartmentId);
        }));
        (0, mocha_1.it)('should succesfully create a department in a unit that a monitor supervises', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const testDepartment = yield (0, department_1.createDepartmentWithMethod)({
                name: departmentName,
                departmentUnit: { _id: unit._id },
                userCredentials: monitor1Credentials,
            });
            testDepartmentId = testDepartment._id;
            const updatedUnit = yield (0, units_1.getUnit)(unit._id);
            (0, chai_1.expect)(updatedUnit).to.have.property('name', unit.name);
            (0, chai_1.expect)(updatedUnit).to.have.property('numMonitors', 1);
            (0, chai_1.expect)(updatedUnit).to.have.property('numDepartments', 2);
            const fullDepartment = yield (0, department_1.getDepartmentById)(testDepartmentId);
            (0, chai_1.expect)(fullDepartment).to.have.property('parentId', unit._id);
            (0, chai_1.expect)(fullDepartment).to.have.property('ancestors').that.is.an('array').with.lengthOf(1);
            (0, chai_1.expect)((_a = fullDepartment.ancestors) === null || _a === void 0 ? void 0 : _a[0]).to.equal(unit._id);
        }));
    });
});
