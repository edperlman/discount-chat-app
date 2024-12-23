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
const constants_1 = require("../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Apps - Uninstall', () => {
    let app;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helper_1.cleanupApps)();
        app = yield (0, helper_1.installTestApp)();
    }));
    (0, mocha_1.after)(() => (0, helper_1.cleanupApps)());
    (0, mocha_1.describe)('[Uninstall]', () => {
        (0, mocha_1.it)('should throw an error when trying to uninstall an invalid app', (done) => {
            void api_data_1.request
                .delete((0, apps_data_1.apps)('/invalid-id'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(404)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('No App found by the id of: invalid-id');
            })
                .end(done);
        });
        (0, mocha_1.it)('should remove the app successfully', (done) => {
            void api_data_1.request
                .delete((0, apps_data_1.apps)(`/${app.id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('app');
                (0, chai_1.expect)(res.body.app.id).to.be.equal(app.id);
                (0, chai_1.expect)(res.body.app.status).to.be.equal('disabled');
            })
                .end(done);
        });
    });
});
