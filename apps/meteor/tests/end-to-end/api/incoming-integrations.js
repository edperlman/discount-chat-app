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
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Incoming Integrations]', () => {
    let integration;
    let integrationCreatedByAnUser;
    let user;
    let userCredentials;
    let channel;
    let testChannelName;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []),
            (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []),
            (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', []),
            (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []),
        ]);
        testChannelName = `channel.test.${Date.now()}-${Math.random()}`;
        channel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: testChannelName })).body.channel;
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channel._id }),
            (0, users_helper_1.deleteUser)(user),
        ]);
    }));
    (0, mocha_1.describe)('[/integrations.create]', () => {
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-incoming-integrations" to add an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.create'))
                    .set(api_data_1.credentials)
                    .send({
                    type: 'webhook-incoming',
                    name: 'Incoming test',
                    enabled: true,
                    alias: 'test',
                    username: 'rocket.cat',
                    scriptEnabled: false,
                    overrideDestinationChannelEnabled: true,
                    channel: '#general',
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
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-own-incoming-integrations" to add an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.create'))
                    .set(api_data_1.credentials)
                    .send({
                    type: 'webhook-incoming',
                    name: 'Incoming test',
                    enabled: true,
                    alias: 'test',
                    username: 'rocket.cat',
                    scriptEnabled: false,
                    overrideDestinationChannelEnabled: true,
                    channel: '#general',
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
                type: 'webhook-incoming-invalid',
                name: 'Incoming test',
                enabled: true,
                alias: 'test',
                username: 'rocket.cat',
                scriptEnabled: false,
                overrideDestinationChannelEnabled: true,
                channel: '#general',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid integration type.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should add the integration successfully when the user ONLY has the permission "manage-incoming-integrations" to add an incoming integration', (done) => {
            let integrationId;
            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.create'))
                    .set(api_data_1.credentials)
                    .send({
                    type: 'webhook-incoming',
                    name: 'Incoming test',
                    enabled: true,
                    alias: 'test',
                    username: 'rocket.cat',
                    scriptEnabled: false,
                    overrideDestinationChannelEnabled: false,
                    channel: '#general',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('integration').and.to.be.an('object');
                    integrationId = res.body.integration._id;
                })
                    .end(() => (0, integration_helper_1.removeIntegration)(integrationId, 'incoming').then(done));
            });
        });
        (0, mocha_1.it)('should set overrideDestinationChannelEnabled setting to false when it is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('integrations.create'))
                .set(api_data_1.credentials)
                .send({
                type: 'webhook-incoming',
                name: 'Incoming test',
                enabled: true,
                alias: 'test',
                username: 'rocket.cat',
                scriptEnabled: false,
                channel: '#general',
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('integration').and.to.be.an('object');
            (0, chai_1.expect)(res.body.integration).to.have.property('overrideDestinationChannelEnabled', false);
            const integrationId = res.body.integration._id;
            yield (0, integration_helper_1.removeIntegration)(integrationId, 'incoming');
        }));
        (0, mocha_1.it)('should add the integration successfully when the user ONLY has the permission "manage-own-incoming-integrations" to add an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []).then(() => {
                void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('integrations.create'))
                        .set(api_data_1.credentials)
                        .send({
                        type: 'webhook-incoming',
                        name: 'Incoming test 2',
                        enabled: true,
                        alias: 'test2',
                        username: 'rocket.cat',
                        scriptEnabled: false,
                        overrideDestinationChannelEnabled: false,
                        channel: '#general',
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
        (0, mocha_1.it)('should execute the incoming integration', (done) => {
            void api_data_1.request
                .post(`/hooks/${integration._id}/${integration.token}`)
                .send({
                text: 'Example message',
            })
                .expect(200)
                .end(done);
        });
        (0, mocha_1.it)("should return an error when sending 'channel' field telling its configuration is disabled", (done) => {
            void api_data_1.request
                .post(`/hooks/${integration._id}/${integration.token}`)
                .send({
                text: 'Example message',
                channel: [testChannelName],
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'overriding destination channel is disabled for this integration');
            })
                .end(done);
        });
        (0, mocha_1.it)("should return an error when sending 'roomId' field telling its configuration is disabled", (done) => {
            void api_data_1.request
                .post(`/hooks/${integration._id}/${integration.token}`)
                .send({
                text: 'Example message',
                roomId: channel._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'overriding destination channel is disabled for this integration');
            })
                .end(done);
        });
        (0, mocha_1.it)('should send a message for a channel that is specified in the webhooks configuration', (done) => {
            const successfulMesssage = `Message sent successfully at #${Date.now()}`;
            void api_data_1.request
                .post(`/hooks/${integration._id}/${integration.token}`)
                .send({
                text: successfulMesssage,
            })
                .expect(200)
                .end(() => {
                return api_data_1.request
                    .get((0, api_data_1.api)('channels.messages'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                    (0, chai_1.expect)(!!res.body.messages.find((m) => m.msg === successfulMesssage)).to.be.true;
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should send a message for a channel that is not specified in the webhooks configuration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)('integrations.update'))
                .set(api_data_1.credentials)
                .send({
                type: 'webhook-incoming',
                overrideDestinationChannelEnabled: true,
                integrationId: integration._id,
                username: 'rocket.cat',
                channel: '#general',
                scriptEnabled: true,
                enabled: true,
                name: integration.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('integration');
                (0, chai_1.expect)(res.body.integration.overrideDestinationChannelEnabled).to.be.equal(true);
            });
            const successfulMesssage = `Message sent successfully at #${Date.now()}`;
            yield api_data_1.request
                .post(`/hooks/${integration._id}/${integration.token}`)
                .send({
                text: successfulMesssage,
                channel: [testChannelName],
            })
                .expect(200);
            return api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                (0, chai_1.expect)(!!res.body.messages.find((m) => m.msg === successfulMesssage)).to.be.true;
            });
        }));
    });
    (0, mocha_1.describe)('[/integrations.history]', () => {
        (0, mocha_1.it)('should return an error when trying to get history of incoming integrations if user does NOT have enough permissions', (done) => {
            void api_data_1.request
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
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/integrations.list]', () => {
        (0, mocha_1.before)((done) => {
            void (0, users_helper_1.createUser)().then((createdUser) => {
                user = createdUser;
                void (0, users_helper_1.login)(user.username, user_1.password).then((credentials) => {
                    userCredentials = credentials;
                    void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['user']).then(() => {
                        void (0, integration_helper_1.createIntegration)({
                            type: 'webhook-incoming',
                            name: 'Incoming test',
                            enabled: true,
                            alias: 'test',
                            username: 'rocket.cat',
                            scriptEnabled: false,
                            overrideDestinationChannelEnabled: true,
                            channel: '#general',
                        }, userCredentials).then((integration) => {
                            integrationCreatedByAnUser = integration;
                            done();
                        });
                    });
                });
            });
        });
        (0, mocha_1.it)('should return the list of incoming integrations', (done) => {
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
        (0, mocha_1.it)('should return the list of integrations created by the user only', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []).then(() => {
                void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['user']).then(() => {
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
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-incoming-integrations" to get an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []).then(() => {
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
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-incoming-integrations" to get an incoming integration created by another user', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []).then(() => {
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
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']).then(() => {
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
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', [])
                .then(() => (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['user']))
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
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']).then(() => {
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
    (0, mocha_1.describe)('[/integrations.update]', () => {
        (0, mocha_1.it)('should update an integration by id and return the new data', (done) => {
            void api_data_1.request
                .put((0, api_data_1.api)('integrations.update'))
                .set(api_data_1.credentials)
                .send({
                type: 'webhook-incoming',
                name: 'Incoming test updated',
                enabled: true,
                alias: 'test updated',
                username: 'rocket.cat',
                scriptEnabled: true,
                overrideDestinationChannelEnabled: true,
                channel: '#general',
                integrationId: integration._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('integration');
                (0, chai_1.expect)(res.body.integration._id).to.be.equal(integration._id);
                (0, chai_1.expect)(res.body.integration.name).to.be.equal('Incoming test updated');
                (0, chai_1.expect)(res.body.integration.alias).to.be.equal('test updated');
            })
                .end(done);
        });
        (0, mocha_1.it)('should have integration updated on subsequent gets', (done) => {
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
                (0, chai_1.expect)(res.body.integration.name).to.be.equal('Incoming test updated');
                (0, chai_1.expect)(res.body.integration.alias).to.be.equal('test updated');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/integrations.remove]', () => {
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-incoming-integrations" to remove an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(api_data_1.credentials)
                    .send({
                    integrationId: integration._id,
                    type: 'webhook-incoming',
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
        (0, mocha_1.it)('should return an error when the user DOES NOT have the permission "manage-own-incoming-integrations" to remove an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('integrations.remove'))
                    .set(api_data_1.credentials)
                    .send({
                    integrationId: integration._id,
                    type: 'webhook-incoming',
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
            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']).then(() => {
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
        (0, mocha_1.it)('should remove the integration successfully when the user at least one of the necessary permission to remove an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']).then(() => {
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
        (0, mocha_1.it)('the normal user should remove the integration successfully when the user have the "manage-own-incoming-integrations" to remove an incoming integration', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['user']).then(() => {
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
