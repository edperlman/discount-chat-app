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
(0, mocha_1.describe)('[Presence]', () => {
    let createdUser;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    let unauthorizedUserCredentials;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        createdUser = yield (0, users_helper_1.createUser)();
        unauthorizedUserCredentials = yield (0, users_helper_1.login)(createdUser.username, user_1.password);
    }));
    (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updatePermission)('manage-user-status', ['admin']), (0, users_helper_1.deleteUser)(createdUser)]));
    (0, mocha_1.describe)('[/presence.getConnections]', () => {
        (0, mocha_1.it)('should throw an error if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('presence.getConnections'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should throw an error if user is unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('presence.getConnections'))
                .set(unauthorizedUserCredentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)("should throw an error if doesn't have required permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-user-status', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('presence.getConnections'))
                .set(unauthorizedUserCredentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
            yield (0, permissions_helper_1.updatePermission)('manage-user-status', ['admin']);
        }));
        (0, mocha_1.it)('should return current and max connections of 200', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('presence.getConnections'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('current').to.be.a('number');
                (0, chai_1.expect)(res.body).to.have.property('max').to.be.a('number').and.to.be.equal(200);
            });
        }));
    });
    (0, mocha_1.describe)('[/presence.enableBroadcast]', () => {
        (0, mocha_1.it)('should throw an error if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('presence.enableBroadcast'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            });
        }));
        (0, mocha_1.it)('should throw an error if user is unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('presence.enableBroadcast'))
                .set(unauthorizedUserCredentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
        }));
        (0, mocha_1.it)("should throw an error if doesn't have required permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-user-status', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('presence.enableBroadcast'))
                .set(unauthorizedUserCredentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            });
            yield (0, permissions_helper_1.updatePermission)('manage-user-status', ['admin']);
        }));
        (0, mocha_1.it)('should return success', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('presence.enableBroadcast'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
    });
    // describe('[/presence.enableBroadcast]', () => {});
});
