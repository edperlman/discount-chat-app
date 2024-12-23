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
(0, mocha_1.describe)('[Push]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('POST [/push.token]', () => {
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should fail if missing type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                value: 'token',
                appName: 'com.example.rocketchat',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-type-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should fail if missing value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                type: 'gcm',
                appName: 'com.example.rocketchat',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-token-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should fail if missing appName', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                type: 'gcm',
                value: 'token',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-appName-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should fail if type param is unknown', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                type: 'unknownPlatform',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-type-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should fail if token param is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                type: 'gcm',
                appName: 'com.example.rocketchat',
                value: '',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-token-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should add a token if valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                type: 'gcm',
                value: 'token',
                appName: 'com.example.rocketchat',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('result').and.to.be.an('object');
            });
        }));
    });
    (0, mocha_1.describe)('DELETE [/push.token]', () => {
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('push.token'))
                .send({
                token: 'token',
            })
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should fail if missing token key', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-token-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should fail if token is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                token: '',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-token-param-not-valid');
            });
        }));
        (0, mocha_1.it)('should fail if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                token: '123',
            })
                .expect(404)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should delete a token if valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                token: 'token',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should fail if token is already deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('push.token'))
                .set(api_data_1.credentials)
                .send({
                token: 'token',
            })
                .expect(404)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
    });
    (0, mocha_1.describe)('[/push.test]', () => {
        (0, mocha_1.before)(() => (0, permissions_helper_1.updateSetting)('Push_enable', false));
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.test'))
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should fail if push is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('push.test'))
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-push-disabled');
            });
        }));
    });
    (0, mocha_1.describe)('[/push.info]', () => {
        (0, mocha_1.before)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Push_gateway', 'https://random-gateway.rocket.chat')]));
        (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Push_gateway', 'https://gateway.rocket.chat')]));
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('push.info'))
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should succesfully retrieve non default push notification info', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('push.info'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('pushGatewayEnabled', false);
                (0, chai_1.expect)(res.body).to.have.property('defaultPushGateway', false);
            });
        }));
        (0, mocha_1.it)('should succesfully retrieve default push notification info', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Push_gateway', 'https://gateway.rocket.chat');
            yield api_data_1.request
                .get((0, api_data_1.api)('push.info'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('pushGatewayEnabled', false);
                (0, chai_1.expect)(res.body).to.have.property('defaultPushGateway', true);
            });
        }));
    });
});
