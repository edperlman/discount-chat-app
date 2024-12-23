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
const faker_1 = require("@faker-js/faker");
const core_typings_1 = require("@rocket.chat/core-typings");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const department_1 = require("../../../data/livechat/department");
const inquiries_1 = require("../../../data/livechat/inquiries");
const priorities_1 = require("../../../data/livechat/priorities");
const rooms_1 = require("../../../data/livechat/rooms");
const permissions_helper_1 = require("../../../data/permissions.helper");
const constants_1 = require("../../../e2e/config/constants");
const sla_1 = require("../../../e2e/utils/omnichannel/sla");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] LIVECHAT - Priorities & SLAs', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.addPermissions)({
            'manage-livechat-priorities': ['admin', 'livechat-manager'],
            'manage-livechat-sla': ['admin', 'livechat-manager'],
            'view-l-room': ['admin', 'livechat-manager', 'livechat-agent'],
        });
    }));
    (0, mocha_1.describe)('livechat/sla', () => {
        // GET
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission for [GET] livechat/sla endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissions)(['manage-livechat-sla', 'view-l-room']);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/sla')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of slas', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.addPermissions)({
                'manage-livechat-sla': ['admin', 'livechat-manager'],
                'view-l-room': ['livechat-agent', 'admin', 'livechat-manager'],
            });
            const sla = yield (0, priorities_1.createSLA)();
            (0, chai_1.expect)(sla).to.not.be.undefined;
            (0, chai_1.expect)(sla).to.have.property('_id');
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/sla')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.sla).to.be.an('array').with.lengthOf.greaterThan(0);
            const current = response.body.sla.find((p) => p && (p === null || p === void 0 ? void 0 : p._id) === sla._id);
            (0, chai_1.expect)(current).to.be.an('object');
            (0, chai_1.expect)(current).to.have.property('name', sla.name);
            (0, chai_1.expect)(current).to.have.property('description', sla.description);
            (0, chai_1.expect)(current).to.have.property('dueTimeInMinutes', sla.dueTimeInMinutes);
            yield (0, priorities_1.deleteSLA)(sla._id);
        }));
        // POST
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission for [POST] livechat/sla endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-sla', []);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/sla'))
                .set(api_data_1.credentials)
                .send((0, sla_1.generateRandomSLAData)())
                .expect('Content-Type', 'application/json')
                .expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should create a new sla', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('manage-livechat-sla');
            const sla = (0, sla_1.generateRandomSLAData)();
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/sla'))
                .set(api_data_1.credentials)
                .send(sla)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.sla).to.be.an('object');
            (0, chai_1.expect)(response.body.sla).to.have.property('_id');
            (0, chai_1.expect)(response.body.sla).to.have.property('name', sla.name);
            (0, chai_1.expect)(response.body.sla).to.have.property('description', sla.description);
            (0, chai_1.expect)(response.body.sla).to.have.property('dueTimeInMinutes', sla.dueTimeInMinutes);
            yield (0, priorities_1.deleteSLA)(response.body.sla._id);
        }));
        (0, mocha_1.it)('should throw an error when trying to create a duplicate sla with same dueTimeInMinutes', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const firstSla = (0, sla_1.generateRandomSLAData)();
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/sla'))
                .set(api_data_1.credentials)
                .send(firstSla)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            const secondSla = (0, sla_1.generateRandomSLAData)();
            secondSla.dueTimeInMinutes = firstSla.dueTimeInMinutes;
            const secondResponse = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/sla'))
                .set(api_data_1.credentials)
                .send(secondSla)
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(secondResponse.body).to.have.property('success', false);
            (0, chai_1.expect)(secondResponse.body).to.have.property('error');
            (0, chai_1.expect)((_a = secondResponse.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-duplicated-sla');
            yield (0, priorities_1.deleteSLA)(response.body.sla._id);
        }));
        (0, mocha_1.it)('should throw an error when trying to create a duplicate sla with same name', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const firstSla = (0, sla_1.generateRandomSLAData)();
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/sla'))
                .set(api_data_1.credentials)
                .send(firstSla)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            const secondSla = (0, sla_1.generateRandomSLAData)();
            secondSla.name = firstSla.name;
            const secondResponse = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/sla'))
                .set(api_data_1.credentials)
                .send(secondSla)
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(secondResponse.body).to.have.property('success', false);
            (0, chai_1.expect)(secondResponse.body).to.have.property('error');
            (0, chai_1.expect)((_a = secondResponse.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-duplicated-sla');
            yield (0, priorities_1.deleteSLA)(response.body.sla._id);
        }));
    });
    (0, mocha_1.describe)('livechat/sla/:slaId', () => {
        // GET
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission for [GET] livechat/sla/:slaId endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([(0, permissions_helper_1.removePermissionFromAllRoles)('manage-livechat-sla'), (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room')]);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/sla/123')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should create, find and delete an sla', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([(0, permissions_helper_1.restorePermissionToRoles)('manage-livechat-sla'), (0, permissions_helper_1.restorePermissionToRoles)('view-l-room')]);
            const sla = yield (0, priorities_1.createSLA)();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/sla/${sla._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.be.an('object');
            (0, chai_1.expect)(response.body._id).to.be.equal(sla._id);
            yield (0, priorities_1.deleteSLA)(sla._id);
        }));
        // PUT
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission for [PUT] livechat/sla/:slaId endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('manage-livechat-sla');
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/sla/123'))
                .set(api_data_1.credentials)
                .send((0, sla_1.generateRandomSLAData)())
                .expect('Content-Type', 'application/json')
                .expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should update an sla', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('manage-livechat-sla');
            const sla = yield (0, priorities_1.createSLA)();
            const newSlaData = (0, sla_1.generateRandomSLAData)();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/sla/${sla._id}`))
                .set(api_data_1.credentials)
                .send(newSlaData)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.sla).to.be.an('object');
            (0, chai_1.expect)(response.body.sla).to.have.property('_id');
            (0, chai_1.expect)(response.body.sla).to.have.property('name', newSlaData.name);
            (0, chai_1.expect)(response.body.sla).to.have.property('description', newSlaData.description);
            (0, chai_1.expect)(response.body.sla).to.have.property('dueTimeInMinutes', newSlaData.dueTimeInMinutes);
            yield (0, priorities_1.deleteSLA)(response.body.sla._id);
        }));
        (0, mocha_1.it)('should throw an error when trying to update a sla with a duplicate name', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const firstSla = yield (0, priorities_1.createSLA)();
            const secondSla = yield (0, priorities_1.createSLA)();
            secondSla.name = firstSla.name;
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/sla/${secondSla._id}`))
                .set(api_data_1.credentials)
                .send({
                name: secondSla.name,
                description: secondSla.description,
                dueTimeInMinutes: secondSla.dueTimeInMinutes,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-duplicated-sla');
            yield (0, priorities_1.deleteSLA)(firstSla._id);
            yield (0, priorities_1.deleteSLA)(secondSla._id);
        }));
        (0, mocha_1.it)('should throw an error when trying to update a sla with a duplicate dueTimeInMinutes', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const firstSla = yield (0, priorities_1.createSLA)();
            const secondSla = yield (0, priorities_1.createSLA)();
            secondSla.dueTimeInMinutes = firstSla.dueTimeInMinutes;
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/sla/${secondSla._id}`))
                .set(api_data_1.credentials)
                .send({
                name: secondSla.name,
                description: secondSla.description,
                dueTimeInMinutes: secondSla.dueTimeInMinutes,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-duplicated-sla');
            yield (0, priorities_1.deleteSLA)(firstSla._id);
            yield (0, priorities_1.deleteSLA)(secondSla._id);
        }));
        // DELETE
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission for [DELETE] livechat/sla/:slaId endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-sla', []);
            const response = yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/sla/123'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should delete an sla', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-sla', ['admin', 'livechat-manager']);
            const sla = yield (0, priorities_1.createSLA)();
            const response = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/sla/${sla._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
    });
    (0, mocha_1.describe)('livechat/inquiry.setSLA', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissions)(['manage-livechat-sla', 'view-l-room', 'manage-livechat-priorities']);
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                roomId: '123',
                sla: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if roomId is not in request body', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.addPermissions)({
                'manage-livechat-sla': ['admin', 'livechat-manager'],
                'manage-livechat-priorities': ['admin', 'livechat-manager'],
                'view-l-room': ['livechat-agent', 'admin', 'livechat-manager'],
            });
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                sla: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                roomId: '123',
                sla: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if sla is not in request body', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                roomId: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if sla is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.createAgent)();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
                sla: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should fail if inquiry is not queued', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                roomId,
                sla: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should prioritize an inquiry', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const sla = yield (0, priorities_1.createSLA)();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/inquiry.setSLA'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
                sla: sla._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
    });
    (0, mocha_1.describe)('livechat/priorities', () => {
        let priority;
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissions)(['manage-livechat-priorities', 'view-l-room']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return an array of priorities', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.addPermissions)({
                'manage-livechat-priorities': ['admin', 'livechat-manager'],
                'view-l-room': ['livechat-agent', 'admin', 'livechat-manager'],
            });
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.priorities).to.be.an('array');
            (0, chai_1.expect)(response.body.priorities).to.have.lengthOf(5);
            (0, chai_1.expect)(response.body.priorities[0]).to.have.property('_id');
            (0, chai_1.expect)(response.body.priorities[0]).to.have.property('i18n');
            (0, chai_1.expect)(response.body.priorities[0]).to.have.property('dirty');
            priority = response.body.priorities[0];
        }));
        (0, mocha_1.it)('should return an array of priorities matching text param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities'))
                .set(api_data_1.credentials)
                .query({
                text: priority.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.priorities).to.be.an('array');
            (0, chai_1.expect)(response.body.priorities).to.have.length.greaterThan(0);
            (0, chai_1.expect)(response.body.priorities[0]).to.have.property('_id');
        }));
    });
    (0, mocha_1.describe)('livechat/priorities/:priorityId', () => {
        let priority;
        const name = faker_1.faker.lorem.word();
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, permissions_helper_1.removePermissions)(['manage-livechat-priorities', 'view-l-room']);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities/123')).set(api_data_1.credentials).expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-unauthorized');
        }));
        (0, mocha_1.it)('should return a priority by id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.addPermissions)({
                'manage-livechat-priorities': ['admin', 'livechat-manager'],
                'view-l-room': ['livechat-agent', 'admin', 'livechat-manager'],
            });
            const { body: { priorities }, } = yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            priority = priorities[0];
            const response = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.be.an('object');
            (0, chai_1.expect)(response.body._id).to.be.equal(priority._id);
        }));
        (0, mocha_1.it)('should throw 404 when priority does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities/123')).set(api_data_1.credentials).expect(404);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should update a priority when using PUT', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should return dirty: true after a priority has been updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('dirty', true);
        }));
        (0, mocha_1.it)('should return an array of priorities matching text param', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities'))
                .set(api_data_1.credentials)
                .query({
                text: name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.priorities).to.be.an('array');
            (0, chai_1.expect)(response.body.priorities).to.have.length.greaterThan(0);
            const pos = response.body.priorities.findIndex((p) => p._id === priority._id);
            (0, chai_1.expect)(pos).to.be.greaterThan(-1);
            (0, chai_1.expect)(response.body.priorities[pos]).to.have.property('_id');
            (0, chai_1.expect)(response.body.priorities[pos]).to.have.property('i18n', priority.i18n);
        }));
        (0, mocha_1.it)('should edit a priority with a PUT', () => __awaiter(void 0, void 0, void 0, function* () {
            const newName = faker_1.faker.lorem.word();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                name: newName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            const newPriorityResponse = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(newPriorityResponse.body).to.have.property('success', true);
            (0, chai_1.expect)(newPriorityResponse.body).to.have.property('dirty', true);
            (0, chai_1.expect)(newPriorityResponse.body).to.have.property('name', newName);
        }));
        (0, mocha_1.it)('should fail to edit a priority with a PUT if using too many parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const newName = faker_1.faker.lorem.word();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                name: newName,
                reset: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('invalid-params');
        }));
        (0, mocha_1.it)('should fail to edit a priority with a PUT if using an object as name', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const newName = faker_1.faker.lorem.word();
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                name: { name: newName },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('invalid-params');
        }));
        (0, mocha_1.it)('should not fail to edit a priority with a PUT if using a boolean as name (it becomes a string)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                name: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should fail to update a non-existing priority', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/priorities/123'))
                .set(api_data_1.credentials)
                .send({
                name: faker_1.faker.lorem.word(),
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should reset a single priority with a reset:true PUT parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                reset: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            const newPriorityResponse = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(newPriorityResponse.body).to.have.property('success', true);
            (0, chai_1.expect)(newPriorityResponse.body).to.have.property('dirty', false);
            (0, chai_1.expect)(newPriorityResponse.body).to.not.have.property('name');
        }));
        (0, mocha_1.it)('should throw a duplicate error incase there is already a priority with same name', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body: { priorities }, } = yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            // change name of first priority to a random name
            const newName = faker_1.faker.lorem.word();
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priorities[0]._id}`))
                .set(api_data_1.credentials)
                .send({ name: newName })
                .expect('Content-Type', 'application/json')
                .expect(200);
            // change name of second priority to the name of first priority and expect error
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priorities[1]._id}`))
                .set(api_data_1.credentials)
                .send({ name: newName })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'error-duplicate-priority-name');
        }));
        (0, mocha_1.it)('should throw a duplicate error incase there is already a priority with same name (case insensitive)', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body: { priorities }, } = yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            // change name of first priority to a random name
            const newNameLowercase = faker_1.faker.lorem.word().toLowerCase();
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priorities[0]._id}`))
                .set(api_data_1.credentials)
                .send({ name: newNameLowercase })
                .expect('Content-Type', 'application/json')
                .expect(200);
            // change name of second priority to the name of first priority in different case and expect error
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priorities[1]._id}`))
                .set(api_data_1.credentials)
                .send({ name: newNameLowercase.toUpperCase() })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'error-duplicate-priority-name');
        }));
    });
    (0, mocha_1.describe)('livechat/priorities.reset', () => {
        let priority;
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-priorities', []);
            const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/priorities.reset')).set(api_data_1.credentials).expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-unauthorized');
        }));
        (0, mocha_1.it)('should respond reset:true when a priority has been changed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-priorities', ['admin', 'livechat-manager']);
            const { body: { priorities }, } = yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            priority = priorities[0];
            priority.name = faker_1.faker.lorem.word();
            const responseChange = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .send({
                name: priority.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(responseChange.body).to.have.property('success', true);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities.reset'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('reset', true);
        }));
        (0, mocha_1.it)('should reset all priorities', () => __awaiter(void 0, void 0, void 0, function* () {
            const resetRespose = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/priorities.reset'))
                .set(api_data_1.credentials)
                .send()
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(resetRespose.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should return reset: false after all priorities have been reset', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities.reset'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('reset', false);
        }));
        (0, mocha_1.it)('should change the priority name and dirty status when reset', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/priorities/${priority._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('dirty', false);
            (0, chai_1.expect)(response.body).to.not.have.property('name');
        }));
        (0, mocha_1.it)('should change all priorities to their default', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.priorities).to.be.an('array');
            response.body.priorities.forEach((priority) => {
                (0, chai_1.expect)(priority).to.not.have.property('name');
                (0, chai_1.expect)(priority).to.have.property('dirty', false);
            });
        }));
        (0, mocha_1.it)('should fail to reset when lacking permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-priorities', []);
            const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/priorities.reset')).set(api_data_1.credentials).expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error');
            (0, chai_1.expect)((_a = response.body) === null || _a === void 0 ? void 0 : _a.error).to.contain('error-unauthorized');
        }));
    });
    (0, mocha_1.describe)('Inquiry queue sorting mechanism', () => {
        let omniRooms;
        let departmentWithAgent;
        let priorities;
        let slas;
        const hasSlaProps = (inquiry) => !!inquiry.estimatedWaitingTimeQueue && !!inquiry.slaId;
        const hasPriorityProps = (inquiry) => inquiry.priorityId !== undefined;
        const getPriorityOrderById = (id) => {
            const priority = priorities.find((priority) => priority._id === id);
            return (priority === null || priority === void 0 ? void 0 : priority.sortItem) || 0;
        };
        const sortBySLAProps = (inquiry1, inquiry2) => {
            if (hasSlaProps(inquiry1) || hasSlaProps(inquiry2)) {
                if (hasSlaProps(inquiry1) && hasSlaProps(inquiry2)) {
                    // if both inquiries have sla props, then sort by estimatedWaitingTimeQueue: 1
                    const estimatedWaitingTimeQueue1 = inquiry1.estimatedWaitingTimeQueue;
                    const estimatedWaitingTimeQueue2 = inquiry2.estimatedWaitingTimeQueue;
                    if (estimatedWaitingTimeQueue1 !== estimatedWaitingTimeQueue2) {
                        return estimatedWaitingTimeQueue1 - estimatedWaitingTimeQueue2;
                    }
                }
                if (hasSlaProps(inquiry1)) {
                    return -1;
                }
                if (hasSlaProps(inquiry2)) {
                    return 1;
                }
            }
            return 0;
        };
        const sortByPriorityProps = (inquiry1, inquiry2) => {
            if (hasPriorityProps(inquiry1) || hasPriorityProps(inquiry2)) {
                if (hasPriorityProps(inquiry1) && hasPriorityProps(inquiry2)) {
                    // if both inquiries have priority props, then sort by priorityId: 1
                    return getPriorityOrderById(inquiry1.priorityId) - getPriorityOrderById(inquiry2.priorityId);
                }
                if (hasPriorityProps(inquiry1)) {
                    return -1;
                }
                if (hasPriorityProps(inquiry2)) {
                    return 1;
                }
            }
            return 0;
        };
        // this should sort using logic - { ts: 1 }
        const sortByTimestamp = (inquiry1, inquiry2) => {
            return new Date(inquiry1.ts).getTime() - new Date(inquiry2.ts).getTime();
        };
        // this should sort using logic - { priorityWeight: 1, ts: 1 }
        const sortByPriority = (inquiry1, inquiry2) => {
            const priorityPropsSort = sortByPriorityProps(inquiry1, inquiry2);
            if (priorityPropsSort !== 0) {
                return priorityPropsSort;
            }
            return sortByTimestamp(inquiry1, inquiry2);
        };
        // this should sort using logic - { estimatedWaitingTimeQueue: 1, ts: 1 }
        const sortBySLA = (inquiry1, inquiry2) => {
            const slaPropsSort = sortBySLAProps(inquiry1, inquiry2);
            if (slaPropsSort !== 0) {
                return slaPropsSort;
            }
            return sortByTimestamp(inquiry1, inquiry2);
        };
        const filterUnnecessaryProps = (inquiries) => inquiries.map((inquiry) => {
            return Object.assign(Object.assign(Object.assign({ _id: inquiry._id, rid: inquiry.rid }, (hasPriorityProps(inquiry) && {
                priority: {
                    priorityWeight: getPriorityOrderById(inquiry.priorityId),
                    id: inquiry.priorityWeight,
                },
            })), (hasSlaProps(inquiry) && {
                sla: {
                    estimatedWaitingTimeQueue: inquiry.estimatedWaitingTimeQueue,
                },
            })), { ts: inquiry.ts });
        });
        const compareInquiries = (inquiries1, inquiries2) => {
            const filteredInquiries1 = filterUnnecessaryProps(inquiries1);
            const filteredInquiries2 = filterUnnecessaryProps(inquiries2);
            (0, chai_1.expect)(filteredInquiries1).to.deep.equal(filteredInquiries2);
        };
        (0, mocha_1.it)('it should create all the data required for further testing', () => __awaiter(void 0, void 0, void 0, function* () {
            departmentWithAgent = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { body: { priorities: prioritiesResponse }, } = (yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200));
            priorities = prioritiesResponse;
            yield (0, priorities_1.deleteAllSLA)();
            slas = yield (0, priorities_1.bulkCreateSLA)(5);
            // create 20 rooms, 5 with only priority, 5 with only SLA, 5 with both, 5 without priority or SLA
            omniRooms = yield (0, rooms_1.bulkCreateLivechatRooms)(20, departmentWithAgent.department._id, (index) => {
                if (index < 5) {
                    return {
                        priority: priorities[index]._id,
                    };
                }
                if (index < 10) {
                    return {
                        sla: slas[index - 5]._id,
                    };
                }
                if (index < 15) {
                    // random number between 0 and 4
                    const randomPriorityIndex = Math.floor(Math.random() * 5);
                    const randomSlaIndex = Math.floor(Math.random() * 5);
                    return {
                        priority: priorities[randomPriorityIndex]._id,
                        sla: slas[randomSlaIndex]._id,
                    };
                }
            });
        }));
        (0, mocha_1.it)('it should sort the queue based on priority', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateEESetting)('Omnichannel_sorting_mechanism', core_typings_1.OmnichannelSortingMechanismSettingType.Priority);
            const origInquiries = yield (0, inquiries_1.fetchAllInquiries)(departmentWithAgent.agent.credentials, departmentWithAgent.department._id);
            (0, chai_1.expect)(origInquiries.length).to.be.greaterThanOrEqual(omniRooms.length);
            const expectedSortedInquiries = JSON.parse(JSON.stringify(origInquiries));
            expectedSortedInquiries.sort(sortByPriority);
            compareInquiries(origInquiries, expectedSortedInquiries);
        }));
        (0, mocha_1.it)('it should sort the queue based on slas', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateEESetting)('Omnichannel_sorting_mechanism', core_typings_1.OmnichannelSortingMechanismSettingType.SLAs);
            const origInquiries = yield (0, inquiries_1.fetchAllInquiries)(departmentWithAgent.agent.credentials, departmentWithAgent.department._id);
            (0, chai_1.expect)(origInquiries.length).to.be.greaterThanOrEqual(omniRooms.length);
            const expectedSortedInquiries = origInquiries.sort(sortBySLA);
            compareInquiries(origInquiries, expectedSortedInquiries);
        }));
        (0, mocha_1.it)('it should sort the queue based on timestamp', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateEESetting)('Omnichannel_sorting_mechanism', core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp);
            const origInquiries = yield (0, inquiries_1.fetchAllInquiries)(departmentWithAgent.agent.credentials, departmentWithAgent.department._id);
            (0, chai_1.expect)(origInquiries.length).to.be.greaterThanOrEqual(omniRooms.length);
            const expectedSortedInquiries = origInquiries.sort(sortByTimestamp);
            compareInquiries(origInquiries, expectedSortedInquiries);
        }));
    });
});
