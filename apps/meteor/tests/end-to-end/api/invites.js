"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
(0, mocha_1.describe)('Invites', () => {
    let testInviteID;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('POST [/findOrCreateInvite]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('findOrCreateInvite'))
                .send({
                rid: 'GENERAL',
                days: 1,
                maxUses: 10,
            })
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if invalid roomid', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('findOrCreateInvite'))
                .set(api_data_1.credentials)
                .send({
                rid: 'invalid',
                days: 1,
                maxUses: 10,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-room');
            })
                .end(done);
        });
        (0, mocha_1.it)('should create an invite for GENERAL', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('findOrCreateInvite'))
                .set(api_data_1.credentials)
                .send({
                rid: 'GENERAL',
                days: 1,
                maxUses: 10,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('days', 1);
                (0, chai_1.expect)(res.body).to.have.property('maxUses', 10);
                (0, chai_1.expect)(res.body).to.have.property('uses');
                (0, chai_1.expect)(res.body).to.have.property('_id');
                testInviteID = res.body._id;
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an existing invite for GENERAL', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('findOrCreateInvite'))
                .set(api_data_1.credentials)
                .send({
                rid: 'GENERAL',
                days: 1,
                maxUses: 10,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('days', 1);
                (0, chai_1.expect)(res.body).to.have.property('maxUses', 10);
                (0, chai_1.expect)(res.body).to.have.property('uses');
                (0, chai_1.expect)(res.body).to.have.property('_id', testInviteID);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('GET [/listInvites]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('listInvites'))
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the existing invite for GENERAL', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('listInvites'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body[0]).to.have.property('_id', testInviteID);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('POST [/useInviteToken]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('useInviteToken'))
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if invalid token', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('useInviteToken'))
                .set(api_data_1.credentials)
                .send({
                token: 'invalid',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-token');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if missing token', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('useInviteToken'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.it)('should use the existing invite for GENERAL', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('useInviteToken'))
                .set(api_data_1.credentials)
                .send({
                token: testInviteID,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('POST [/validateInviteToken]', () => {
        (0, mocha_1.it)('should warn if invalid token', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('validateInviteToken'))
                .set(api_data_1.credentials)
                .send({
                token: 'invalid',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('valid', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should succeed when valid token', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('validateInviteToken'))
                .set(api_data_1.credentials)
                .send({
                token: testInviteID,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('valid', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('DELETE [/removeInvite]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .delete((0, api_data_1.api)(`removeInvite/${testInviteID}`))
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if invalid token', (done) => {
            void api_data_1.request
                .delete((0, api_data_1.api)('removeInvite/invalid'))
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-invitation-id');
            })
                .end(done);
        });
        (0, mocha_1.it)('should succeed when valid token', (done) => {
            void api_data_1.request
                .delete((0, api_data_1.api)(`removeInvite/${testInviteID}`))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.equal(true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail when deleting the same invite again', (done) => {
            void api_data_1.request
                .delete((0, api_data_1.api)(`removeInvite/${testInviteID}`))
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-invitation-id');
            })
                .end(done);
        });
    });
});
