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
(0, mocha_1.describe)('[Cloud]', function () {
    this.retries(0);
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/cloud.manualRegister]', () => {
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('register-on-cloud', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('register-on-cloud', ['admin']);
        }));
        (0, mocha_1.it)('should fail if user is not authenticated', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.manualRegister'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message', 'You must be logged in to do this.');
            });
        }));
        (0, mocha_1.it)('should fail when cloudBlob property is not provided', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.manualRegister'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', "must have required property 'cloudBlob' [invalid-params]");
            });
        }));
        (0, mocha_1.it)('should fail when user does not have the register-on-cloud permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('register-on-cloud', []);
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.manualRegister'))
                .set(api_data_1.credentials)
                .send({
                cloudBlob: 'test-blob',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/cloud.createRegistrationIntent]', () => {
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('manage-cloud', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('manage-cloud', ['admin']);
        }));
        (0, mocha_1.it)('should fail if user is not authenticated', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.createRegistrationIntent'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message', 'You must be logged in to do this.');
            });
        }));
        (0, mocha_1.it)('should fail when resend property is not provided', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.createRegistrationIntent'))
                .set(api_data_1.credentials)
                .send({
                email: 'test-mail@example.com',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', "must have required property 'resend' [invalid-params]");
            });
        }));
        (0, mocha_1.it)('should fail when email property is not provided', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.createRegistrationIntent'))
                .set(api_data_1.credentials)
                .send({
                resend: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', "must have required property 'email' [invalid-params]");
            });
        }));
        (0, mocha_1.it)('should fail when user does not have the manage-cloud permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-cloud', []);
            return api_data_1.request
                .post((0, api_data_1.api)('cloud.createRegistrationIntent'))
                .set(api_data_1.credentials)
                .send({
                email: 'test-mail@example.com',
                resend: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/cloud.confirmationPoll]', () => {
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('manage-cloud', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('manage-cloud', ['admin']);
        }));
        (0, mocha_1.it)('should fail if user is not authenticated', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('cloud.confirmationPoll'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message', 'You must be logged in to do this.');
            });
        }));
        (0, mocha_1.it)('should fail when deviceCode property is not provided', () => __awaiter(this, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('cloud.confirmationPoll'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', "must have required property 'deviceCode' [invalid-params]");
            });
        }));
        (0, mocha_1.it)('should fail when user does not have the manage-cloud permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-cloud', []);
            return api_data_1.request
                .get((0, api_data_1.api)('cloud.confirmationPoll'))
                .set(api_data_1.credentials)
                .query({
                deviceCode: 'test-code',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
});
