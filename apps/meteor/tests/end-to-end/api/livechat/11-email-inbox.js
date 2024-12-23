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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const inboxes_1 = require("../../../data/livechat/inboxes");
const permissions_helper_1 = require("../../../data/permissions.helper");
(0, mocha_1.describe)('Email inbox', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    let testInbox = '';
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.api)('email-inbox'))
            .set(api_data_1.credentials)
            .send({
            active: true,
            name: 'test-email-inbox##',
            email: 'test-email@example.com',
            description: 'test email inbox',
            senderInfo: 'test email inbox',
            smtp: {
                server: 'smtp.example.com',
                port: 587,
                username: 'example@example.com',
                password: 'not-a-real-password',
                secure: true,
            },
            imap: {
                server: 'imap.example.com',
                port: 993,
                username: 'example@example.com',
                password: 'not-a-real-password',
                secure: true,
                maxRetries: 10,
            },
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success');
            if (res.body.success === true) {
                testInbox = res.body._id;
            }
            else {
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error.includes('E11000')).to.be.eq(true);
            }
        });
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (testInbox) {
            yield api_data_1.request
                .delete((0, api_data_1.api)(`email-inbox/${testInbox}`))
                .set(api_data_1.credentials)
                .send()
                .expect(200);
        }
    }));
    (0, mocha_1.describe)('GET email-inbox.list', () => {
        (0, mocha_1.it)('should fail if user doesnt have manage-email-inbox permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', []);
            yield api_data_1.request.get((0, api_data_1.api)('email-inbox.list')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return a list of email inboxes', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            const res = yield api_data_1.request.get((0, api_data_1.api)('email-inbox.list')).set(api_data_1.credentials).send().expect('Content-Type', 'application/json').expect(200);
            (0, chai_1.expect)(res.body).to.have.property('emailInboxes');
            (0, chai_1.expect)(res.body.emailInboxes).to.be.an('array');
            (0, chai_1.expect)(res.body.emailInboxes).to.have.length.of.at.least(1);
            (0, chai_1.expect)(res.body.emailInboxes.filter((ibx) => ibx.email === 'test-email@example.com')).to.have.length.gte(1);
            // make sure we delete the test inbox, even if creation failed on this test run
            testInbox = res.body.emailInboxes.filter((ibx) => ibx.email === 'test-email@example.com')[0]._id;
            (0, chai_1.expect)(res.body).to.have.property('total');
            (0, chai_1.expect)(res.body.total).to.be.a('number');
            (0, chai_1.expect)(res.body).to.have.property('count');
            (0, chai_1.expect)(res.body.count).to.be.a('number');
            (0, chai_1.expect)(res.body).to.have.property('offset');
            (0, chai_1.expect)(res.body.offset).to.be.a('number');
        }));
    });
    (0, mocha_1.describe)('POST email-inbox', () => {
        let inboxId;
        const mockedPayload = {
            name: 'test',
            active: false,
            email: `test${new Date().getTime()}@test.com`,
            description: 'Updated test description',
            senderInfo: 'test',
            smtp: {
                server: 'smtp.example.com',
                port: 587,
                username: 'xxxx',
                password: 'xxxx',
                secure: true,
            },
            imap: {
                server: 'imap.example.com',
                port: 993,
                username: 'xxxx',
                password: 'xxxx',
                secure: true,
                maxRetries: 10,
            },
        };
        (0, mocha_1.it)('should fail if user doesnt have manage-email-inbox permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', []);
            yield api_data_1.request.post((0, api_data_1.api)('email-inbox')).set(api_data_1.credentials).send({}).expect(403);
        }));
        (0, mocha_1.it)('should fail if smtp config is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            yield api_data_1.request.post((0, api_data_1.api)('email-inbox')).set(api_data_1.credentials).send({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if imap config is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            const { imap } = mockedPayload, payload = __rest(mockedPayload, ["imap"]);
            yield api_data_1.request.post((0, api_data_1.api)('email-inbox')).set(api_data_1.credentials).send(payload).expect(400);
        }));
        (0, mocha_1.it)('should fail if name is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            const { name } = mockedPayload, payload = __rest(mockedPayload, ["name"]);
            yield api_data_1.request.post((0, api_data_1.api)('email-inbox')).set(api_data_1.credentials).send(payload).expect(400);
        }));
        (0, mocha_1.it)('should fail if active is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            const { active } = mockedPayload, payload = __rest(mockedPayload, ["active"]);
            yield api_data_1.request.post((0, api_data_1.api)('email-inbox')).set(api_data_1.credentials).send(payload).expect(400);
        }));
        (0, mocha_1.it)('should fail if email is not on body params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            const { email } = mockedPayload, payload = __rest(mockedPayload, ["email"]);
            yield api_data_1.request.post((0, api_data_1.api)('email-inbox')).set(api_data_1.credentials).send(payload).expect(400);
        }));
        (0, mocha_1.it)('should save an email inbox', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            const { email } = mockedPayload, payload = __rest(mockedPayload, ["email"]);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('email-inbox'))
                .set(api_data_1.credentials)
                .send(Object.assign(Object.assign({}, payload), { email: `test${new Date().getTime()}@test.com` }))
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id');
            inboxId = body._id;
        }));
        (0, mocha_1.it)('should update an email inbox when _id is passed in the object', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('email-inbox'))
                .set(api_data_1.credentials)
                .send(Object.assign(Object.assign({}, mockedPayload), { _id: inboxId, description: 'Updated test description' }))
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id');
        }));
    });
    (0, mocha_1.describe)('GET email-inbox/:_id', () => {
        (0, mocha_1.it)('should fail if user doesnt have manage-email-inbox permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', []);
            yield api_data_1.request.get((0, api_data_1.api)('email-inbox/123')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should fail when email inbox does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            yield api_data_1.request.get((0, api_data_1.api)('email-inbox/123')).set(api_data_1.credentials).expect(404);
        }));
        (0, mocha_1.it)('should return an email inbox', () => __awaiter(void 0, void 0, void 0, function* () {
            const inbox = yield (0, inboxes_1.createEmailInbox)();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`email-inbox/${inbox._id}`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('_id');
            (0, chai_1.expect)(body).to.have.property('name', 'test');
        }));
    });
    (0, mocha_1.describe)('DELETE email-inbox/:_id', () => {
        (0, mocha_1.it)('should fail if user doesnt have manage-email-inbox permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', []);
            yield api_data_1.request.delete((0, api_data_1.api)('email-inbox/123')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return nothing when email inbox does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            yield api_data_1.request.delete((0, api_data_1.api)('email-inbox/123')).set(api_data_1.credentials).expect(404);
        }));
        (0, mocha_1.it)('should delete an email inbox', () => __awaiter(void 0, void 0, void 0, function* () {
            const inbox = yield (0, inboxes_1.createEmailInbox)();
            const { body } = yield api_data_1.request
                .delete((0, api_data_1.api)(`email-inbox/${inbox._id}`))
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
    });
    (0, mocha_1.describe)('GET email-inbox.search', () => {
        (0, mocha_1.it)('should fail if user doesnt have manage-email-inbox permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', []);
            yield api_data_1.request.get((0, api_data_1.api)('email-inbox.search')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return an email inbox matching email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, inboxes_1.createEmailInbox)();
            yield (0, permissions_helper_1.updatePermission)('manage-email-inbox', ['admin']);
            yield api_data_1.request.get((0, api_data_1.api)('email-inbox.search')).query({ email: 'test' }).set(api_data_1.credentials).expect(200);
        }));
    });
});
