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
const integration_helper_1 = require("../../data/integration.helper");
const permissions_helper_1 = require("../../data/permissions.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Outgoing Integrations]', () => {
    let integrationCreatedByAnUser;
    let user;
    let userCredentials;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        user = yield (0, users_helper_1.createUser)();
        userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['user']);
        integrationCreatedByAnUser = yield (0, integration_helper_1.createIntegration)({
            type: 'webhook-outgoing',
            name: 'Guggy',
            enabled: true,
            username: 'rocket.cat',
            urls: ['http://text2gif.guggy.com/guggify'],
            scriptEnabled: false,
            channel: '#general',
            triggerWords: ['!guggy'],
            alias: 'guggy',
            avatar: 'http://res.guggy.com/logo_128.png',
            emoji: ':ghost:',
            event: 'sendMessage',
        }, userCredentials);
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []),
            (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []),
            (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', []),
            (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []),
        ]);
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([
            (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']),
            (0, users_helper_1.deleteUser)(user),
        ]);
    }));
    let integration;
    (0, mocha_1.describe)('[/integrations.create]', () => {
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-outgoing-integrations" to add an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.create'))
                    .set(api_data_1.credentials)
                    .send({
                    type: 'webhook-outgoing',
                    name: 'Guggy',
                    enabled: true,
                    username: 'rocket.cat',
                    urls: ['http://text2gif.guggy.com/guggify'],
                    scriptEnabled: false,
                    channel: '#general',
                    triggerWords: ['!guggy'],
                    alias: 'guggy',
                    avatar: 'http://res.guggy.com/logo_128.png',
                    emoji: ':ghost:',
                    event: 'sendMessage',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'not_authorized');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-own-outgoing-integrations" to add an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.create'))
                    .set(api_data_1.credentials)
                    .send({
                    type: 'webhook-outgoing',
                    name: 'Guggy',
                    enabled: true,
                    username: 'rocket.cat',
                    urls: ['http://text2gif.guggy.com/guggify'],
                    scriptEnabled: false,
                    channel: '#general',
                    triggerWords: ['!guggy'],
                    alias: 'guggy',
                    avatar: 'http://res.guggy.com/logo_128.png',
                    emoji: ':ghost:',
                    event: 'sendMessage',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'not_authorized');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user sends an invalid type of integration', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('integrations.create'))
                .set(api_data_1.credentials)
                .send({
                type: 'webhook-outgoing-invalid',
                name: 'Guggy',
                enabled: true,
                username: 'rocket.cat',
                urls: ['http://text2gif.guggy.com/guggify'],
                scriptEnabled: false,
                channel: '#general',
                triggerWords: ['!guggy'],
                alias: 'guggy',
                avatar: 'http://res.guggy.com/logo_128.png',
                emoji: ':ghost:',
                event: 'sendMessage',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid integration type.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should add the integration successfully when the user ONLY has the permission "manage-outgoing-integrations" to add an outgoing integration', (done) => {
            let integrationId;
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.create'))
                    .set(api_data_1.credentials)
                    .send({
                    type: 'webhook-outgoing',
                    name: 'Guggy',
                    enabled: true,
                    username: 'rocket.cat',
                    urls: ['http://text2gif.guggy.com/guggify'],
                    scriptEnabled: false,
                    channel: '#general',
                    triggerWords: ['!guggy'],
                    alias: 'guggy',
                    avatar: 'http://res.guggy.com/logo_128.png',
                    emoji: ':ghost:',
                    event: 'sendMessage',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('integration').and.to.be.an('object');
                    integrationId = res.body.integration._id;
                })
                    .end(() => (0, integration_helper_1.removeIntegration)(integrationId, 'outgoing').then(done));
            });
        });
        (0, mocha_1.it)('should add the integration successfully when the user ONLY has the permission "manage-own-outgoing-integrations" to add an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []).then(() => {
                void (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['admin']).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('integrations.create'))
                        .set(api_data_1.credentials)
                        .send({
                        type: 'webhook-outgoing',
                        name: 'Guggy',
                        enabled: true,
                        username: 'rocket.cat',
                        urls: ['http://text2gif.guggy.com/guggify'],
                        scriptEnabled: false,
                        channel: '#general',
                        triggerWords: ['!guggy'],
                        alias: 'guggy',
                        avatar: 'http://res.guggy.com/logo_128.png',
                        emoji: ':ghost:',
                        event: 'sendMessage',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('integration').and.to.be.an('object');
                        integration = res.body.integration;
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should create an outgoing integration successfully', (done) => {
            let integrationId;
            void api_data_1.request
                .post((0, api_data_1.api)('integrations.create'))
                .set(api_data_1.credentials)
                .send({
                type: 'webhook-outgoing',
                name: 'Guggy',
                enabled: true,
                username: 'rocket.cat',
                urls: ['http://text2gif.guggy.com/guggify'],
                scriptEnabled: false,
                channel: '#general',
                triggerWords: ['!guggy'],
                alias: 'guggy',
                avatar: 'http://res.guggy.com/logo_128.png',
                emoji: ':ghost:',
                event: 'sendMessage',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('integration.name', 'Guggy');
                (0, chai_1.expect)(res.body).to.have.nested.property('integration.type', 'webhook-outgoing');
                (0, chai_1.expect)(res.body).to.have.nested.property('integration.enabled', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('integration.username', 'rocket.cat');
                (0, chai_1.expect)(res.body).to.have.nested.property('integration.event', 'sendMessage');
                integrationId = res.body.integration._id;
            })
                .end(() => (0, integration_helper_1.removeIntegration)(integrationId, 'outgoing').then(done));
        });
    });
    (0, mocha_1.describe)('[/integrations.list]', () => {
        (0, mocha_1.it)('should return the list of outgoing integrations', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('integrations.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const integrationCreatedByAdmin = res.body.integrations.find((createdIntegration) => createdIntegration._id === integration._id);
                chai_1.assert.isDefined(integrationCreatedByAdmin);
                (0, chai_1.expect)(integrationCreatedByAdmin).to.be.an('object');
                (0, chai_1.expect)(integrationCreatedByAdmin._id).to.be.equal(integration._id);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('items');
                (0, chai_1.expect)(res.body).to.have.property('total');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the list create by the user only', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []).then(() => {
                void (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['user']).then(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('integrations.list'))
                        .set(userCredentials)
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        const integrationCreatedByAdmin = res.body.integrations.find((createdIntegration) => createdIntegration._id === integration._id);
                        (0, chai_1.expect)(integrationCreatedByAdmin).to.be.equal(undefined);
                        (0, chai_1.expect)(res.body).to.have.property('offset');
                        (0, chai_1.expect)(res.body).to.have.property('items');
                        (0, chai_1.expect)(res.body).to.have.property('total');
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should return unauthorized error when the user does not have any integrations permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []),
            ]);
            yield api_data_1.request
                .get((0, api_data_1.api)('integrations.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/integrations.history]', () => {
        (0, mocha_1.it)('should return an error when the user DOES NOT the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []);
            yield (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('integrations.history'))
                .set(api_data_1.credentials)
                .query({
                id: integration._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should return the history of outgoing integrations', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('integrations.history'))
                    .set(api_data_1.credentials)
                    .query({
                    id: integration._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('history').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('items');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/integrations.get]', () => {
        (0, mocha_1.it)('should return an error when the required "integrationId" query parameters is not sent', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('integrations.get'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', `must have required property 'integrationId' [invalid-params]`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-outgoing-integrations" to get an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('integrations.get'))
                    .query({ integrationId: integration._id })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'not-authorized');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-outgoing-integrations" to get an outgoing integration created by another user', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('integrations.get'))
                    .query({ integrationId: integrationCreatedByAnUser._id })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'not-authorized');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user sends an invalid integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('integrations.get'))
                    .query({ integrationId: 'invalid' })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The integration does not exists.');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return the integration successfully when the user is able to see only your own integrations', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', [])
                .then(() => (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['user']))
                .then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('integrations.get'))
                    .query({ integrationId: integrationCreatedByAnUser._id })
                    .set(userCredentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('integration');
                    (0, chai_1.expect)(res.body.integration._id).to.be.equal(integrationCreatedByAnUser._id);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return the integration successfully', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('integrations.get'))
                    .query({ integrationId: integration._id })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('integration');
                    (0, chai_1.expect)(res.body.integration._id).to.be.equal(integration._id);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/integrations.remove]', () => {
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-outgoing-integrations" to remove an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(api_data_1.credentials)
                    .send({
                    integrationId: integration._id,
                    type: 'webhook-outgoing',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-own-outgoing-integrations" to remove an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(api_data_1.credentials)
                    .send({
                    integrationId: integration._id,
                    type: 'webhook-outgoing',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user sends an invalid type of integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(api_data_1.credentials)
                    .send({
                    integrationId: integration._id,
                    type: 'invalid-type',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error').include(`must match exactly one schema in oneOf`);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should remove the integration successfully when the user at least one of the necessary permission to remove an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(api_data_1.credentials)
                    .send({
                    integrationId: integration._id,
                    type: integration.type,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('the normal user should remove the integration successfully when the user have the "manage-own-outgoing-integrations" to remove an outgoing integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['user']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(userCredentials)
                    .send({
                    integrationId: integrationCreatedByAnUser._id,
                    type: integrationCreatedByAnUser.type,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
    });
});
