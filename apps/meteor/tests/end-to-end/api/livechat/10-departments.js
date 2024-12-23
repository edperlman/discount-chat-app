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
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const department_1 = require("../../../data/livechat/department");
const rooms_1 = require("../../../data/livechat/rooms");
const units_1 = require("../../../data/livechat/units");
const permissions_helper_1 = require("../../../data/permissions.helper");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe.skip : mocha_1.describe)('LIVECHAT - Departments[CE]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
        yield (0, permissions_helper_1.updateSetting)('Omnichannel_enable_department_removal', true);
    }));
    // Remove departments that may have been created before
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/department')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
        try {
            for (var _d = true, _e = __asyncValues(body.departments), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const department = _c;
                yield (0, department_1.deleteDepartment)(department._id);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }));
    let departmentId;
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, department_1.deleteDepartment)(departmentId);
    }));
    (0, mocha_1.it)('should create a new department', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield api_data_1.request
            .post((0, api_data_1.api)('livechat/department'))
            .set(api_data_1.credentials)
            .send({
            department: {
                name: 'Test',
                enabled: true,
                showOnOfflineForm: true,
                showOnRegistration: true,
                email: 'bla@bla',
                allowReceiveForwardOffline: true,
            },
        })
            .expect('Content-Type', 'application/json')
            .expect(200);
        (0, chai_1.expect)(body).to.have.property('success', true);
        (0, chai_1.expect)(body).to.have.property('department');
        (0, chai_1.expect)(body.department).to.have.property('_id');
        (0, chai_1.expect)(body.department).to.have.property('name', 'Test');
        (0, chai_1.expect)(body.department).to.have.property('enabled', true);
        (0, chai_1.expect)(body.department).to.have.property('showOnOfflineForm', true);
        (0, chai_1.expect)(body.department).to.have.property('showOnRegistration', true);
        (0, chai_1.expect)(body.department).to.have.property('allowReceiveForwardOffline', true);
        departmentId = body.department._id;
    }));
    (0, mocha_1.it)('should not create a 2nd department', () => {
        return api_data_1.request
            .post((0, api_data_1.api)('livechat/department'))
            .set(api_data_1.credentials)
            .send({ department: { name: 'Test', enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' } })
            .expect('Content-Type', 'application/json')
            .expect(400);
    });
    (0, mocha_1.it)('should return a list of 1 department', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/department')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
        (0, chai_1.expect)(body).to.have.property('success', true);
        (0, chai_1.expect)(body).to.have.property('departments');
        (0, chai_1.expect)(body.departments).to.be.an('array');
        (0, chai_1.expect)(body.departments).to.have.lengthOf(1);
    }));
});
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('LIVECHAT - Departments', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
        yield (0, permissions_helper_1.updateSetting)('Omnichannel_enable_department_removal', true);
    }));
    (0, mocha_1.describe)('GET livechat/department', () => {
        (0, mocha_1.it)('should return unauthorized error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', []);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/department')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return a list of departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments');
                (0, chai_1.expect)(res.body.departments).to.be.an('array');
                (0, chai_1.expect)(res.body.departments).to.have.length.of.at.least(0);
            });
        }));
        (0, mocha_1.it)('should reject invalid pagination params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .query({ count: 'invalid' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return a list of paginated departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .query({ count: 1, offset: 0 })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments');
                (0, chai_1.expect)(res.body.departments).to.be.an('array');
                (0, chai_1.expect)(res.body.departments).to.have.lengthOf(1);
            });
        }));
        (0, mocha_1.it)('should sort list alphabetically following mongodb default sort (no collation)', () => __awaiter(void 0, void 0, void 0, function* () {
            const department1 = yield (0, rooms_1.createDepartment)(undefined, 'A test');
            const department2 = yield (0, rooms_1.createDepartment)(undefined, 'a test');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .query({ count: 2, offset: 0, text: 'test' })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments');
                (0, chai_1.expect)(res.body.departments).to.be.an('array');
                (0, chai_1.expect)(res.body.departments).to.have.lengthOf(2);
                (0, chai_1.expect)(res.body.departments[0]).to.have.property('_id', department1._id);
                (0, chai_1.expect)(res.body.departments[1]).to.have.property('_id', department2._id);
            });
            yield (0, department_1.deleteDepartment)(department1._id);
            yield (0, department_1.deleteDepartment)(department2._id);
        }));
        (0, mocha_1.it)('should return a list of departments matching name', () => __awaiter(void 0, void 0, void 0, function* () {
            const department1 = yield (0, rooms_1.createDepartment)(undefined, 'A test 123');
            const department2 = yield (0, rooms_1.createDepartment)(undefined, 'a test 456');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .query({ count: 2, offset: 0, text: 'A test 123' })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('departments');
                (0, chai_1.expect)(res.body.departments).to.be.an('array');
                (0, chai_1.expect)(res.body.departments).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.departments[0]).to.have.property('_id', department1._id);
                (0, chai_1.expect)(res.body.departments.find((dept) => dept._id === department2._id)).to.be.undefined;
            });
            yield (0, department_1.deleteDepartment)(department1._id);
            yield (0, department_1.deleteDepartment)(department2._id);
        }));
    });
    (0, mocha_1.describe)('POST livechat/departments', () => {
        (0, mocha_1.it)('should return unauthorized error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: { name: 'TestUnauthorized', enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' },
            })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when no keys are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({ department: {} })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if requestTagsBeforeClosing is true but no tags are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: 'Test',
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: 'bla@bla',
                    requestTagBeforeClosingChat: true,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if requestTagsBeforeClosing is true but tags are not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: 'Test',
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: 'bla@bla',
                    requestTagBeforeClosingChat: true,
                    chatClosingTags: 'not an array',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if fallbackForwardDepartment is present but is not a department id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: 'Test',
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: 'bla@bla',
                    fallbackForwardDepartment: 'not a department id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return an error if fallbackForwardDepartment is referencing a department that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: 'Test',
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: 'bla@bla',
                    fallbackForwardDepartment: 'not a department id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should create a new department', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({ department: { name: 'Test', enabled: true, showOnOfflineForm: true, showOnRegistration: true, email: 'bla@bla' } })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('department');
            (0, chai_1.expect)(body.department).to.have.property('_id');
            (0, chai_1.expect)(body.department).to.have.property('name', 'Test');
            (0, chai_1.expect)(body.department).to.have.property('enabled', true);
            (0, chai_1.expect)(body.department).to.have.property('showOnOfflineForm', true);
            (0, chai_1.expect)(body.department).to.have.property('showOnRegistration', true);
            yield (0, department_1.deleteDepartment)(body.department._id);
        }));
        (0, mocha_1.it)('should create a new disabled department', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department'))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: faker_1.faker.hacker.adjective(),
                    enabled: false,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: faker_1.faker.internet.email(),
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('department');
            (0, chai_1.expect)(body.department).to.have.property('_id');
            (0, chai_1.expect)(body.department).to.have.property('enabled', false);
            yield (0, department_1.deleteDepartment)(body.department._id);
        }));
    });
    (0, mocha_1.describe)('GET livechat/department/:_id', () => {
        (0, mocha_1.it)('should return unauthorized error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department/testetetetstetete'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        })).timeout(5000);
        (0, mocha_1.it)('should return an error when the department does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department/testesteteste'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('department');
                (0, chai_1.expect)(res.body.department).to.be.null;
            });
        })).timeout(5000);
        (0, mocha_1.it)('should return the department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            const department = yield (0, rooms_1.createDepartment)();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('department');
            (0, chai_1.expect)(body.department).to.have.property('_id');
            (0, chai_1.expect)(body.department).to.have.property('name', department.name);
            (0, chai_1.expect)(body.department).to.have.property('enabled', department.enabled);
            (0, chai_1.expect)(body.department).to.have.property('showOnOfflineForm', department.showOnOfflineForm);
            (0, chai_1.expect)(body.department).to.have.property('showOnRegistration', department.showOnRegistration);
            (0, chai_1.expect)(body.department).to.have.property('email', department.email);
            yield (0, department_1.deleteDepartment)(body.department._id);
        }));
    });
    (0, mocha_1.describe)('PUT livechat/departments/:_id', () => {
        let department;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            department = yield (0, rooms_1.createDepartment)();
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(department._id);
        }));
        (0, mocha_1.it)('should return an error if fallbackForwardDepartment points to same department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: faker_1.faker.hacker.adjective(),
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: faker_1.faker.internet.email(),
                    fallbackForwardDepartment: department._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if `agents` param is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: faker_1.faker.hacker.adjective(),
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: faker_1.faker.internet.email(),
                },
                agents: 'not an array',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw an error if user has permission to add agents and agents array has invalid format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('add-livechat-department-agents', ['admin']);
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: faker_1.faker.hacker.adjective(),
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: faker_1.faker.internet.email(),
                },
                agents: [{ notAValidKey: 'string' }],
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw an error if user has permission to add agents and agents array has invalid internal format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .send({
                department: {
                    name: faker_1.faker.hacker.adjective(),
                    enabled: true,
                    showOnOfflineForm: true,
                    showOnRegistration: true,
                    email: faker_1.faker.internet.email(),
                },
                agents: [{ upsert: [{ notAValidKey: 'string' }] }],
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
    });
    (0, mocha_1.describe)('DELETE livechat/department/:_id', () => {
        (0, mocha_1.it)('should return unauthorized error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', []);
            yield (0, permissions_helper_1.updatePermission)('remove-livechat-department', []);
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/department/testetetetstetete'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return an error when the department does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            const resp = yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/department/testesteteste'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(resp.body).to.have.property('success', false);
            (0, chai_1.expect)(resp.body).to.have.property('error', 'error-department-not-found');
        }));
        (0, mocha_1.it)('it should remove the department', () => __awaiter(void 0, void 0, void 0, function* () {
            const department = yield (0, rooms_1.createDepartment)();
            const resp = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(resp.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('it should remove the department and disassociate the rooms from it', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const newVisitor = yield (0, rooms_1.createVisitor)(department._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const resp = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(resp.body).to.have.property('success', true);
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom.departmentId).to.be.undefined;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('it should remove the department and disassociate the rooms from it which have its units', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const newVisitor = yield (0, rooms_1.createVisitor)(department._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const monitor = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(monitor.username);
            const unit = yield (0, units_1.createUnit)(monitor._id, monitor.username, [department._id]);
            // except the room to have the unit
            let latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom.departmentId).to.be.equal(department._id);
            (0, chai_1.expect)(latestRoom.departmentAncestors).to.be.an('array').that.includes(unit._id);
            const resp = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/department/${department._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(resp.body).to.have.property('success', true);
            latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom.departmentId).to.be.undefined;
            (0, chai_1.expect)(latestRoom.departmentAncestors).to.be.undefined;
            // cleanup
            yield (0, users_helper_1.deleteUser)(monitor);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('contd from above test case: if a unit has more than 1 dept, then it should not disassociate rooms from other dept when any one dept is removed', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department: department1 } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const newVisitor1 = yield (0, rooms_1.createVisitor)(department1._id);
            const newRoom1 = yield (0, rooms_1.createLivechatRoom)(newVisitor1.token);
            const { department: department2 } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const newVisitor2 = yield (0, rooms_1.createVisitor)(department2._id);
            const newRoom2 = yield (0, rooms_1.createLivechatRoom)(newVisitor2.token);
            const monitor = yield (0, users_helper_1.createUser)();
            yield (0, units_1.createMonitor)(monitor.username);
            const unit = yield (0, units_1.createUnit)(monitor._id, monitor.username, [department1._id, department2._id]);
            // except the room to have the unit
            let latestRoom1 = yield (0, rooms_1.getLivechatRoomInfo)(newRoom1._id);
            let latestRoom2 = yield (0, rooms_1.getLivechatRoomInfo)(newRoom2._id);
            (0, chai_1.expect)(latestRoom1.departmentId).to.be.equal(department1._id);
            (0, chai_1.expect)(latestRoom1.departmentAncestors).to.be.an('array').that.includes(unit._id);
            (0, chai_1.expect)(latestRoom2.departmentId).to.be.equal(department2._id);
            (0, chai_1.expect)(latestRoom2.departmentAncestors).to.be.an('array').that.includes(unit._id);
            const resp = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/department/${department1._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(resp.body).to.have.property('success', true);
            latestRoom1 = yield (0, rooms_1.getLivechatRoomInfo)(newRoom1._id);
            (0, chai_1.expect)(latestRoom1.departmentId).to.be.undefined;
            (0, chai_1.expect)(latestRoom1.departmentAncestors).to.be.undefined;
            latestRoom2 = yield (0, rooms_1.getLivechatRoomInfo)(newRoom2._id);
            (0, chai_1.expect)(latestRoom2.departmentId).to.be.equal(department2._id);
            (0, chai_1.expect)(latestRoom2.departmentAncestors).to.be.an('array').that.includes(unit._id);
            // cleanup
            yield (0, users_helper_1.deleteUser)(monitor);
        }));
    });
    (0, mocha_1.describe)('GET livechat/department.autocomplete', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', []);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/department.autocomplete')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an error when the query is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.autocomplete'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should return an error when the query is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.autocomplete'))
                .set(api_data_1.credentials)
                .query({ selector: '' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should return an error when the query is not a string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.autocomplete'))
                .set(api_data_1.credentials)
                .query({ selector: { name: 'test' } })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should return an error when selector is not valid JSON', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.autocomplete'))
                .set(api_data_1.credentials)
                .query({ selector: '{name: "test"' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should return a list of departments that match selector.term', () => __awaiter(void 0, void 0, void 0, function* () {
            // Convert to async/await
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            const department = yield (0, rooms_1.createDepartment)(undefined, 'test');
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.autocomplete'))
                .set(api_data_1.credentials)
                .query({ selector: '{"term":"test"}' })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('items');
            (0, chai_1.expect)(response.body.items).to.be.an('array');
            (0, chai_1.expect)(response.body.items).to.have.length.of.at.least(1);
            (0, chai_1.expect)(response.body.items[0]).to.have.property('_id');
            (0, chai_1.expect)(response.body.items[0]).to.have.property('name');
            yield (0, department_1.deleteDepartment)(department._id);
        }));
        (0, mocha_1.it)('should return a list of departments excluding the ids on selector.exceptions', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!constants_1.IS_EE) {
                    this.skip();
                }
                yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
                yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
                const dep1 = yield (0, rooms_1.createDepartment)();
                yield (0, rooms_1.createDepartment)();
                yield api_data_1.request
                    .get((0, api_data_1.api)('livechat/department.autocomplete'))
                    .set(api_data_1.credentials)
                    .query({ selector: `{"exceptions":["${dep1._id}"]}` })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('items');
                    (0, chai_1.expect)(res.body.items).to.be.an('array');
                    (0, chai_1.expect)(res.body.items).to.have.length.of.at.least(1);
                    (0, chai_1.expect)(res.body.items[0]).to.have.property('_id');
                    (0, chai_1.expect)(res.body.items[0]).to.have.property('name');
                    (0, chai_1.expect)(res.body.items.every((department) => department._id !== dep1._id)).to.be.true;
                });
            });
        });
    });
    (0, mocha_1.describe)('GET livechat/departments.listByIds', () => {
        (0, mocha_1.it)('should throw an error if the user doesnt have the permission to view the departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', []);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/department.listByIds')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an error when the query is not present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.listByIds'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)('should return an error when the query is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department.listByIds'))
                .set(api_data_1.credentials)
                .query({ ids: 'test' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
    });
    (0, mocha_1.describe)('GET livechat/department/:departmentId/agents', () => {
        (0, mocha_1.it)('should throw an error if the user doesnt have the permission to view the departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', []);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/department/test/agents')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an empty array when the departmentId is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/department/test/agents'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('agents');
                (0, chai_1.expect)(res.body.agents).to.be.an('array');
                (0, chai_1.expect)(res.body.agents).to.have.lengthOf(0);
                (0, chai_1.expect)(res.body.total).to.be.equal(0);
            });
        }));
        (0, mocha_1.it)('should return an emtpy array for a department without agents', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            const dep = yield (0, rooms_1.createDepartment)();
            const res = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/department/${dep._id}/agents`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('agents');
            (0, chai_1.expect)(res.body.agents).to.be.an('array');
            (0, chai_1.expect)(res.body.agents).to.have.lengthOf(0);
            (0, chai_1.expect)(res.body.total).to.be.equal(0);
            yield (0, department_1.deleteDepartment)(dep._id);
        }));
        (0, mocha_1.it)('should return the agents of the department', () => __awaiter(void 0, void 0, void 0, function* () {
            // convert to async await
            yield (0, permissions_helper_1.updatePermission)('view-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            const agent = yield (0, rooms_1.createAgent)();
            const dep = yield (0, rooms_1.createDepartment)([{ agentId: agent._id }]);
            const res = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/department/${dep._id}/agents`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('agents');
            (0, chai_1.expect)(res.body.agents).to.be.an('array');
            (0, chai_1.expect)(res.body.agents).to.have.lengthOf(1);
            (0, chai_1.expect)(res.body.agents[0]).to.have.property('_id');
            (0, chai_1.expect)(res.body.agents[0]).to.have.property('departmentId', dep._id);
            (0, chai_1.expect)(res.body.agents[0]).to.have.property('departmentEnabled', true);
            (0, chai_1.expect)(res.body.count).to.be.equal(1);
            yield (0, department_1.deleteDepartment)(dep._id);
        }));
    });
    (0, mocha_1.describe)('POST livechat/department/:departmentId/agents', () => {
        (0, mocha_1.it)('should throw an error if the user doesnt have the permission to manage the departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', []);
            yield (0, permissions_helper_1.updatePermission)('add-livechat-department-agents', []);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/department/test/agents')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should throw an error if the departmentId is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('add-livechat-department-agents', ['admin', 'livechat-manager']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/department/test/agents'))
                .set(api_data_1.credentials)
                .send({ upsert: [], remove: [] })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Department not found [error-department-not-found]');
            });
        }));
        (0, mocha_1.it)('should throw an error if body doesnt contain { upsert: [], remove: [] }', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('add-livechat-department-agents', ['admin', 'livechat-manager']);
            const dep = yield (0, rooms_1.createDepartment)();
            const res = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/department/${dep._id}/agents`))
                .set(api_data_1.credentials)
                .expect(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', "Match error: Missing key 'upsert'");
            yield (0, department_1.deleteDepartment)(dep._id);
        }));
        (0, mocha_1.it)('should throw an error if upsert or remove in body doesnt contain agentId and username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('add-livechat-department-agents', ['admin', 'livechat-manager']);
            const dep = yield (0, rooms_1.createDepartment)();
            const res = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/department/${dep._id}/agents`))
                .set(api_data_1.credentials)
                .send({ upsert: [{}], remove: [] })
                .expect(400);
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', "Match error: Missing key 'agentId' in field upsert[0]");
            yield (0, department_1.deleteDepartment)(dep._id);
        }));
        (0, mocha_1.it)('should sucessfully add an agent to a department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('add-livechat-department-agents', ['admin', 'livechat-manager']);
            const [dep, agent] = yield Promise.all([(0, rooms_1.createDepartment)(), (0, rooms_1.createAgent)()]);
            const res = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/department/${dep._id}/agents`))
                .set(api_data_1.credentials)
                .send({ upsert: [{ agentId: agent._id, username: agent.username }], remove: [] })
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            yield (0, department_1.deleteDepartment)(dep._id);
        }));
    });
    (0, mocha_1.describe)('Department archivation', () => {
        let departmentForTest;
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/department/123/archive')).expect(401);
        }));
        (0, mocha_1.it)('should fail if user doesnt have manage-livechat-departments permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', []);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/department/123/archive')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should fail if departmentId is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/department/123/archive')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should archive a department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-departments', ['admin']);
            const department = yield (0, rooms_1.createDepartment)();
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/department/${department._id}/archive`))
                .set(api_data_1.credentials)
                .expect(200);
            departmentForTest = department;
        }));
        (0, mocha_1.it)('should return a list of archived departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/departments/archived')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('departments');
            (0, chai_1.expect)(body.departments).to.be.an('array');
            (0, chai_1.expect)(body.departments[0]).to.have.property('_id', departmentForTest._id);
            (0, chai_1.expect)(body.departments.length).to.be.equal(1);
        }));
        (0, mocha_1.it)('should unarchive a department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/department/${departmentForTest._id}/unarchive`))
                .set(api_data_1.credentials)
                .expect(200);
        }));
    });
});
