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
const triggers_1 = require("../../../data/livechat/triggers");
const permissions_helper_1 = require("../../../data/permissions.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - triggers', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('livechat/triggers', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/triggers')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an array of triggers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield (0, triggers_1.createTrigger)(`test${Date.now()}`);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.triggers).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count').to.be.greaterThan(0);
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('description');
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('enabled', true);
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('runOnce').that.is.a('boolean');
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('conditions').that.is.an('array').with.lengthOf.greaterThan(0);
                (0, chai_1.expect)(res.body.triggers[0]).to.have.property('actions').that.is.an('array').with.lengthOf.greaterThan(0);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
    });
    (0, mocha_1.describe)('POST livechat/triggers', () => {
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/triggers')).send({}).expect(401);
        }));
        (0, mocha_1.it)('should fail if no data is sent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/triggers')).set(api_data_1.credentials).send({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if invalid data is sent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/triggers')).set(api_data_1.credentials).send({ name: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if name is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 1, description: 'test', enabled: true, runOnce: true, conditions: [], actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if description is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 1, enabled: true, runOnce: true, conditions: [], actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if enabled is not an boolean', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: 1, runOnce: true, conditions: [], actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if runOnce is not an boolean', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: true, runOnce: 1, conditions: [], actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if conditions is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: true, runOnce: true, conditions: 1, actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if actions is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: true, runOnce: true, conditions: [], actions: 1 })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if conditions is an array with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: true, runOnce: true, conditions: [1], actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if conditions is an array of objects, but name is not a valid value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: true, runOnce: true, conditions: [{ name: 'invalid' }], actions: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if actions is an array of invalid values', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({ name: 'test', description: 'test', enabled: true, runOnce: true, conditions: [{ name: 'page-url' }], actions: [1] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if actions is an array of objects, but name is not a valid value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test',
                description: 'test',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [{ name: 'invalid' }],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if actions is an array of objects, but sender is not a valid value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test',
                description: 'test',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url' }],
                actions: [{ name: 'send-message', params: { sender: 'invalid' } }],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if actions is an array of objects, but msg is not a valid value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test',
                description: 'test',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [{ name: 'send-message', params: { sender: 'custom' } }],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if actions is an array of objects, but name is not a valid value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test',
                description: 'test',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [{ name: 'send-message', params: { sender: 'custom', msg: 'test', name: {} } }],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if user doesnt have view-livechat-manager permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test',
                description: 'test',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [{ name: 'send-message', params: { sender: 'custom', msg: 'test', name: 'test' } }],
            })
                .expect(403);
        }));
        (0, mocha_1.it)('should save a new trigger of type send-message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test',
                description: 'test',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [{ name: 'send-message', params: { sender: 'custom', msg: 'test', name: 'test' } }],
            })
                .expect(200);
        }));
        (0, mocha_1.it)('should fail if type is use-external-service but serviceUrl is not a present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test2',
                description: 'test2',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [
                    {
                        name: 'use-external-service',
                        params: {
                            serviceTimeout: 5000,
                            serviceFallbackMessage: 'Were sorry, we cannot complete your request',
                        },
                    },
                ],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if type is use-external-service but serviceTimeout is not a present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test2',
                description: 'test2',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [
                    {
                        name: 'use-external-service',
                        params: {
                            serviceUrl: 'http://localhost:3000/api/vX',
                            serviceFallbackMessage: 'Were sorry, we cannot complete your request',
                        },
                    },
                ],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if type is use-external-service but serviceFallbackMessage is not a present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test2',
                description: 'test2',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [
                    {
                        name: 'use-external-service',
                        params: {
                            serviceUrl: 'http://localhost:3000/api/vX',
                            serviceTimeout: 5000,
                        },
                    },
                ],
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should save a new trigger of type use-external-service', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers'))
                .set(api_data_1.credentials)
                .send({
                name: 'test3',
                description: 'test3',
                enabled: true,
                runOnce: true,
                conditions: [{ name: 'page-url', value: 'http://localhost:3000' }],
                actions: [
                    {
                        name: 'use-external-service',
                        params: {
                            serviceUrl: 'http://localhost:3000/api/vX',
                            serviceTimeout: 5000,
                            serviceFallbackMessage: 'Were sorry, we cannot complete your request',
                        },
                    },
                ],
            })
                .expect(200);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('POST livechat/triggers/external-service/test', () => {
        const webhookUrl = process.env.WEBHOOK_TEST_URL || 'https://httpbin.org';
        (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Livechat_secret_token', ''), (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager')]));
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/triggers/external-service/test')).send({}).expect(401);
        }));
        (0, mocha_1.it)('should fail if no data is sent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/triggers/external-service/test')).set(api_data_1.credentials).send({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if invalid data is sent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/triggers/external-service/test')).set(api_data_1.credentials).send({ webhookUrl: 'test' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if webhookUrl is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: 1, timeout: 1000, fallbackMessage: 'test', extraData: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if timeout is not an number', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: 'test', timeout: '1000', fallbackMessage: 'test', extraData: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if fallbackMessage is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: 'test', timeout: 1000, fallbackMessage: 1, extraData: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if params is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: 'test', timeout: 1000, fallbackMessage: 'test', extraData: 1 })
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if user doesnt have view-livechat-webhooks permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-manager');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: 'test', timeout: 1000, fallbackMessage: 'test', extraData: [] })
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if Livechat_secret_token setting is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-manager');
            yield (0, permissions_helper_1.updateSetting)('Livechat_secret_token', '');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: 'test', timeout: 1000, fallbackMessage: 'test', extraData: [] })
                .expect(400);
        }));
        (0, mocha_1.it)('should return error when webhook returns error', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_secret_token', 'test');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: `${webhookUrl}/status/500`, timeout: 5000, fallbackMessage: 'test', extraData: [] })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-invalid-external-service-response');
                (0, chai_1.expect)(res.body).to.have.property('response').to.be.a('string');
            });
        }));
        (0, mocha_1.it)('should return error when webhook times out', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: `${webhookUrl}/delay/2`, timeout: 1000, fallbackMessage: 'test', extraData: [] })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-timeout');
                (0, chai_1.expect)(res.body).to.have.property('response').to.be.a('string');
            });
        }));
        (0, mocha_1.it)('should fail when webhook returns an answer that doesnt match the format', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/triggers/external-service/test'))
                .set(api_data_1.credentials)
                .send({ webhookUrl: `${webhookUrl}/anything`, timeout: 5000, fallbackMessage: 'test', extraData: [] })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-invalid-external-service-response');
            });
        }));
    });
    (0, mocha_1.describe)('livechat/triggers/:id', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/triggers/invalid-id')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
        }));
        (0, mocha_1.it)('should return null when trigger does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/triggers/invalid-id'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.trigger).to.be.null;
        }));
        (0, mocha_1.it)('should return the trigger', () => __awaiter(void 0, void 0, void 0, function* () {
            const triggerName = `test${Date.now()}`;
            yield (0, triggers_1.createTrigger)(triggerName);
            const trigger = (yield (0, triggers_1.fetchTriggers)()).find((t) => t.name === triggerName);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/triggers/${trigger === null || trigger === void 0 ? void 0 : trigger._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.trigger).to.be.an('object');
            (0, chai_1.expect)(response.body.trigger).to.have.property('_id', trigger === null || trigger === void 0 ? void 0 : trigger._id);
        }));
    });
});
