"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const permissions_helper_1 = require("../../data/permissions.helper");
(0, mocha_1.describe)('[Statistics]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('view-statistics', ['admin']));
    (0, mocha_1.describe)('[/statistics]', () => {
        let lastUptime;
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-statistics', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('statistics'))
                    .set(api_data_1.credentials)
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('error-not-allowed');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an object with the statistics', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-statistics', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('statistics'))
                    .set(api_data_1.credentials)
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('process');
                    (0, chai_1.expect)(res.body.process).to.have.property('uptime');
                    lastUptime = res.body.process.uptime;
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should update the statistics when is provided the "refresh:true" query parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('statistics'))
                .query({ refresh: 'true' })
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('process');
                (0, chai_1.expect)(res.body.process).to.have.property('uptime');
                (0, chai_1.expect)(lastUptime).to.not.be.equal(res.body.process.uptime);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/statistics.list]', () => {
        (0, mocha_1.it)('should return an error when the user does not have the necessary permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-statistics', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('statistics.list'))
                    .set(api_data_1.credentials)
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('error-not-allowed');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an array with the statistics', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-statistics', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('statistics.list'))
                    .set(api_data_1.credentials)
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('statistics').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an array with the statistics even requested with count and offset params', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-statistics', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('statistics.list'))
                    .set(api_data_1.credentials)
                    .query({
                    count: 5,
                    offset: 0,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('statistics').and.to.be.an('array');
                    (0, chai_1.expect)(res.body).to.have.property('offset');
                    (0, chai_1.expect)(res.body).to.have.property('total');
                    (0, chai_1.expect)(res.body).to.have.property('count');
                })
                    .end(done);
            });
        });
    });
});
