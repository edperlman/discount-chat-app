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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const ejson_1 = __importDefault(require("ejson"));
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const constants_1 = require("../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Audit Panel', () => {
    let testChannel;
    let testPrivateChannel;
    let dummyUser;
    let auditor;
    let auditorCredentials;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `chat.api-test-${Date.now()}` })).body.channel;
        testPrivateChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `chat.api-test-${Date.now()}` })).body.group;
        dummyUser = yield (0, users_helper_1.createUser)();
        auditor = yield (0, users_helper_1.createUser)({ roles: ['user', 'auditor'] });
        auditorCredentials = yield (0, users_helper_1.login)(auditor.username, user_1.password);
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        yield (0, users_helper_1.deleteUser)({ _id: dummyUser._id });
        yield (0, users_helper_1.deleteUser)({ _id: auditor._id });
        yield (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testPrivateChannel._id });
    }));
    (0, mocha_1.describe)('audit/rooms.members [no permissions]', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-members-list-all-rooms', []);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-members-list-all-rooms', ['admin', 'auditor']);
        }));
        (0, mocha_1.it)('should fail if user does not have view-members-list-all-rooms permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: 'GENERAL',
            })
                .expect(403);
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(auditorCredentials)
                .query({
                roomId: 'GENERAL',
            })
                .expect(403);
        }));
    });
    (0, mocha_1.describe)('audit/rooms.members', () => {
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .query({
                roomId: 'GENERAL',
            })
                .expect(401);
        }));
        (0, mocha_1.it)('should fail if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: random_1.Random.id(),
            })
                .expect(404);
        }));
        (0, mocha_1.it)('should fail if roomId is not present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('audit/rooms.members')).set(api_data_1.credentials).query({}).expect(400);
        }));
        (0, mocha_1.it)('should fail if roomId is an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: '',
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should fetch the members of a room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
            });
        }));
        (0, mocha_1.it)('should persist a log entry', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
            });
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('auditGetAuditions'))
                .set(api_data_1.credentials)
                .send({
                message: ejson_1.default.stringify({
                    method: 'auditGetAuditions',
                    params: [{ startDate: new Date(Date.now() - 86400000), endDate: new Date() }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const message = JSON.parse(res.body.message);
                (0, chai_1.expect)(message.result).to.be.an('array').with.lengthOf.greaterThan(1);
                const entry = message.result.find((audition) => {
                    return audition.fields.rids.includes(testChannel._id);
                });
                (0, chai_1.expect)(entry).to.have.property('u').that.is.an('object').deep.equal({
                    _id: 'rocketchat.internal.admin.test',
                    username: 'rocketchat.internal.admin.test',
                    name: 'RocketChat Internal Admin Test',
                });
                (0, chai_1.expect)(entry).to.have.property('fields').that.is.an('object');
                const { fields } = entry;
                (0, chai_1.expect)(fields).to.have.property('msg', 'Room_members_list');
                (0, chai_1.expect)(fields).to.have.property('rids').that.is.an('array').with.lengthOf(1);
            });
        }));
        (0, mocha_1.it)('should fetch the members of a room with offset and count', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('addUsersToRoom'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'addUsersToRoom',
                    params: [{ rid: testChannel._id, users: [dummyUser.username] }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                offset: 1,
                count: 1,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.members[0].username).to.be.equal(dummyUser.username);
                (0, chai_1.expect)(res.body.total).to.be.equal(2);
                (0, chai_1.expect)(res.body.offset).to.be.equal(1);
                (0, chai_1.expect)(res.body.count).to.be.equal(1);
            });
        }));
        (0, mocha_1.it)('should filter by username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                filter: dummyUser.username,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.members[0].username).to.be.equal(dummyUser.username);
            });
        }));
        (0, mocha_1.it)('should filter by user name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                filter: dummyUser.name,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.members[0].name).to.be.equal(dummyUser.name);
            });
        }));
        (0, mocha_1.it)('should sort by username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                sort: '{ "username": -1 }',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(2);
                (0, chai_1.expect)(res.body.members[1].username).to.be.equal('rocketchat.internal.admin.test');
                (0, chai_1.expect)(res.body.members[0].username).to.be.equal(dummyUser.username);
            });
        }));
        (0, mocha_1.it)('should not allow nosqlinjection on filter param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                filter: '{ "$ne": "rocketchat.internal.admin.test" }',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members).to.have.lengthOf(0);
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
                filter: { username: 'rocketchat.internal.admin.test' },
            })
                .expect(400);
        }));
        (0, mocha_1.it)('should allow to fetch info even if user is not in the room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(auditorCredentials)
                .query({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members[0].username).to.be.equal('rocketchat.internal.admin.test');
                (0, chai_1.expect)(res.body.members[1].username).to.be.equal(dummyUser.username);
                (0, chai_1.expect)(res.body.total).to.be.equal(2);
            });
        }));
        (0, mocha_1.it)('should allow to fetch info from private rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('audit/rooms.members'))
                .set(auditorCredentials)
                .query({
                roomId: testPrivateChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.members).to.be.an('array');
                (0, chai_1.expect)(res.body.members[0].username).to.be.equal('rocketchat.internal.admin.test');
                (0, chai_1.expect)(res.body.total).to.be.equal(1);
            });
        }));
    });
});
