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
(0, mocha_1.describe)('LDAP', function () {
    this.retries(0);
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/ldap.syncNow]', () => {
        (0, mocha_1.it)('should throw an error containing totp-required error when not running EE', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (process.env.IS_EE) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('ldap.syncNow'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'totp-required');
                });
            });
        });
        (0, mocha_1.it)('should throw an error of LDAP disabled when running EE', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!process.env.IS_EE) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('ldap.syncNow'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'LDAP_disabled');
                });
            });
        });
    });
    (0, mocha_1.describe)('[/ldap.testSearch]', () => {
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('test-admin-options', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('test-admin-options', ['admin']);
        }));
        (0, mocha_1.it)('should not allow testing LDAP search if user does NOT have the test-admin-options permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('test-admin-options', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('ldap.testSearch'))
                .set(api_data_1.credentials)
                .send({
                username: 'test-search',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/ldap.testConnection]', () => {
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('test-admin-options', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('test-admin-options', ['admin']);
        }));
        (0, mocha_1.it)('should not allow testing LDAP connection if user does NOT have the test-admin-options permission', () => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('test-admin-options', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('ldap.testConnection'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
});
