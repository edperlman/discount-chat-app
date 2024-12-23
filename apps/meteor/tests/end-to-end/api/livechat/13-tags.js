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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const department_1 = require("../../../data/livechat/department");
const tags_1 = require("../../../data/livechat/tags");
const units_1 = require("../../../data/livechat/units");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] Livechat - Tags', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
    }));
    (0, mocha_1.describe)('livechat/tags', () => {
        let tagsData;
        let monitor;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            // create monitor
            const monitorUser = yield (0, users_helper_1.createUser)();
            const monitorCredentials = yield (0, users_helper_1.login)(monitorUser.username, user_1.password);
            yield (0, units_1.createMonitor)(monitorUser.username);
            monitor = {
                user: monitorUser,
                credentials: monitorCredentials,
            };
            // remove all existing tags
            const allTags = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(api_data_1.credentials)
                .query({ viewAll: 'true' })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const { tags } = allTags.body;
            try {
                for (var _d = true, tags_2 = __asyncValues(tags), tags_2_1; tags_2_1 = yield tags_2.next(), _a = tags_2_1.done, !_a; _d = true) {
                    _c = tags_2_1.value;
                    _d = false;
                    const tag = _c;
                    yield (0, tags_1.removeTag)(tag._id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = tags_2.return)) yield _b.call(tags_2);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/tags')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('tags').and.to.be.an('array').that.is.empty;
            // should add 3 tags
            const { department: dA, agent: agentA } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const tagA = yield (0, tags_1.saveTags)([dA._id]);
            const { department: dB, agent: agentB } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const tagB = yield (0, tags_1.saveTags)([dB._id]);
            const publicTag = yield (0, tags_1.saveTags)();
            tagsData = {
                caseA: { department: dA, tag: tagA, agent: agentA },
                caseB: { department: dB, tag: tagB, agent: agentB },
                casePublic: { tag: publicTag },
            };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(monitor.user);
        }));
        (0, mocha_1.it)('should throw unauthorized error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('manage-livechat-tags');
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/tags')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            yield (0, permissions_helper_1.restorePermissionToRoles)('manage-livechat-tags');
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
        }));
        (0, mocha_1.it)('should return an array of tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const { tag } = tagsData.caseA;
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(api_data_1.credentials)
                .query({ text: tag.name, viewAll: 'true' })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(response.body.tags[0]).to.have.property('_id', tag._id);
        }));
        (0, mocha_1.it)('[Manager role] show return all tags when "viewAll" param is true and user has access to all tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(api_data_1.credentials)
                .query({ viewAll: 'true' })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(3);
            const expectedTags = [tagsData.caseA.tag, tagsData.caseB.tag, tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Monitor role] show return only public tags when "viewAll" param is true and user does not have access to all tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(monitor.credentials)
                .query({ viewAll: 'true' })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(1);
            const expectedTags = [tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Manager Role] should return department tags and public tags when "departmentId" param is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = tagsData.caseA;
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(api_data_1.credentials)
                .query({ department: department._id })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(2);
            const expectedTags = [tagsData.caseA.tag, tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Manager role] should return public tags when "departmentId" param is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/tags')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(response.body.tags[0]).to.have.property('_id', tagsData.casePublic.tag._id);
        }));
        (0, mocha_1.it)('[Monitor role] should return only public tags when user does not have access to department', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = tagsData.caseA;
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(monitor.credentials)
                .query({ department: department._id })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(1);
            const expectedTags = [tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Monitor Role] should return department tags and public tags when "departmentId" param is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = tagsData.caseA;
            yield (0, units_1.createUnit)(monitor.user._id, monitor.user.username || '', [department._id]);
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(monitor.credentials)
                .query({ department: department._id })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(2);
            const expectedTags = [tagsData.caseA.tag, tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Agent Role] should return department tags and public tags when "departmentId" param is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department, agent } = tagsData.caseA;
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(agent.credentials)
                .query({ department: department._id })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(2);
            const expectedTags = [tagsData.caseA.tag, tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Monitor role] should return public tags and department tags which they are part of, when "departmentId" param is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(2);
            const expectedTags = [tagsData.caseA.tag, tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
        (0, mocha_1.it)('[Agent role] should return public tags when "departmentId" param is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/tags'))
                .set(monitor.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body.tags).to.be.an('array').with.lengthOf(2);
            const expectedTags = [tagsData.caseA.tag, tagsData.casePublic.tag].map((tag) => tag._id).sort();
            const actualTags = response.body.tags.map((tag) => tag._id).sort();
            (0, chai_1.expect)(actualTags).to.deep.equal(expectedTags);
        }));
    });
    (0, mocha_1.describe)('livechat/tags/:tagId', () => {
        (0, mocha_1.it)('should throw unauthorized error when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-tags', []);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/tags/123')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return null when the tag does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-tags', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['livechat-agent']);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/tags/123')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(200);
            (0, chai_1.expect)(response.body.body).to.be.null;
        }));
        (0, mocha_1.it)('should return a tag', () => __awaiter(void 0, void 0, void 0, function* () {
            const tag = yield (0, tags_1.saveTags)();
            const response = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/tags/${tag._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('_id', tag._id);
            (0, chai_1.expect)(response.body).to.have.property('name', tag.name);
            (0, chai_1.expect)(response.body).to.have.property('numDepartments', 0);
        }));
    });
});
