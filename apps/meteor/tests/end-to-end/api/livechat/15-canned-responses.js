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
const faker_1 = require("@faker-js/faker");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const canned_responses_1 = require("../../../data/livechat/canned-responses");
const rooms_1 = require("../../../data/livechat/rooms");
const tags_1 = require("../../../data/livechat/tags");
const units_1 = require("../../../data/livechat/units");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] LIVECHAT - Canned responses', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('canned-responses.get', () => {
        (0, mocha_1.it)('should throw unauthorized when view-canned-responses permission is not set', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-canned-responses', []);
            return api_data_1.request.get((0, api_data_1.api)('canned-responses.get')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return an array of canned responses when available', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-canned-responses', ['livechat-agent', 'livechat-monitor', 'livechat-manager', 'admin']);
            yield (0, canned_responses_1.createCannedResponse)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses.get')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.responses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.responses[0]).to.have.property('_id');
            (0, chai_1.expect)(body.responses[0]).to.have.property('shortcut');
            (0, chai_1.expect)(body.responses[0]).to.have.property('scope');
            (0, chai_1.expect)(body.responses[0]).to.have.property('tags');
            (0, chai_1.expect)(body.responses[0]).to.have.property('text');
            (0, chai_1.expect)(body.responses[0]).to.have.property('userId');
        }));
        (0, mocha_1.it)('should return canned responses for monitors even if department is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            const monitor = yield (0, units_1.createMonitor)(user.username);
            const creds = yield (0, users_helper_1.login)(user.username, user_1.password);
            const department = yield (0, rooms_1.createDepartment)(undefined, undefined, false);
            yield (0, units_1.createUnit)(monitor._id, user.username, [department._id]);
            // create canned response
            const shortcut = faker_1.faker.string.uuid();
            yield api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut, scope: 'department', tags: ['tag'], text: 'text', departmentId: department._id })
                .expect(200);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses.get')).set(creds).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.responses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.responses.find((response) => response.shortcut === shortcut)).to.be.an('object');
        }));
        (0, mocha_1.it)('should return canned respones for scope user when agent is not on any department', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const creds = yield (0, users_helper_1.login)(user.username, user_1.password);
            // create canned response
            const shortcut = faker_1.faker.string.uuid();
            yield api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(creds)
                .send({ shortcut, scope: 'user', tags: ['tag'], text: 'text' })
                .expect(200);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses.get')).set(creds).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.responses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.responses.find((response) => response.shortcut === shortcut)).to.be.an('object');
        }));
        (0, mocha_1.it)('should return canned responses on the global scope', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            const creds = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.createAgent)(user.username);
            // create canned response
            const shortcut = faker_1.faker.string.uuid();
            yield api_data_1.request.post((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).send({ shortcut, scope: 'global', text: 'text' }).expect(200);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses.get')).set(creds).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.responses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.responses.find((response) => response.shortcut === shortcut)).to.be.an('object');
        }));
        (0, mocha_1.it)('should return canned responses from the departments user is in', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            const creds = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.createAgent)(user.username);
            const department = yield (0, rooms_1.createDepartment)([{ agentId: user._id }], undefined, true);
            // create canned response
            const shortcut = faker_1.faker.string.uuid();
            yield api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut, scope: 'department', text: 'text', departmentId: department._id })
                .expect(200);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses.get')).set(creds).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.responses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.responses.find((response) => response.shortcut === shortcut)).to.be.an('object');
        }));
    });
    (0, mocha_1.describe)('[GET] canned-responses', () => {
        (0, mocha_1.it)('should fail if user dont have view-canned-responses permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-canned-responses', []);
            return api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return an array of canned responses when available', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-canned-responses', ['livechat-agent', 'livechat-monitor', 'livechat-manager', 'admin']);
            yield (0, canned_responses_1.createCannedResponse)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).query({ sort: '{ "_createdAt": -1 }' }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.cannedResponses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('_id');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('shortcut');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('scope');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('tags');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('text');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('userId');
        }));
        (0, mocha_1.it)('should return a canned response matching the params provided (shortcut)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, canned_responses_1.createCannedResponse)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ shortcut: response.shortcut }).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.cannedResponses).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('_id');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('shortcut', response.shortcut);
        }));
        (0, mocha_1.it)('should return a canned response matching the params provided (scope)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, canned_responses_1.createCannedResponse)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ scope: response.scope }).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.cannedResponses).to.be.an('array').with.lengthOf.greaterThan(0);
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('_id');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('scope', response.scope);
        }));
        (0, mocha_1.it)('should return a canned response matching the params provided (tags)', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const response = yield (0, canned_responses_1.createCannedResponse)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ 'tags[]': (_a = response.tags) === null || _a === void 0 ? void 0 : _a[0] }).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.cannedResponses).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('_id');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('tags').that.is.an('array').which.includes((_b = response.tags) === null || _b === void 0 ? void 0 : _b[0]);
        }));
        (0, mocha_1.it)('should return a canned response matching the params provided (text)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, canned_responses_1.createCannedResponse)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ text: response.text }).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.cannedResponses).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('_id');
            (0, chai_1.expect)(body.cannedResponses[0]).to.have.property('text', response.text);
        }));
    });
    (0, mocha_1.describe)('[POST] canned-responses', () => {
        (0, mocha_1.it)('should fail if user dont have save-canned-responses permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('save-canned-responses', []);
            return api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut: 'shortcut', scope: 'user', tags: ['tag'], text: 'text' })
                .expect(403);
        }));
        (0, mocha_1.it)('should fail if shortcut is not on the request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('save-canned-responses', ['livechat-agent', 'livechat-monitor', 'livechat-manager', 'admin']);
            return api_data_1.request.post((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if text is not on the request', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request.post((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).send({ shortcut: 'shortcut' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if scope is not on the request', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request.post((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).send({ shortcut: 'shortcut', text: 'text' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if tags is not an array of strings', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut: 'shortcut', text: 'text', scope: 'department', tags: 'tag' })
                .expect(400);
        }));
        (0, mocha_1.it)('should create a new canned response', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut: 'shortcutxx', scope: 'user', tags: ['tag'], text: 'text' })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should fail if shortcut is already in use', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut: 'shortcutxx', scope: 'user', tags: ['tag'], text: 'text' })
                .expect(400);
        }));
        (0, mocha_1.it)('should save a canned response related to an EE tag', () => __awaiter(void 0, void 0, void 0, function* () {
            const tag = yield (0, tags_1.saveTags)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut: 'shortcutxxx', scope: 'user', tags: [tag.name], text: 'text' })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            const { body: getResult } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ 'tags[]': tag.name }).expect(200);
            (0, chai_1.expect)(getResult).to.have.property('success', true);
            (0, chai_1.expect)(getResult.cannedResponses).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(getResult.cannedResponses[0]).to.have.property('_id');
            (0, chai_1.expect)(getResult.cannedResponses[0]).to.have.property('tags').that.is.an('array').which.includes(tag.name);
        }));
        (0, mocha_1.it)('should not include removed tags in the response', () => __awaiter(void 0, void 0, void 0, function* () {
            const tag = yield (0, tags_1.saveTags)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('canned-responses'))
                .set(api_data_1.credentials)
                .send({ shortcut: 'shortcutxxxx', scope: 'user', tags: [tag.name], text: 'text' })
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            yield (0, tags_1.removeTag)(tag._id);
            const { body: getResult } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ 'tags[]': tag.name }).expect(200);
            (0, chai_1.expect)(getResult).to.have.property('success', true);
            (0, chai_1.expect)(getResult.cannedResponses).to.be.an('array').with.lengthOf(0);
        }));
    });
    (0, mocha_1.describe)('[DELETE] canned-responses', () => {
        (0, mocha_1.it)('should fail if user dont have remove-canned-responses permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('remove-canned-responses', []);
            return api_data_1.request.delete((0, api_data_1.api)('canned-responses')).send({ _id: 'sfdads' }).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should fail if _id is not on the request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('remove-canned-responses', ['livechat-agent', 'livechat-monitor', 'livechat-manager', 'admin']);
            return api_data_1.request.delete((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should delete a canned response', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, canned_responses_1.createCannedResponse)();
            const { body: cr } = yield api_data_1.request.get((0, api_data_1.api)('canned-responses')).set(api_data_1.credentials).query({ shortcut: response.shortcut }).expect(200);
            const { body } = yield api_data_1.request.delete((0, api_data_1.api)('canned-responses')).send({ _id: cr.cannedResponses[0]._id }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
        }));
    });
});
