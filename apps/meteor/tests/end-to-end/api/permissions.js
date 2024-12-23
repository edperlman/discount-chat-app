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
const api_data_1 = require("../../data/api-data");
const permissions_helper_1 = require("../../data/permissions.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Permissions]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('add-oauth-service', ['admin']));
    (0, mocha_1.describe)('[/permissions.listAll]', () => {
        (0, mocha_1.it)('should return an array with update and remove properties', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('permissions.listAll'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('update').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('remove').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array with update and remov properties when search by "updatedSince" query parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('permissions.listAll'))
                .query({ updatedSince: '2018-11-27T13:52:01Z' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('update').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('remove').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when updatedSince query parameter is not a valid ISODate string', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('permissions.listAll'))
                .query({ updatedSince: 'fsafdf' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/permissions.update]', () => {
        let testUser;
        let testUserCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            yield (0, permissions_helper_1.updatePermission)('access-permissions', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('access-permissions', ['admin']);
            yield (0, users_helper_1.deleteUser)(testUser);
        }));
        (0, mocha_1.it)('should change the permissions on the server', (done) => {
            const permissions = [
                {
                    _id: 'add-oauth-service',
                    roles: ['admin', 'user'],
                },
            ];
            void api_data_1.request
                .post((0, api_data_1.api)('permissions.update'))
                .set(api_data_1.credentials)
                .send({ permissions })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('permissions');
                const firstElement = res.body.permissions[0];
                (0, chai_1.expect)(firstElement).to.have.property('_id');
                (0, chai_1.expect)(firstElement).to.have.property('roles').and.to.be.a('array');
                (0, chai_1.expect)(firstElement).to.have.property('_updatedAt');
            })
                .end(done);
        });
        (0, mocha_1.it)('should 400 when trying to set an unknown permission', (done) => {
            const permissions = [
                {
                    _id: 'this-permission-does-not-exist',
                    roles: ['admin'],
                },
            ];
            void api_data_1.request
                .post((0, api_data_1.api)('permissions.update'))
                .set(api_data_1.credentials)
                .send({ permissions })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should 400 when trying to assign a permission to an unknown role', (done) => {
            const permissions = [
                {
                    _id: 'add-oauth-service',
                    roles: ['this-role-does-not-exist'],
                },
            ];
            void api_data_1.request
                .post((0, api_data_1.api)('permissions.update'))
                .set(api_data_1.credentials)
                .send({ permissions })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should 400 when trying to set permissions to a string', (done) => {
            const permissions = '';
            void api_data_1.request
                .post((0, api_data_1.api)('permissions.update'))
                .set(api_data_1.credentials)
                .send({ permissions })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail updating permission if user does NOT have the access-permissions permission', () => __awaiter(void 0, void 0, void 0, function* () {
            const permissions = [
                {
                    _id: 'add-oauth-service',
                    roles: ['admin', 'user'],
                },
            ];
            yield api_data_1.request
                .post((0, api_data_1.api)('permissions.update'))
                .set(testUserCredentials)
                .send({ permissions })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
});
