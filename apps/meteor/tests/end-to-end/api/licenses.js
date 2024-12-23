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
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('licenses', () => {
    let createdUser;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    let unauthorizedUserCredentials;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        createdUser = yield (0, users_helper_1.createUser)();
        unauthorizedUserCredentials = yield (0, users_helper_1.login)(createdUser.username, user_1.password);
    }));
    (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(createdUser));
    (0, mocha_1.describe)('[/licenses.add]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('licenses.add'))
                .send({
                license: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if user is unauthorized', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('licenses.add'))
                .set(unauthorizedUserCredentials)
                .send({
                license: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if license is invalid', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('licenses.add'))
                .set(api_data_1.credentials)
                .send({
                license: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/licenses.info]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('licenses.info'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return limited information if user is unauthorized', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('licenses.info'))
                .set(unauthorizedUserCredentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('license').and.to.be.an('object');
                (0, chai_1.expect)(res.body.license).to.not.have.property('license');
                (0, chai_1.expect)(res.body.license).to.have.property('tags').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return unrestricted info if user is logged in and is authorized', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('licenses.info'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('license').and.to.be.an('object');
                if (process.env.IS_EE) {
                    (0, chai_1.expect)(res.body.license).to.have.property('license').and.to.be.an('object');
                }
                (0, chai_1.expect)(res.body.license).to.have.property('tags').and.to.be.an('array');
            })
                .end(done);
        });
    });
});
