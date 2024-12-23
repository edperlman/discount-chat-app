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
const permissions_helper_1 = require("../../../data/permissions.helper");
(0, mocha_1.describe)('Mailer', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('POST mailer', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('send-mail', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('send-mail', ['admin']);
        }));
        (0, mocha_1.it)('should send an email if the payload is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer'))
                .set(api_data_1.credentials)
                .send({
                from: 'rocketchat.internal.admin.test@rocket.chat',
                subject: 'Test email subject',
                body: 'Test email body [unsubscribe]',
                dryrun: true,
                query: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should throw an error if the request is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer'))
                .set(api_data_1.credentials)
                .send({
                from: 12345,
                subject: {},
                body: 'Test email body',
                dryrun: true,
                query: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if the "from" param is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer'))
                .set(api_data_1.credentials)
                .send({
                subject: 'Test email subject',
                body: 'Test email body',
                dryrun: true,
                query: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if user does NOT have the send-mail permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('send-mail', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer'))
                .set(api_data_1.credentials)
                .send({
                from: 'test-mail@test.com',
                subject: 'Test email subject',
                body: 'Test email body',
                dryrun: true,
                query: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    }));
});
(0, mocha_1.describe)('Mailer Unsubscribe', () => {
    (0, mocha_1.describe)('POST mailer unsubscribe', () => {
        (0, mocha_1.it)('should unsubscribe to mailer if the request is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer.unsubscribe'))
                .set(api_data_1.credentials)
                .send({
                _id: api_data_1.credentials['X-User-Id'],
                createdAt: new Date().getTime().toString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should throw an error if the "_id" param is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer.unsubscribe'))
                .set(api_data_1.credentials)
                .send({
                createdAt: new Date().getTime().toString(),
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if the "createdAt" param is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('mailer.unsubscribe'))
                .set(api_data_1.credentials)
                .send({
                _id: api_data_1.credentials['X-User-Id'],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
    });
});
