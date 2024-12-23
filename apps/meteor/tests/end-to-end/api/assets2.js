"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const interactions_1 = require("../../data/interactions");
const permissions_helper_1 = require("../../data/permissions.helper");
(0, mocha_1.describe)('[Assets]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => (0, permissions_helper_1.updatePermission)('manage-assets', ['admin']));
    (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('manage-assets', ['admin']));
    (0, mocha_1.describe)('[/assets.setAsset]', () => {
        (0, mocha_1.it)('should set the "logo" asset', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('assets.setAsset'))
                .set(api_data_1.credentials)
                .attach('asset', interactions_1.imgURL)
                .field({
                assetName: 'logo',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when we try set an invalid asset', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('assets.setAsset'))
                .set(api_data_1.credentials)
                .attach('invalidAsset', interactions_1.imgURL)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/assets.unsetAsset]', () => {
        (0, mocha_1.it)('should unset the "logo" asset', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('assets.unsetAsset'))
                .set(api_data_1.credentials)
                .send({
                assetName: 'logo',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when we try set an invalid asset', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('assets.unsetAsset'))
                .set(api_data_1.credentials)
                .send({
                assetName: 'invalidAsset',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
});
