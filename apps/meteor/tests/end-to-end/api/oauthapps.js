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
(0, mocha_1.describe)('[OAuthApps]', () => {
    const createdAppsIds = [];
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => Promise.all([
        (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']),
        ...createdAppsIds.map((appId) => api_data_1.request.post((0, api_data_1.api)(`oauth-apps.delete`)).set(api_data_1.credentials).send({
            appId,
        })),
    ]));
    (0, mocha_1.describe)('[/oauth-apps.list]', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-oauth-apps', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('oauth-apps.list'))
                    .set(api_data_1.credentials)
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an array of oauth apps', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('oauth-apps.list'))
                    .set(api_data_1.credentials)
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('oauthApps').and.to.be.an('array');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/oauth-apps.get]', () => {
        (0, mocha_1.before)(() => (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']));
        (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']));
        (0, mocha_1.it)('should return a single oauthApp by id', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('oauth-apps.get'))
                .query({ appId: 'zapier' })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('oauthApp');
                (0, chai_1.expect)(res.body.oauthApp._id).to.be.equal('zapier');
                (0, chai_1.expect)(res.body.oauthApp).to.have.property('clientSecret');
            });
        });
        (0, mocha_1.it)('should return a single oauthApp by client id', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('oauth-apps.get'))
                .query({ clientId: 'zapier' })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('oauthApp');
                (0, chai_1.expect)(res.body.oauthApp._id).to.be.equal('zapier');
                (0, chai_1.expect)(res.body.oauthApp).to.have.property('clientSecret');
            });
        });
        (0, mocha_1.it)('should return only non sensitive information if user does not have the permission to manage oauth apps when searching by clientId', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('oauth-apps.get'))
                .query({ clientId: 'zapier' })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('oauthApp');
                (0, chai_1.expect)(res.body.oauthApp._id).to.be.equal('zapier');
                (0, chai_1.expect)(res.body.oauthApp.clientId).to.be.equal('zapier');
                (0, chai_1.expect)(res.body.oauthApp).to.not.have.property('clientSecret');
            });
        }));
        (0, mocha_1.it)('should return only non sensitive information if user does not have the permission to manage oauth apps when searching by appId', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('oauth-apps.get'))
                .query({ appId: 'zapier' })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('oauthApp');
                (0, chai_1.expect)(res.body.oauthApp._id).to.be.equal('zapier');
                (0, chai_1.expect)(res.body.oauthApp.clientId).to.be.equal('zapier');
                (0, chai_1.expect)(res.body.oauthApp).to.not.have.property('clientSecret');
            });
        }));
        (0, mocha_1.it)('should fail returning an oauth app when an invalid id is provided (avoid NoSQL injections)', () => {
            return api_data_1.request
                .get((0, api_data_1.api)('oauth-apps.get'))
                .query({ _id: '{ "$ne": "" }' })
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'OAuth app not found.');
            });
        });
    });
    (0, mocha_1.describe)('[/oauth-apps.create]', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name: 'error',
                redirectUri: 'error',
                active: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']);
        }));
        (0, mocha_1.it)("should return an error when the 'name' property is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name: '',
                redirectUri: 'error',
                active: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-name');
            });
        }));
        (0, mocha_1.it)("should return an error when the 'redirectUri' property is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name: 'error',
                redirectUri: '',
                active: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-redirectUri');
            });
        }));
        (0, mocha_1.it)("should return an error when the 'active' property is not a boolean", () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name: 'error',
                redirectUri: 'error',
                active: 'anything',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            });
        }));
        (0, mocha_1.it)('should create an oauthApp', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `new app ${Date.now()}`;
            const redirectUri = 'http://localhost:3000';
            const active = true;
            yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name,
                redirectUri,
                active,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('application.name', name);
                (0, chai_1.expect)(res.body).to.have.nested.property('application.redirectUri', redirectUri);
                (0, chai_1.expect)(res.body).to.have.nested.property('application.active', active);
                createdAppsIds.push(res.body.application._id);
            });
        }));
    });
    (0, mocha_1.describe)('[/oauth-apps.update]', () => {
        let appId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']);
            const name = 'test-oauth-app';
            const redirectUri = 'https://test.com';
            const active = true;
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name,
                redirectUri,
                active,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            appId = res.body.application._id;
            createdAppsIds.push(appId);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']);
        }));
        (0, mocha_1.it)("should update an app's name, its Active and Redirect URI fields correctly by its id", () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `new app ${Date.now()}`;
            const redirectUri = 'http://localhost:3000';
            const active = false;
            yield api_data_1.request
                .post((0, api_data_1.api)(`oauth-apps.update`))
                .set(api_data_1.credentials)
                .send({
                appId,
                name,
                redirectUri,
                active,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('active', active);
                (0, chai_1.expect)(res.body).to.have.property('redirectUri', redirectUri);
                (0, chai_1.expect)(res.body).to.have.property('name', name);
            });
        }));
        (0, mocha_1.it)('should fail updating an app if user does NOT have the manage-oauth-apps permission', () => __awaiter(void 0, void 0, void 0, function* () {
            const name = `new app ${Date.now()}`;
            const redirectUri = 'http://localhost:3000';
            const active = false;
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', []);
            yield api_data_1.request
                .post((0, api_data_1.api)(`oauth-apps.update`))
                .set(api_data_1.credentials)
                .send({
                appId,
                name,
                redirectUri,
                active,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/oauth-apps.delete]', () => {
        let appId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']);
            const name = 'test-oauth-app';
            const redirectUri = 'https://test.com';
            const active = true;
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('oauth-apps.create'))
                .set(api_data_1.credentials)
                .send({
                name,
                redirectUri,
                active,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            appId = res.body.application._id;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', ['admin']);
        }));
        (0, mocha_1.it)('should delete an app by its id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`oauth-apps.delete`))
                .set(api_data_1.credentials)
                .send({
                appId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.equals(true);
            });
        }));
        (0, mocha_1.it)('should fail deleting an app by its id if user does NOT have the manage-oauth-apps permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-oauth-apps', []);
            yield api_data_1.request
                .post((0, api_data_1.api)(`oauth-apps.delete`))
                .set(api_data_1.credentials)
                .send({
                appId,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
});
