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
(0, mocha_1.describe)('[Settings]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/settings.public]', () => {
        (0, mocha_1.it)('should return public settings', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.public'))
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('settings');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return public settings even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.public'))
                .query({
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').and.to.be.true;
                (0, chai_1.expect)(res.body).to.have.property('settings').and.to.be.an('array').and.to.have.lengthOf(5);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.a('number').and.to.equal(5);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return public settings even requested with _id param', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.public'))
                .query({
                _id: 'Site_Url',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').and.to.be.true;
                (0, chai_1.expect)(res.body).to.have.property('settings').and.to.be.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.a('number').and.to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return public settings even requested with _id param as an array', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.public'))
                .query({
                _id: 'Site_Url,LDAP_Enable',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').and.to.be.true;
                (0, chai_1.expect)(res.body).to.have.property('settings').and.to.be.an('array').and.to.have.lengthOf(2);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.a('number').and.to.equal(2);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an empty response when requesting public settings with a broken _id param', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.public'))
                .query({
                _id: 10,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').and.to.be.true;
                (0, chai_1.expect)(res.body).to.have.property('settings').and.to.be.an('array').and.to.be.empty;
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.a('number').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.be.a('number').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.be.a('number').and.to.equal(0);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/settings]', () => {
        (0, mocha_1.it)('should return private settings', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('settings');
                (0, chai_1.expect)(res.body).to.have.property('count');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/settings/:_id]', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-privileged-setting', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('edit-privileged-setting', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-privileged-setting', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('edit-privileged-setting', ['admin']);
        }));
        (0, mocha_1.it)('should succesfully return one setting (GET)', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .get((0, api_data_1.api)('settings/Site_Url'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('_id', 'Site_Url');
                (0, chai_1.expect)(res.body).to.have.property('value');
            });
        }));
        (0, mocha_1.it)('should fail returning a setting if user does NOT have the view-privileged-setting permission (GET)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-privileged-setting', []);
            return api_data_1.request
                .get((0, api_data_1.api)('settings/Site_Url'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should succesfully set the value of a setting (POST)', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('settings/LDAP_Enable'))
                .set(api_data_1.credentials)
                .send({
                value: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should fail updating the value of a setting if user does NOT have the edit-privileged-setting permission (POST)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('edit-privileged-setting', []);
            return api_data_1.request
                .post((0, api_data_1.api)('settings/LDAP_Enable'))
                .set(api_data_1.credentials)
                .send({
                value: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/service.configurations]', () => {
        (0, mocha_1.it)('should return service configurations', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('service.configurations'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('configurations');
            })
                .end(done);
        });
        (0, mocha_1.describe)('With OAuth enabled', () => {
            (0, mocha_1.before)(() => (0, permissions_helper_1.updateSetting)('Accounts_OAuth_Google', true));
            (0, mocha_1.after)(() => (0, permissions_helper_1.updateSetting)('Accounts_OAuth_Google', false));
            (0, mocha_1.it)('should include the OAuth service in the response', (done) => {
                // wait 3 seconds before getting the service list so the server has had time to update it
                setTimeout(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('service.configurations'))
                        .set(api_data_1.credentials)
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('configurations');
                        (0, chai_1.expect)(res.body.configurations.find(({ service }) => service === 'google')).to.exist;
                    })
                        .end(done);
                }, 3000);
            });
        });
        (0, mocha_1.describe)('With OAuth disabled', () => {
            (0, mocha_1.before)(() => (0, permissions_helper_1.updateSetting)('Accounts_OAuth_Google', false));
            (0, mocha_1.after)(() => (0, permissions_helper_1.updateSetting)('Accounts_OAuth_Google', false));
            (0, mocha_1.it)('should not include the OAuth service in the response', (done) => {
                // wait 3 seconds before getting the service list so the server has had time to update it
                setTimeout(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('service.configurations'))
                        .set(api_data_1.credentials)
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('configurations');
                        (0, chai_1.expect)(res.body.configurations.find(({ service }) => service === 'google')).to.not.exist;
                    })
                        .end(done);
                }, 3000);
            });
        });
    });
    (0, mocha_1.describe)('/settings.oauth', () => {
        (0, mocha_1.it)('should have return list of available oauth services when user is not logged', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.oauth'))
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('services').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should have return list of available oauth services when user is logged', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('settings.oauth'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('services').and.to.be.an('array');
            })
                .end(done);
        });
    });
});
