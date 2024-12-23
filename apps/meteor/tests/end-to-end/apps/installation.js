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
const apps_data_1 = require("../../data/apps/apps-data");
const helper_1 = require("../../data/apps/helper");
const permissions_helper_1 = require("../../data/permissions.helper");
const users_helper_1 = require("../../data/users.helper");
const constants_1 = require("../../e2e/config/constants");
const APP_USERNAME = 'appsrocketchattester.bot';
(0, mocha_1.describe)('Apps - Installation', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, helper_1.cleanupApps)(); }));
    (0, mocha_1.after)(() => Promise.all([(0, helper_1.cleanupApps)(), (0, permissions_helper_1.updatePermission)('manage-apps', ['admin'])]));
    (0, mocha_1.describe)('[Installation]', () => {
        (0, mocha_1.it)('should throw an error when trying to install an app and the apps framework is enabled but the user does not have the permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-apps', []).then(() => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)())
                    .set(api_data_1.credentials)
                    .send({
                    url: apps_data_1.APP_URL,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should succesfully install an app from a URL in EE, which should be auto-enabled', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-apps', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)())
                    .set(api_data_1.credentials)
                    .send({
                    url: apps_data_1.APP_URL,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('app');
                    (0, chai_1.expect)(res.body.app).to.have.a.property('id');
                    (0, chai_1.expect)(res.body.app).to.have.a.property('version');
                    (0, chai_1.expect)(res.body.app).to.have.a.property('status').and.to.be.equal('auto_enabled');
                })
                    .end(done);
            });
        });
        (!constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should succesfully install an app from a URL in CE, which should not be enabled', (done) => {
            void (0, permissions_helper_1.updatePermission)('manage-apps', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)())
                    .set(api_data_1.credentials)
                    .send({
                    url: apps_data_1.APP_URL,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('app');
                    (0, chai_1.expect)(res.body.app).to.have.a.property('id');
                    (0, chai_1.expect)(res.body.app).to.have.a.property('version');
                    (0, chai_1.expect)(res.body.app).to.have.a.property('status').and.to.be.equal('initialized');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should have created the app user successfully', (done) => {
            void (0, users_helper_1.getUserByUsername)(APP_USERNAME)
                .then((user) => {
                (0, chai_1.expect)(user.username).to.be.equal(APP_USERNAME);
            })
                .then(done);
        });
        (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Slash commands registration', () => {
            (0, mocha_1.it)('should have created the "test-simple" slash command successfully', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('commands.get'))
                    .query({ command: 'test-simple' })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('command');
                    (0, chai_1.expect)(res.body.command.command).to.be.equal('test-simple');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should have created the "test-with-arguments" slash command successfully', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('commands.get'))
                    .query({ command: 'test-with-arguments' })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('command');
                    (0, chai_1.expect)(res.body.command.command).to.be.equal('test-with-arguments');
                })
                    .end(done);
            });
        });
        (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Video Conf Provider registration', () => {
            (0, mocha_1.it)('should have created two video conf provider successfully', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('video-conference.providers'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('data').that.is.an('array').with.lengthOf(3);
                    (0, chai_1.expect)(res.body.data[0]).to.be.an('object').with.a.property('key').equal('test');
                    (0, chai_1.expect)(res.body.data[1]).to.be.an('object').with.a.property('key').equal('persistentchat');
                    (0, chai_1.expect)(res.body.data[2]).to.be.an('object').with.a.property('key').equal('unconfigured');
                })
                    .end(done);
            });
        });
    });
});
