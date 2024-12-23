"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
(0, mocha_1.describe)('[Webdav]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('/webdav.getMyAccounts', () => {
        (0, mocha_1.it)('should return my webdav accounts', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('webdav.getMyAccounts'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('accounts').and.to.be.a('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/webdav.removeWebdavAccount', () => {
        (0, mocha_1.it)('should return an error when send an invalid request', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('webdav.removeWebdavAccount'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when using an invalid account id', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('webdav.removeWebdavAccount'))
                .set(api_data_1.credentials)
                .send({
                accountId: {},
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
    });
});
