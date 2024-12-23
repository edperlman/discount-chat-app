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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const speakeasy_1 = __importDefault(require("speakeasy"));
const api_data_1 = require("../../../data/api-data");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
(0, mocha_1.describe)('2fa:enable', function () {
    this.retries(0);
    let totpSecret;
    let user1;
    let user2;
    let user3;
    let user1Credentials;
    let user2Credentials;
    let user3Credentials;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)('create user', () => __awaiter(this, void 0, void 0, function* () {
        [user1, user2, user3] = yield Promise.all([
            (0, users_helper_1.createUser)({ username: random_1.Random.id(), email: `${random_1.Random.id()}@example.com`, verified: true }),
            (0, users_helper_1.createUser)({ username: random_1.Random.id(), email: `${random_1.Random.id()}@example.com}`, verified: true }),
            (0, users_helper_1.createUser)({ username: random_1.Random.id(), email: `${random_1.Random.id()}@example.com}`, verified: false }),
        ]);
        [user1Credentials, user2Credentials, user3Credentials] = yield Promise.all([
            (0, users_helper_1.login)(user1.username, user_1.password),
            (0, users_helper_1.login)(user2.username, user_1.password),
            (0, users_helper_1.login)(user3.username, user_1.password),
        ]);
    }));
    (0, mocha_1.after)('remove user', () => __awaiter(this, void 0, void 0, function* () { return Promise.all([(0, users_helper_1.deleteUser)(user1), (0, users_helper_1.deleteUser)(user2), (0, users_helper_1.deleteUser)(user3)]); }));
    (0, mocha_1.it)('should return error when user is not logged in', () => __awaiter(this, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.methodCall)('2fa:enable'))
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: 'id1',
                method: '2fa:enable',
                params: [],
            }),
        })
            .expect(401)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('status', 'error');
        });
    }));
    (0, mocha_1.it)('should return error when user is not verified', () => __awaiter(this, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.methodCall)('2fa:enable'))
            .set(user3Credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: 'id1',
                method: '2fa:enable',
                params: [],
            }),
        })
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('message');
            const result = JSON.parse(res.body.message);
            (0, chai_1.expect)(result).to.have.property('error');
            (0, chai_1.expect)(result.error).to.not.have.property('errpr', 'error-invalid-user');
        });
    }));
    (0, mocha_1.it)('should return secret and qr code url when 2fa is disabled on user', () => __awaiter(this, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.methodCall)('2fa:enable'))
            .set(user1Credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: 'id1',
                method: '2fa:enable',
                params: [],
            }),
        })
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            const parsedBody = JSON.parse(res.body.message);
            (0, chai_1.expect)(parsedBody).to.have.property('result');
            (0, chai_1.expect)(parsedBody.result).to.have.property('secret').of.a('string');
            (0, chai_1.expect)(parsedBody.result)
                .to.have.property('url')
                .of.a('string')
                .match(/^otpauth:\/\//);
        });
    }));
    (0, mocha_1.it)('should enable 2fa on the user', () => __awaiter(this, void 0, void 0, function* () {
        const enableResponse = yield api_data_1.request
            .post((0, api_data_1.methodCall)('2fa:enable'))
            .set(user2Credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: 'id2',
                method: '2fa:enable',
                params: [],
            }),
        })
            .expect(200);
        const enableData = JSON.parse(enableResponse.body.message);
        totpSecret = enableData.result.secret;
        yield api_data_1.request
            .post((0, api_data_1.methodCall)('2fa:validateTempToken'))
            .set(user2Credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: 'id3',
                method: '2fa:validateTempToken',
                params: [speakeasy_1.default.totp({ secret: totpSecret, encoding: 'base32' })],
            }),
        })
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            const parsedBody = JSON.parse(res.body.message);
            (0, chai_1.expect)(parsedBody).to.have.property('result');
            (0, chai_1.expect)(parsedBody.result).to.have.property('codes').of.a('array');
        });
    }));
    (0, mocha_1.it)('should return error when 2fa is already enabled on the user', () => __awaiter(this, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.methodCall)('2fa:enable'))
            .set(user2Credentials)
            .send({
            message: JSON.stringify({
                msg: 'method',
                id: 'id4',
                method: '2fa:enable',
                params: [],
            }),
        })
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            const parsedBody = JSON.parse(res.body.message);
            (0, chai_1.expect)(parsedBody).to.have.property('error');
            (0, chai_1.expect)(parsedBody).to.not.have.property('result');
        });
    }));
});
