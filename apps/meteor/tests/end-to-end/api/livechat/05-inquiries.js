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
const api_data_1 = require("../../../data/api-data");
const rooms_1 = require("../../../data/livechat/rooms");
const utils_1 = require("../../../data/livechat/utils");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
(0, mocha_1.describe)('LIVECHAT - inquiries', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
    }));
    (0, mocha_1.describe)('livechat/inquiries.list', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/inquiries.list')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an array of inquiries', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-livechat-manager', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.inquiries).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
    });
    (0, mocha_1.describe)('livechat/inquiries.getOne', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.getOne'))
                .query({ roomId: 'room-id' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should return a inquiry', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.getOne'))
                .query({ roomId: 'room-id' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('inquiry');
            });
        }));
        (0, mocha_1.it)('should get an inquiry by room id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.createAgent)();
            const visitor = yield (0, rooms_1.createVisitor)();
            yield (0, rooms_1.makeAgentAvailable)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inquiry = yield (0, rooms_1.fetchInquiry)(room._id);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/inquiries.getOne`))
                .query({ roomId: room._id })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('inquiry');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('_id', inquiry._id);
                (0, chai_1.expect)(res.body.inquiry).to.have.property('rid', room._id);
                (0, chai_1.expect)(res.body.inquiry).to.have.property('ts');
                (0, chai_1.expect)(res.body.inquiry.ts).to.be.a('string');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('status', 'queued');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('name', visitor.name);
                (0, chai_1.expect)(res.body.inquiry).to.have.property('t', 'l');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('priorityWeight');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('estimatedWaitingTimeQueue');
                (0, chai_1.expect)(res.body.inquiry.source).to.have.property('type', 'api');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('_updatedAt');
                (0, chai_1.expect)(res.body.inquiry).to.have.property('v').and.be.an('object');
                (0, chai_1.expect)(res.body.inquiry.v).to.have.property('_id', visitor._id);
            });
        }));
    });
    (0, mocha_1.describe)('POST livechat/inquiries.take', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/inquiries.take'))
                .set(api_data_1.credentials)
                .send({ inquiryId: 'room-id' })
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should throw an error when userId is provided but is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/inquiries.take'))
                .set(api_data_1.credentials)
                .send({ inquiryId: 'room-id', userId: 'invalid-user-id' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if inquiryId is not an string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/inquiries.take'))
                .set(api_data_1.credentials)
                .send({ inquiryId: { regexxxx: 'bla' }, userId: 'user-id' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should take an inquiry if all params are good', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent']);
            const agent = yield (0, rooms_1.createAgent)();
            const visitor = yield (0, rooms_1.createVisitor)();
            yield (0, rooms_1.makeAgentAvailable)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inquiry = yield (0, rooms_1.fetchInquiry)(room._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/inquiries.take'))
                .set(api_data_1.credentials)
                .send({
                inquiryId: inquiry._id,
                userId: agent._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const inquiry2 = (yield (0, rooms_1.fetchInquiry)(room._id));
            (0, chai_1.expect)((_a = inquiry2.source) === null || _a === void 0 ? void 0 : _a.type).to.equal('api');
            (0, chai_1.expect)(inquiry2.status).to.equal('taken');
        }));
        (0, mocha_1.it)('should mark a taken room as servedBy me', () => __awaiter(void 0, void 0, void 0, function* () {
            const agent = yield (0, rooms_1.createAgent)();
            const visitor = yield (0, rooms_1.createVisitor)();
            yield (0, rooms_1.makeAgentAvailable)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inquiry = yield (0, rooms_1.fetchInquiry)(room._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/inquiries.take'))
                .set(api_data_1.credentials)
                .send({
                inquiryId: inquiry._id,
                userId: agent._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const roomInfo = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(roomInfo).to.have.property('servedBy').that.is.an('object');
            (0, chai_1.expect)(roomInfo.servedBy).to.have.property('_id', 'rocketchat.internal.admin.test');
        }));
    });
    (0, mocha_1.describe)('livechat/inquiries.queuedForUser', () => {
        let testUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_accept_chats_with_no_agents', true);
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(credentials2);
            testUser = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_accept_chats_with_no_agents', false);
            yield (0, users_helper_1.deleteUser)(testUser.user);
        }));
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/inquiries.queuedForUser')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should return an array of inquiries', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.queuedForUser'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.inquiries).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
        (0, mocha_1.it)('should validate all returned inquiries are queued', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.queuedForUser'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => __awaiter(void 0, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.inquiries).to.be.an('array');
                for (const inquiry of res.body.inquiries) {
                    (0, chai_1.expect)(inquiry).to.have.property('status', 'queued');
                }
            }));
        }));
        (0, mocha_1.it)('should return only public inquiries for a user with no departments', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.queuedForUser'))
                .set(testUser.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.inquiries).to.be.an('array');
            for (const inq of body.inquiries) {
                (0, chai_1.expect)(inq).to.not.have.property('department');
                (0, chai_1.expect)(inq).to.have.property('status', 'queued');
            }
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return inquiries of the same department as the user', () => __awaiter(void 0, void 0, void 0, function* () {
            const dep = yield (0, rooms_1.createDepartment)([{ agentId: testUser.user._id }]);
            const visitor = yield (0, rooms_1.createVisitor)(dep._id);
            yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.queuedForUser'))
                .set(testUser.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.inquiries).to.be.an('array');
            const depInq = body.inquiries.filter((inq) => inq.department === dep._id);
            (0, chai_1.expect)(depInq.length).to.be.equal(1);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should not return an inquiry of a department the user is not part of', () => __awaiter(void 0, void 0, void 0, function* () {
            const dep = yield (0, rooms_1.createDepartment)();
            const visitor = yield (0, rooms_1.createVisitor)(dep._id);
            yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.queuedForUser'))
                .set(testUser.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body.inquiries).to.be.an('array');
            const depInq = body.inquiries.filter((inq) => inq.department === dep._id);
            (0, chai_1.expect)(depInq.length).to.be.equal(0);
        }));
    });
    (0, mocha_1.describe)('livechat:returnAsInquiry', () => {
        let testUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            yield (0, rooms_1.createAgent)(user.username);
            const credentials2 = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, rooms_1.makeAgentAvailable)(credentials2);
            testUser = {
                user,
                credentials: credentials2,
            };
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser.user);
        }));
        (0, mocha_1.it)('should throw an error if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:returnAsInquiry'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:returnAsInquiry',
                    params: ['test'],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const response = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(response.error.error).to.be.equal('error-not-allowed');
        }));
        (0, mocha_1.it)('should fail if provided room doesnt exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:returnAsInquiry'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:returnAsInquiry',
                    params: ['test'],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const response = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(response.error.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if room is not a livechat room', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:returnAsInquiry'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:returnAsInquiry',
                    params: ['GENERAL'],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const response = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(response.error.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if room is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:returnAsInquiry'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:returnAsInquiry',
                    params: [room._id],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const response = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(response.error.error).to.be.equal('room-closed');
        }));
        (0, mocha_1.it)('should fail if no one is serving the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:returnAsInquiry'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:returnAsInquiry',
                    params: [room._id],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const response = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(response.result).to.be.false;
        }));
        let inquiry;
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should move a room back to queue', () => __awaiter(void 0, void 0, void 0, function* () {
            const dep = yield (0, rooms_1.createDepartment)([{ agentId: testUser.user._id }]);
            const visitor = yield (0, rooms_1.createVisitor)(dep._id);
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const inq = yield (0, rooms_1.fetchInquiry)(room._id);
            inquiry = inq;
            yield (0, rooms_1.takeInquiry)(inq._id, testUser.credentials);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:returnAsInquiry'))
                .set(testUser.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:returnAsInquiry',
                    params: [room._id],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const response = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(response.result).to.be.true;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should appear on users queued elements', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/inquiries.queuedForUser'))
                .set(testUser.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body.inquiries).to.be.an('array');
            const depInq = body.inquiries.filter((inq) => inq._id === inquiry._id);
            (0, chai_1.expect)(depInq.length).to.be.equal(1);
        }));
    });
});
