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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const faker_1 = require("@faker-js/faker");
const core_typings_1 = require("@rocket.chat/core-typings");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../../data/api-data");
const custom_fields_1 = require("../../../data/livechat/custom-fields");
const department_1 = require("../../../data/livechat/department");
const priorities_1 = require("../../../data/livechat/priorities");
const rooms_1 = require("../../../data/livechat/rooms");
const tags_1 = require("../../../data/livechat/tags");
const utils_1 = require("../../../data/livechat/utils");
const permissions_helper_1 = require("../../../data/permissions.helper");
const user_1 = require("../../../data/user");
const users_helper_1 = require("../../../data/users.helper");
const constants_1 = require("../../../e2e/config/constants");
const getSubscriptionForRoom = (roomId, overrideCredential) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api_data_1.request
        .get((0, api_data_1.api)('subscriptions.getOne'))
        .set(overrideCredential || api_data_1.credentials)
        .query({ roomId })
        .expect('Content-Type', 'application/json')
        .expect(200);
    const { subscription } = response.body;
    return subscription;
});
(0, mocha_1.describe)('LIVECHAT - rooms', () => {
    let visitor;
    let room;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
        visitor = yield (0, rooms_1.createVisitor)();
        room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
    }));
    (0, mocha_1.describe)('livechat/room', () => {
        (0, mocha_1.it)('should fail when token is not passed as query parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).expect(400);
        }));
        (0, mocha_1.it)('should fail when token is not a valid guest token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: 'invalid-token' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if rid is passed but doesnt point to a valid room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token, rid: 'invalid-rid' }).expect(400);
        }));
        (0, mocha_1.it)('should create a room for visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('room');
            (0, chai_1.expect)(body.room).to.have.property('v');
            (0, chai_1.expect)(body.room.v).to.have.property('token', visitor.token);
            (0, chai_1.expect)(body.room.source.type).to.be.equal('api');
        }));
        (0, mocha_1.it)('should return an existing open room when visitor has one available', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('room');
            (0, chai_1.expect)(body.room).to.have.property('v');
            (0, chai_1.expect)(body.room.v).to.have.property('token', visitor.token);
            const { body: body2 } = yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token });
            (0, chai_1.expect)(body2).to.have.property('success', true);
            (0, chai_1.expect)(body2).to.have.property('room');
            (0, chai_1.expect)(body2.room).to.have.property('_id', body.room._id);
            (0, chai_1.expect)(body2.newRoom).to.be.false;
        }));
        (0, mocha_1.it)('should return a room for the visitor when rid points to a valid open room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/room')).query({ token: visitor.token, rid: room._id });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('room');
            (0, chai_1.expect)(body.room.v).to.have.property('token', visitor.token);
            (0, chai_1.expect)(body.newRoom).to.be.false;
        }));
        (0, mocha_1.it)('should properly read widget cookies', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/room'))
                .set('Cookie', [`rc_room_type=l`, `rc_is_widget=t`])
                .query({ token: visitor.token });
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('room');
            (0, chai_1.expect)(body.room.v).to.have.property('token', visitor.token);
            (0, chai_1.expect)(body.room.source.type).to.be.equal('widget');
        }));
    });
    (0, mocha_1.describe)('livechat/rooms', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-rooms');
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('unauthorized');
            });
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-rooms');
        }));
        (0, mocha_1.it)('should return an error when the "agents" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ agents: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "roomName" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ 'roomName[]': 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "departmentId" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ 'departmentId[]': 'marcos' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "open" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ 'open[]': 'true' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "tags" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ tags: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "createdAt" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ createdAt: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "closedAt" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ closedAt: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error when the "customFields" query parameter is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ customFields: 'invalid' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an array of rooms when has no parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
        (0, mocha_1.it)('should return an array of rooms when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/rooms`))
                .set(api_data_1.credentials)
                .query({
                'agents[]': 'teste',
                'departmentId': '123',
                'open': true,
                'createdAt': '{"start":"2018-01-26T00:11:22.345Z","end":"2018-01-26T00:11:22.345Z"}',
                'closedAt': '{"start":"2018-01-26T00:11:22.345Z","end":"2018-01-26T00:11:22.345Z"}',
                'tags[]': 'rocket',
                'customFields': '{ "docId": "031041" }',
                'count': 3,
                'offset': 1,
                'sort': '{ "_updatedAt": 1 }',
                'fields': '{ "msgs": 0 }',
                'roomName': 'test',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
        (0, mocha_1.it)('should not cause issues when the customFields is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/rooms`))
                .set(api_data_1.credentials)
                .query({ customFields: {}, roomName: 'test' })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
        }));
        (0, mocha_1.it)('should throw an error if customFields param is not a object', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/rooms`))
                .set(api_data_1.credentials)
                .query({ customFields: 'string' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should only return closed rooms when "open" is set to false', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create and close a room
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ open: false, roomName: room.fname }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.every((room) => !!room.closedAt)).to.be.true;
            (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room._id)).to.be.not.undefined;
        }));
        (0, mocha_1.it)('should only return open rooms when "open" is set to true', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create and close a room
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ open: true, roomName: room.fname }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.every((room) => room.open)).to.be.true;
            (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room._id)).to.be.undefined;
        }));
        (0, mocha_1.it)('should return both closed/open when open param is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            // Create and close a room
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.some((room) => !!room.closedAt)).to.be.true;
            (0, chai_1.expect)(body.rooms.some((room) => room.open)).to.be.true;
        }));
        (0, mocha_1.it)('should return queued rooms when `queued` param is passed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ queued: true }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.every((room) => room.open)).to.be.true;
            (0, chai_1.expect)(body.rooms.every((room) => !room.servedBy)).to.be.true;
            (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room._id)).to.be.not.undefined;
        }));
        (0, mocha_1.it)('should return queued rooms when `queued` and `open` params are passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ queued: true, open: true }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.every((room) => room.open)).to.be.true;
            (0, chai_1.expect)(body.rooms.every((room) => !room.servedBy)).to.be.true;
            (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room._id)).to.be.not.undefined;
        }));
        (0, mocha_1.it)('should return open rooms when `open` is param is passed. Open rooms should not include queued conversations', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { room: room2 } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ open: true }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.every((room) => room.open)).to.be.true;
            (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room2._id)).to.be.not.undefined;
            (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room._id)).to.be.undefined;
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
        }));
        (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Queued and OnHold chats', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold', true);
                yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
                yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold', false);
            }));
            (0, mocha_1.it)('should not return on hold rooms along with queued rooms when `queued` is true and `onHold` is true', () => __awaiter(void 0, void 0, void 0, function* () {
                const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
                yield (0, rooms_1.sendAgentMessage)(room._id);
                const response = yield api_data_1.request
                    .post((0, api_data_1.api)('livechat/room.onHold'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: room._id,
                })
                    .expect(200);
                (0, chai_1.expect)(response.body.success).to.be.true;
                const visitor = yield (0, rooms_1.createVisitor)();
                const room2 = yield (0, rooms_1.createLivechatRoom)(visitor.token);
                const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ queued: true, onhold: true }).set(api_data_1.credentials).expect(200);
                (0, chai_1.expect)(body.rooms.every((room) => room.open)).to.be.true;
                (0, chai_1.expect)(body.rooms.every((room) => !room.servedBy)).to.be.true;
                (0, chai_1.expect)(body.rooms.every((room) => !room.onHold)).to.be.true;
                (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room._id)).to.be.undefined;
                (0, chai_1.expect)(body.rooms.find((froom) => froom._id === room2._id)).to.be.not.undefined;
            }));
        });
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return only rooms with the given department', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { room: expectedRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({
                departmentId: department._id,
            });
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ departmentId: department._id }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.length).to.be.equal(1);
            (0, chai_1.expect)(body.rooms.some((room) => room._id === expectedRoom._id)).to.be.true;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return rooms with the given department and the given status', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { room: expectedRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({
                departmentId: department._id,
            });
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ departmentId: department._id, open: true })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body.rooms.length).to.be.equal(1);
            (0, chai_1.expect)(body.rooms.some((room) => room._id === expectedRoom._id)).to.be.true;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return no rooms with the given department and the given status (if none match the filter)', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({
                departmentId: department._id,
            });
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/rooms'))
                .query({ departmentId: department._id, open: false })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(body.rooms.length).to.be.equal(0);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return only rooms served by the given agent', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department, agent } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { room: expectedRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({
                departmentId: department._id,
                agent: agent.credentials,
            });
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ 'agents[]': agent.user._id }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.length).to.be.equal(1);
            (0, chai_1.expect)(body.rooms.some((room) => room._id === expectedRoom._id)).to.be.true;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return only rooms with the given tags', () => __awaiter(void 0, void 0, void 0, function* () {
            const tag = yield (0, tags_1.saveTags)();
            const { room: expectedRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.closeOmnichannelRoom)(expectedRoom._id, [tag.name]);
            const { body } = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms')).query({ 'tags[]': tag.name }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(body.rooms.length).to.be.equal(1);
            (0, chai_1.expect)(body.rooms.some((room) => room._id === expectedRoom._id)).to.be.true;
        }));
        (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('sort', () => {
            let openRoom;
            let closeRoom;
            let department;
            (0, mocha_1.it)('prepare data for further tests', () => __awaiter(void 0, void 0, void 0, function* () {
                const { department: localDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
                department = localDepartment;
                const { room: localOpenRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({
                    departmentId: department._id,
                });
                openRoom = localOpenRoom;
                const { room: localCloseRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)({
                    departmentId: department._id,
                });
                closeRoom = localCloseRoom;
                yield (0, rooms_1.closeOmnichannelRoom)(closeRoom._id);
            }));
            (0, mocha_1.it)('should return only rooms in the asc order', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield api_data_1.request
                    .get((0, api_data_1.api)('livechat/rooms'))
                    .query({ sort: JSON.stringify({ open: 1 }), departmentId: department._id })
                    .set(api_data_1.credentials)
                    .expect(200);
                (0, chai_1.expect)(body.rooms.length).to.be.equal(2);
                (0, chai_1.expect)(body.rooms[0]._id).to.be.equal(closeRoom._id);
                (0, chai_1.expect)(body.rooms[1]._id).to.be.equal(openRoom._id);
            }));
            (0, mocha_1.it)('should return only rooms in the desc order', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield api_data_1.request
                    .get((0, api_data_1.api)('livechat/rooms'))
                    .query({ sort: JSON.stringify({ open: -1 }), departmentId: department._id })
                    .set(api_data_1.credentials)
                    .expect(200);
                (0, chai_1.expect)(body.rooms.length).to.be.equal(2);
                (0, chai_1.expect)(body.rooms[0]._id).to.be.equal(openRoom._id);
                (0, chai_1.expect)(body.rooms[1]._id).to.be.equal(closeRoom._id);
            }));
        });
    });
    (0, mocha_1.describe)('livechat/room.join', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).query({ roomId: '123' }).send().expect(403);
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
        }));
        (0, mocha_1.it)('should fail if no roomId is present on query params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if room is present but invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).query({ roomId: 'invalid' }).send().expect(400);
        }));
        (0, mocha_1.it)('should allow user to join room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).query({ roomId: room._id }).send().expect(200);
        }));
    });
    (0, mocha_1.describe)('livechat/room.join', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).query({ roomId: '123' }).send().expect(403);
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
        }));
        (0, mocha_1.it)('should fail if no roomId is present on query params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if room is present but invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).query({ roomId: 'invalid' }).send().expect(400);
        }));
        (0, mocha_1.it)('should allow user to join room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(api_data_1.credentials).query({ roomId: room._id }).send().expect(200);
        }));
        (0, mocha_1.it)('should allow managers to join a room which is already being served by an agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            // delay for 1 second to make sure the routing queue gets stopped
            yield (0, utils_1.sleep)(1000);
            const { room: { _id: roomId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            const manager = yield (0, users_helper_1.createUser)();
            const managerCredentials = yield (0, users_helper_1.login)(manager.username, user_1.password);
            yield (0, rooms_1.createManager)(manager.username);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/room.join')).set(managerCredentials).query({ roomId }).send().expect(200);
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            // cleanup
            yield (0, users_helper_1.deleteUser)(manager);
        }));
    });
    (0, mocha_1.describe)('livechat/room.close', () => {
        (0, mocha_1.it)('should return an "invalid-token" error when the visitor is not found due to an invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.close'))
                .send({
                token: 'invalid-token',
                rid: room._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return an "invalid-room" error when the room is not found due to invalid token and/or rid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.close'))
                .send({
                token: visitor.token,
                rid: 'invalid-rid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return both the rid and the comment of the room when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/room.close`))
                .send({
                token: visitor.token,
                rid: room._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rid');
                (0, chai_1.expect)(res.body).to.have.property('comment');
            });
        }));
        (0, mocha_1.it)('should return an "room-closed" error when the room is already closed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.close'))
                .send({
                token: visitor.token,
                rid: room._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should close room when chat is closed by visitor and should also generate pdf transcript if serving agent has set appropriate preference set', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, visitor, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield api_data_1.request
                .post((0, api_data_1.api)('users.setPreferences'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    omnichannelTranscriptPDF: true,
                },
            })
                .expect(200);
            // Give time for the setting to be on the user's preferences
            yield (0, utils_1.sleep)(500);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.close')).send({ rid: roomId, token: visitor.token }).expect(200);
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(roomId);
            (0, chai_1.expect)(latestRoom).to.have.property('pdfTranscriptFileId').and.to.be.a('string');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should close room when chat is closed by visitor and should not generate pdf transcript if serving agent has not set appropriate preference set', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, visitor, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield api_data_1.request
                .post((0, api_data_1.api)('users.setPreferences'))
                .set(api_data_1.credentials)
                .send({ data: { omnichannelTranscriptPDF: false } })
                .expect(200);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.close')).send({ rid: roomId, token: visitor.token }).expect(200);
            // Wait for the pdf to not be generated
            yield (0, utils_1.sleep)(1500);
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(roomId);
            (0, chai_1.expect)(latestRoom).to.not.have.property('pdfTranscriptFileId');
        }));
        (0, mocha_1.describe)('Special case: visitors closing is disabled', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Omnichannel_allow_visitors_to_close_conversation', false);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Omnichannel_allow_visitors_to_close_conversation', true);
            }));
            (0, mocha_1.it)('should not allow visitor to close a conversation', () => __awaiter(void 0, void 0, void 0, function* () {
                const { room, visitor } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
                yield api_data_1.request
                    .post((0, api_data_1.api)('livechat/room.close'))
                    .send({
                    token: visitor.token,
                    rid: room._id,
                })
                    .expect(400);
            }));
        });
    });
    (0, mocha_1.describe)('livechat/room.forward', () => {
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have "view-l-room" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('transfer-livechat-guest', ['admin']);
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room-id',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.have.string('unauthorized');
            });
        }));
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have "transfer-livechat-guest" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('transfer-livechat-guest');
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room-id',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.have.string('unauthorized');
            });
            yield (0, permissions_helper_1.restorePermissionToRoles)('transfer-livechat-guest');
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
        }));
        (0, mocha_1.it)('should not be successful when no target (userId or departmentId) was specified', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return a success message when transferred successfully to agent', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const initialAgentAssignedToChat = yield (0, users_helper_1.createUser)();
            const initialAgentCredentials = yield (0, users_helper_1.login)(initialAgentAssignedToChat.username, user_1.password);
            yield (0, rooms_1.createAgent)(initialAgentAssignedToChat.username);
            yield (0, rooms_1.makeAgentAvailable)(initialAgentCredentials);
            const newVisitor = yield (0, rooms_1.createVisitor)();
            // at this point, the chat will get transferred to agent "user"
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const forwardChatToUser = yield (0, users_helper_1.createUser)();
            const forwardChatToUserCredentials = yield (0, users_helper_1.login)(forwardChatToUser.username, user_1.password);
            yield (0, rooms_1.createAgent)(forwardChatToUser.username);
            yield (0, rooms_1.makeAgentAvailable)(forwardChatToUserCredentials);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: newRoom._id,
                userId: forwardChatToUser._id,
                clientAction: true,
                comment: 'test comment',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('lastMessage');
            (0, chai_1.expect)((_a = latestRoom.lastMessage) === null || _a === void 0 ? void 0 : _a.t).to.be.equal('livechat_transfer_history');
            (0, chai_1.expect)((_c = (_b = latestRoom.lastMessage) === null || _b === void 0 ? void 0 : _b.u) === null || _c === void 0 ? void 0 : _c.username).to.be.equal(user_1.adminUsername);
            const { lastMessage } = latestRoom;
            (0, chai_1.expect)((_d = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.transferData) === null || _d === void 0 ? void 0 : _d.comment).to.be.equal('test comment');
            (0, chai_1.expect)((_e = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.transferData) === null || _e === void 0 ? void 0 : _e.scope).to.be.equal('agent');
            (0, chai_1.expect)((_g = (_f = lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.transferData) === null || _f === void 0 ? void 0 : _f.transferredTo) === null || _g === void 0 ? void 0 : _g.username).to.be.equal(forwardChatToUser.username);
            // cleanup
            yield (0, users_helper_1.deleteUser)(initialAgentAssignedToChat);
            yield (0, users_helper_1.deleteUser)(forwardChatToUser);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return error message when transferred to a offline agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            const { department: initialDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { department: forwardToOfflineDepartment } = yield (0, department_1.createDepartmentWithAnOfflineAgent)({ allowReceiveForwardOffline: false });
            const newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: newRoom._id,
                departmentId: forwardToOfflineDepartment._id,
                clientAction: true,
                comment: 'test comment',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-no-agents-online-in-department');
            });
            yield (0, department_1.deleteDepartment)(initialDepartment._id);
            yield (0, department_1.deleteDepartment)(forwardToOfflineDepartment._id);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return a success message when transferred successfully to a department', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const { department: initialDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { department: forwardToDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: newRoom._id,
                departmentId: forwardToDepartment._id,
                clientAction: true,
                comment: 'test comment',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('departmentId');
            (0, chai_1.expect)(latestRoom.departmentId).to.be.equal(forwardToDepartment._id);
            (0, chai_1.expect)(latestRoom).to.have.property('lastMessage');
            (0, chai_1.expect)((_a = latestRoom.lastMessage) === null || _a === void 0 ? void 0 : _a.t).to.be.equal('livechat_transfer_history');
            (0, chai_1.expect)((_c = (_b = latestRoom.lastMessage) === null || _b === void 0 ? void 0 : _b.u) === null || _c === void 0 ? void 0 : _c.username).to.be.equal(user_1.adminUsername);
            (0, chai_1.expect)((_e = (_d = latestRoom.lastMessage) === null || _d === void 0 ? void 0 : _d.transferData) === null || _e === void 0 ? void 0 : _e.comment).to.be.equal('test comment');
            (0, chai_1.expect)((_g = (_f = latestRoom.lastMessage) === null || _f === void 0 ? void 0 : _f.transferData) === null || _g === void 0 ? void 0 : _g.scope).to.be.equal('department');
            (0, chai_1.expect)((_k = (_j = (_h = latestRoom.lastMessage) === null || _h === void 0 ? void 0 : _h.transferData) === null || _j === void 0 ? void 0 : _j.nextDepartment) === null || _k === void 0 ? void 0 : _k._id).to.be.equal(forwardToDepartment._id);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return a success message when transferred successfully to an offline department when the department accepts it', () => __awaiter(void 0, void 0, void 0, function* () {
            const { department: initialDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { department: forwardToOfflineDepartment } = yield (0, department_1.createDepartmentWithAnOfflineAgent)({ allowReceiveForwardOffline: true });
            const newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: newRoom._id,
                departmentId: forwardToOfflineDepartment._id,
                clientAction: true,
                comment: 'test comment',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield (0, department_1.deleteDepartment)(initialDepartment._id);
            yield (0, department_1.deleteDepartment)(forwardToOfflineDepartment._id);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('inquiry should be taken automatically when agent on department is online again', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            const { department: initialDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { department: forwardToOfflineDepartment } = yield (0, department_1.createDepartmentWithAnOfflineAgent)({ allowReceiveForwardOffline: true });
            const newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.forward')).set(api_data_1.credentials).send({
                roomId: newRoom._id,
                departmentId: forwardToOfflineDepartment._id,
                clientAction: true,
                comment: 'test comment',
            });
            yield (0, rooms_1.makeAgentAvailable)();
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('departmentId');
            (0, chai_1.expect)(latestRoom.departmentId).to.be.equal(forwardToOfflineDepartment._id);
            (0, chai_1.expect)(latestRoom).to.have.property('lastMessage');
            (0, chai_1.expect)((_a = latestRoom.lastMessage) === null || _a === void 0 ? void 0 : _a.t).to.be.equal('livechat_transfer_history');
            (0, chai_1.expect)((_c = (_b = latestRoom.lastMessage) === null || _b === void 0 ? void 0 : _b.u) === null || _c === void 0 ? void 0 : _c.username).to.be.equal(user_1.adminUsername);
            (0, chai_1.expect)((_e = (_d = latestRoom.lastMessage) === null || _d === void 0 ? void 0 : _d.transferData) === null || _e === void 0 ? void 0 : _e.comment).to.be.equal('test comment');
            (0, chai_1.expect)((_g = (_f = latestRoom.lastMessage) === null || _f === void 0 ? void 0 : _f.transferData) === null || _g === void 0 ? void 0 : _g.scope).to.be.equal('department');
            (0, chai_1.expect)((_k = (_j = (_h = latestRoom.lastMessage) === null || _h === void 0 ? void 0 : _h.transferData) === null || _j === void 0 ? void 0 : _j.nextDepartment) === null || _k === void 0 ? void 0 : _k._id).to.be.equal(forwardToOfflineDepartment._id);
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            yield (0, department_1.deleteDepartment)(initialDepartment._id);
            yield (0, department_1.deleteDepartment)(forwardToOfflineDepartment._id);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('when manager forward to offline department the inquiry should be set to the queue', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            const { department: initialDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { department: forwardToOfflineDepartment, agent: offlineAgent } = yield (0, department_1.createDepartmentWithAnOfflineAgent)({
                allowReceiveForwardOffline: true,
            });
            const newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield (0, rooms_1.makeAgentUnavailable)(offlineAgent.credentials);
            const manager = yield (0, users_helper_1.createUser)();
            const managerCredentials = yield (0, users_helper_1.login)(manager.username, user_1.password);
            yield (0, rooms_1.createManager)(manager.username);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.forward')).set(managerCredentials).send({
                roomId: newRoom._id,
                departmentId: forwardToOfflineDepartment._id,
                clientAction: true,
                comment: 'test comment',
            });
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/queue`))
                .set(api_data_1.credentials)
                .query({
                count: 1,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.queue).to.be.an('array');
                (0, chai_1.expect)(res.body.queue[0].chats).not.to.undefined;
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
            });
            yield (0, department_1.deleteDepartment)(initialDepartment._id);
            yield (0, department_1.deleteDepartment)(forwardToOfflineDepartment._id);
        }));
        let roomId;
        let visitorToken;
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should return a success message when transferring to a fallback department', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            const { department: initialDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const { department: forwardToDepartment } = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            const forwardToDepartment1 = yield (0, rooms_1.createDepartment)(undefined, undefined, true, {
                fallbackForwardDepartment: forwardToDepartment._id,
            });
            const newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: newRoom._id,
                departmentId: forwardToDepartment1._id,
                clientAction: true,
                comment: 'test comment',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('departmentId');
            (0, chai_1.expect)(latestRoom.departmentId).to.be.equal(forwardToDepartment._id);
            (0, chai_1.expect)(latestRoom).to.have.property('lastMessage');
            (0, chai_1.expect)((_a = latestRoom.lastMessage) === null || _a === void 0 ? void 0 : _a.t).to.be.equal('livechat_transfer_history');
            (0, chai_1.expect)((_c = (_b = latestRoom.lastMessage) === null || _b === void 0 ? void 0 : _b.u) === null || _c === void 0 ? void 0 : _c.username).to.be.equal(user_1.adminUsername);
            (0, chai_1.expect)((_e = (_d = latestRoom.lastMessage) === null || _d === void 0 ? void 0 : _d.transferData) === null || _e === void 0 ? void 0 : _e.comment).to.be.equal('test comment');
            (0, chai_1.expect)((_g = (_f = latestRoom.lastMessage) === null || _f === void 0 ? void 0 : _f.transferData) === null || _g === void 0 ? void 0 : _g.scope).to.be.equal('department');
            (0, chai_1.expect)((_k = (_j = (_h = latestRoom.lastMessage) === null || _h === void 0 ? void 0 : _h.transferData) === null || _j === void 0 ? void 0 : _j.nextDepartment) === null || _k === void 0 ? void 0 : _k._id).to.be.equal(forwardToDepartment._id);
            roomId = newRoom._id;
            visitorToken = newVisitor.token;
        }));
        (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('fallback department', () => {
            let fallbackDepartment;
            let initialDepartment;
            let newVisitor;
            let latestRoom;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
                fallbackDepartment = (yield (0, department_1.createDepartmentWithAnOnlineAgent)()).department;
                initialDepartment = (yield (0, department_1.createDepartmentWithAnOfflineAgent)({
                    fallbackForwardDepartment: fallbackDepartment._id,
                })).department;
                (0, chai_1.expect)(initialDepartment.fallbackForwardDepartment).to.be.equal(fallbackDepartment._id);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    (0, department_1.deleteDepartment)(fallbackDepartment._id),
                    (0, department_1.deleteDepartment)(initialDepartment._id),
                    (0, rooms_1.deleteVisitor)(newVisitor._id),
                    (0, rooms_1.closeOmnichannelRoom)(latestRoom._id),
                ]);
            }));
            (0, mocha_1.it)('should redirect chat to fallback department when all agents in the initial department are offline', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
                newVisitor = yield (0, rooms_1.createVisitor)(initialDepartment._id);
                const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
                latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
                (0, chai_1.expect)(latestRoom).to.have.property('departmentId');
                (0, chai_1.expect)(latestRoom.departmentId).to.be.equal(fallbackDepartment._id);
            }));
        });
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('system messages sent on transfer should be properly generated', () => __awaiter(void 0, void 0, void 0, function* () {
            const messagesList = yield (0, rooms_1.fetchMessages)(roomId, visitorToken);
            const fallbackMessages = messagesList.filter((m) => m.t === 'livechat_transfer_history_fallback');
            (0, chai_1.expect)(fallbackMessages.length).to.be.equal(1);
            const userJoinedMessages = messagesList.filter((m) => m.t === 'uj');
            (0, chai_1.expect)(userJoinedMessages.length).to.be.equal(2);
            const transferMessages = messagesList.filter((m) => m.t === 'livechat_transfer_history');
            (0, chai_1.expect)(transferMessages.length).to.be.equal(1);
            const userLeavingMessages = messagesList.filter((m) => m.t === 'ul');
            (0, chai_1.expect)(userLeavingMessages.length).to.be.equal(1);
        }));
    });
    (0, mocha_1.describe)('livechat/room.survey', () => {
        (0, mocha_1.it)('should return an "invalid-token" error when the visitor is not found due to an invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.survey'))
                .set(api_data_1.credentials)
                .send({
                token: 'invalid-token',
                rid: room._id,
                data: [{ name: 'question', value: 'answer' }],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an "invalid-room" error when the room is not found due to invalid token and/or rid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.survey'))
                .set(api_data_1.credentials)
                .send({
                token: visitor.token,
                rid: 'invalid-rid',
                data: [{ name: 'question', value: 'answer' }],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return "invalid-data" when the items answered are not part of config.survey.items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.survey'))
                .set(api_data_1.credentials)
                .send({
                token: visitor.token,
                rid: room._id,
                data: [{ name: 'question', value: 'answer' }],
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return the room id and the answers when the query params is all valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.survey'))
                .set(api_data_1.credentials)
                .send({
                token: visitor.token,
                rid: room._id,
                data: [
                    { name: 'satisfaction', value: '5' },
                    { name: 'agentKnowledge', value: '3' },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rid');
                (0, chai_1.expect)(res.body).to.have.property('data');
                (0, chai_1.expect)(res.body.data.satisfaction).to.be.equal('5');
                (0, chai_1.expect)(res.body.data.agentKnowledge).to.be.equal('3');
            });
        }));
    });
    (0, mocha_1.describe)('livechat/upload/:rid', () => {
        let visitor;
        (0, mocha_1.afterEach)(() => {
            if (visitor === null || visitor === void 0 ? void 0 : visitor.token) {
                return (0, rooms_1.deleteVisitor)(visitor.token);
            }
        });
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Enabled', true);
            yield (0, permissions_helper_1.updateSetting)('Livechat_fileupload_enabled', true);
        }));
        (0, mocha_1.it)('should throw an error if x-visitor-token header is not present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/upload/test'))
                .set(api_data_1.credentials)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should throw an error if x-visitor-token is present but with an invalid value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/upload/test'))
                .set(api_data_1.credentials)
                .set('x-visitor-token', 'invalid-token')
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should throw unauthorized if visitor with token exists but room is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/upload/test'))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(403);
        }));
        (0, mocha_1.it)('should throw an error if the file is not attached', () => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw and error if file uploads are enabled but livechat file uploads are disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_fileupload_enabled', false);
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(400);
            yield (0, permissions_helper_1.updateSetting)('Livechat_fileupload_enabled', true);
        }));
        (0, mocha_1.it)('should throw and error if livechat file uploads are enabled but file uploads are disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Enabled', false);
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(400);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Enabled', true);
        }));
        (0, mocha_1.it)('should throw and error if both file uploads are disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_fileupload_enabled', false);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Enabled', false);
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(400);
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Enabled', true);
            yield (0, permissions_helper_1.updateSetting)('Livechat_fileupload_enabled', true);
        }));
        (0, mocha_1.it)('should upload an image on the room if all params are valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('FileUpload_Enabled', true);
            yield (0, permissions_helper_1.updateSetting)('Livechat_fileupload_enabled', true);
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should allow visitor to download file', () => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(200);
            const { files: [{ _id, name }], } = body;
            const imageUrl = `/file-upload/${_id}/${name}`;
            yield api_data_1.request.get(imageUrl).query({ rc_token: visitor.token, rc_room_type: 'l', rc_rid: room._id }).expect(200);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
        }));
        (0, mocha_1.it)('should allow visitor to download file even after room is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(200);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { files: [{ _id, name }], } = body;
            const imageUrl = `/file-upload/${_id}/${name}`;
            yield api_data_1.request.get(imageUrl).query({ rc_token: visitor.token, rc_room_type: 'l', rc_rid: room._id }).expect(200);
        }));
        (0, mocha_1.it)('should not allow visitor to download a file from a room he didnt create', () => __awaiter(void 0, void 0, void 0, function* () {
            visitor = yield (0, rooms_1.createVisitor)();
            const visitor2 = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/upload/${room._id}`))
                .set(api_data_1.credentials)
                .set('x-visitor-token', visitor.token)
                .attach('file', fs_1.default.createReadStream(path_1.default.join(__dirname, '../../../data/livechat/sample.png')))
                .expect('Content-Type', 'application/json')
                .expect(200);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const { files: [{ _id, name }], } = body;
            const imageUrl = `/file-upload/${_id}/${name}`;
            yield api_data_1.request.get(imageUrl).query({ rc_token: visitor2.token, rc_room_type: 'l', rc_rid: room._id }).expect(403);
            yield (0, rooms_1.deleteVisitor)(visitor2.token);
        }));
    });
    (0, mocha_1.describe)('livechat/:rid/messages', () => {
        (0, mocha_1.it)('should fail if room provided is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/test/messages')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        }));
        (0, mocha_1.it)('should throw an error if user doesnt have permission view-l-room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-l-room');
            yield api_data_1.request.get((0, api_data_1.api)('livechat/test/messages')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-l-room');
        }));
        (0, mocha_1.it)('should return the messages of the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/${room._id}/messages`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages');
            (0, chai_1.expect)(body.messages).to.be.an('array');
            (0, chai_1.expect)(body.total).to.be.an('number').equal(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'Hello');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should return the messages of the room matching by searchTerm', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Random', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/${room._id}/messages`))
                .query({ searchTerm: 'Ran' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages');
            (0, chai_1.expect)(body.messages).to.be.an('array');
            (0, chai_1.expect)(body.total).to.be.an('number').equal(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'Random');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should return the messages of the room matching by partial searchTerm', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Random', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/${room._id}/messages`))
                .query({ searchTerm: 'ndo' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages');
            (0, chai_1.expect)(body.messages).to.be.an('array');
            (0, chai_1.expect)(body.total).to.be.an('number').equal(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'Random');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should return everything when searchTerm is ""', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Random', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/${room._id}/messages`))
                .query({ searchTerm: '' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages');
            (0, chai_1.expect)(body.messages).to.be.an('array');
            (0, chai_1.expect)(body.messages).to.be.an('array').with.lengthOf.greaterThan(1);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('[GET] livechat/message/:_id', () => {
        (0, mocha_1.it)('should fail if message provided is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/test')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        }));
        (0, mocha_1.it)('shoudl fail if token is not sent as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('livechat/message/test')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        }));
        (0, mocha_1.it)('should fail if rid is not sent as query param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .query({ token: 'test' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should return the message', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/message/${message._id}`))
                .query({
                token: visitor.token,
                rid: room._id,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('message');
            (0, chai_1.expect)(body.message).to.have.property('msg', 'Hello');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('[PUT] livechat/message/:_id', () => {
        (0, mocha_1.it)('should fail if room provided is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .send({ token: 'test', rid: 'fadsfdsafads', msg: 'fasfasdfdsf' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if token is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .send({ msg: 'fasfadsf', rid: 'afdsfdsfads' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if rid is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .send({ token: 'test', msg: 'fasfasdfdsf' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if msg is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/message/test`))
                .set(api_data_1.credentials)
                .send({ token: 'fasdfdsf', rid: 'fadsfdsafads' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if token is not a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/message/test`))
                .set(api_data_1.credentials)
                .send({ token: 'test', rid: 'fadsfdsafads', msg: 'fasfasdfdsf' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if room is not a valid room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/message/test`))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: 'fadsfdsafads', msg: 'fasfasdfdsf' })
                .expect('Content-Type', 'application/json')
                .expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should fail if _id is not a valid message id', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/message/test`))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id, msg: 'fasfasdfdsf' })
                .expect('Content-Type', 'application/json')
                .expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should update a message if everything is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/message/${message._id}`))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id, msg: 'Hello World' })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('message');
            (0, chai_1.expect)(body.message).to.have.property('msg', 'Hello World');
            (0, chai_1.expect)(body.message).to.have.property('editedAt');
            (0, chai_1.expect)(body.message).to.have.property('editedBy');
            (0, chai_1.expect)(body.message.editedBy).to.have.property('username', visitor.username);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('[DELETE] livechat/message/_id', () => {
        (0, mocha_1.it)('should fail if token is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .send({ rid: 'afdsfdsfads' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if room provided is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .send({ token: 'test', rid: 'fadsfdsafads' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if rid is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)('livechat/message/test'))
                .set(api_data_1.credentials)
                .send({ token: 'test' })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if _id is not a valid message id', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/message/test`))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id })
                .expect('Content-Type', 'application/json')
                .expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should delete a message if everything is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/message/${message._id}`))
                .set(api_data_1.credentials)
                .send({ token: visitor.token, rid: room._id })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('message');
            (0, chai_1.expect)(body.message).to.have.property('_id', message._id);
            (0, chai_1.expect)(body.message).to.have.property('ts');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('livechat/messages', () => {
        (0, mocha_1.it)('should fail if visitor is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/messages')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        }));
        (0, mocha_1.it)('should fail if visitor.token is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/messages'))
                .set(api_data_1.credentials)
                .send({ visitor: {} })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if messages is not sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/messages'))
                .set(api_data_1.credentials)
                .send({ visitor: { token: 'test' } })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if messages is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/messages'))
                .set(api_data_1.credentials)
                .send({ visitor: { token: 'test' }, messages: {} })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should fail if messages is an empty array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/messages'))
                .set(api_data_1.credentials)
                .send({ visitor: { token: 'test' }, messages: [] })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should be able to create messages on a room', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'Hello', visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/messages'))
                .set(api_data_1.credentials)
                .send({ visitor: { token: visitor.token }, messages: [{ msg: 'Hello' }, { msg: 'Hello 2' }] })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('messages').of.length(2);
            (0, chai_1.expect)(body.messages[0]).to.have.property('msg', 'Hello');
            (0, chai_1.expect)(body.messages[0]).to.have.property('ts');
            (0, chai_1.expect)(body.messages[0]).to.have.property('username', visitor.username);
            (0, chai_1.expect)(body.messages[1]).to.have.property('msg', 'Hello 2');
            (0, chai_1.expect)(body.messages[1]).to.have.property('ts');
            (0, chai_1.expect)(body.messages[1]).to.have.property('username', visitor.username);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('livechat/transfer.history/:rid', () => {
        (0, mocha_1.it)('should fail if user doesnt have "view-livechat-rooms" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.removePermissionFromAllRoles)('view-livechat-rooms');
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/transfer.history/test`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403);
            (0, chai_1.expect)(body).to.have.property('success', false);
            yield (0, permissions_helper_1.restorePermissionToRoles)('view-livechat-rooms');
        }));
        (0, mocha_1.it)('should fail if room is not a valid room id', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/transfer.history/test`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(body).to.have.property('success', false);
        }));
        (0, mocha_1.it)('should return empty for a room without transfer history', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/transfer.history/${room._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('history').that.is.an('array');
            (0, chai_1.expect)(body.history.length).to.equal(0);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should return the transfer history for a room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-manager', 'livechat-agent']);
            const initialAgentAssignedToChat = yield (0, users_helper_1.createUser)();
            const initialAgentCredentials = yield (0, users_helper_1.login)(initialAgentAssignedToChat.username, user_1.password);
            yield (0, rooms_1.createAgent)(initialAgentAssignedToChat.username);
            yield (0, rooms_1.makeAgentAvailable)(initialAgentCredentials);
            const newVisitor = yield (0, rooms_1.createVisitor)();
            // at this point, the chat will get transferred to agent "user"
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const forwardChatToUser = yield (0, users_helper_1.createUser)();
            const forwardChatToUserCredentials = yield (0, users_helper_1.login)(forwardChatToUser.username, user_1.password);
            yield (0, rooms_1.createAgent)(forwardChatToUser.username);
            yield (0, rooms_1.makeAgentAvailable)(forwardChatToUserCredentials);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.forward'))
                .set(api_data_1.credentials)
                .send({
                roomId: newRoom._id,
                userId: forwardChatToUser._id,
                clientAction: true,
                comment: 'test comment',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const { body } = yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/transfer.history/${newRoom._id}`))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(body).to.have.property('success', true);
            (0, chai_1.expect)(body).to.have.property('history').that.is.an('array');
            (0, chai_1.expect)(body.history.length).to.equal(1);
            (0, chai_1.expect)(body.history[0]).to.have.property('scope', 'agent');
            (0, chai_1.expect)(body.history[0]).to.have.property('comment', 'test comment');
            (0, chai_1.expect)(body.history[0]).to.have.property('transferredBy').that.is.an('object');
            // cleanup
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
            yield (0, users_helper_1.deleteUser)(initialAgentAssignedToChat);
            yield (0, users_helper_1.deleteUser)(forwardChatToUser);
        }));
    });
    (0, mocha_1.describe)('livechat/room.saveInfo', () => {
        (0, mocha_1.it)('should fail if no data is sent as body param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.saveInfo')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(400);
        }));
        (0, mocha_1.it)('should return an "unauthorized error" when the user does not have "view-l-room" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: 'invalid-room-id',
                },
                guestData: {
                    _id: 'invalid-guest-id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.have.string('unauthorized');
            });
        }));
        (0, mocha_1.it)('should not allow users to update room info without serving the chat or having "save-others-livechat-room-info" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('save-others-livechat-room-info', []);
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            // delay for 1 second to make sure the routing queue gets stopped
            yield (0, utils_1.sleep)(1000);
            const newVisitor = yield (0, rooms_1.createVisitor)();
            // at this point, the chat will get transferred to agent "user"
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.have.string('unauthorized');
            });
            yield (0, permissions_helper_1.updatePermission)('save-others-livechat-room-info', ['admin']);
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            // delay for 1 second to make sure the routing queue starts again
            yield (0, utils_1.sleep)(1000);
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (0, mocha_1.it)('should throw an error if roomData is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                guestData: {
                    _id: 'invalid-guest-id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw an error if guestData is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: 'invalid-room-id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw an error if roomData is not of valid type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: 'invalid-room-data',
                guestData: {
                    _id: 'invalid-guest-id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw an error if guestData is not of valid type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                guestData: 'invalid-guest-data',
                roomData: {
                    _id: 'invalid-room-id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should allow user to update the room info', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin']);
            const newVisitor = yield (0, rooms_1.createVisitor)();
            // at this point, the chat will get transferred to agent "user"
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    topic: 'new topic',
                    tags: ['tag1', 'tag2'],
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('topic', 'new topic');
            (0, chai_1.expect)(latestRoom).to.have.property('tags').of.length(2);
            (0, chai_1.expect)(latestRoom).to.have.property('tags').to.include('tag1');
            (0, chai_1.expect)(latestRoom).to.have.property('tags').to.include('tag2');
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should allow user to update the room info - EE fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const cfName = faker_1.faker.lorem.word();
            yield (0, custom_fields_1.createCustomField)({
                searchable: true,
                field: cfName,
                label: cfName,
                scope: 'room',
                visibility: 'visible',
                regexp: '',
            });
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    topic: 'new topic',
                    tags: ['tag1', 'tag2'],
                    livechatData: {
                        [cfName]: 'test-input-1-value',
                    },
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('topic', 'new topic');
            (0, chai_1.expect)(latestRoom).to.have.property('tags').of.length(2);
            (0, chai_1.expect)(latestRoom).to.have.property('tags').to.include('tag1');
            (0, chai_1.expect)(latestRoom).to.have.property('tags').to.include('tag2');
            (0, chai_1.expect)(latestRoom).to.have.property('livechatData').to.have.property(cfName, 'test-input-1-value');
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('endpoint should handle empty custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    topic: 'new topic',
                    tags: ['tag1', 'tag2'],
                    livechatData: {},
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(latestRoom).to.have.property('topic', 'new topic');
            (0, chai_1.expect)(latestRoom).to.have.property('tags').of.length(2);
            (0, chai_1.expect)(latestRoom).to.have.property('tags').to.include('tag1');
            (0, chai_1.expect)(latestRoom).to.have.property('tags').to.include('tag2');
            (0, chai_1.expect)(latestRoom).to.not.have.property('livechatData');
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should throw an error if custom fields are not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: 'invalid-room-id',
                    livechatData: {
                        key: {
                            value: 'invalid',
                        },
                    },
                },
                guestData: {
                    _id: 'invalid-visitor-id',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should throw an error if a valid custom field fails the check', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:saveCustomField'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'livechat:saveCustomField',
                    params: [
                        null,
                        {
                            field: 'intfield',
                            label: 'intfield',
                            scope: 'room',
                            visibility: 'visible',
                            regexp: '\\d+',
                            searchable: true,
                            type: 'input',
                            required: false,
                            defaultValue: '0',
                            options: '',
                            public: false,
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200);
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    livechatData: { intfield: 'asdasd' },
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'Invalid value for intfield field');
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should not throw an error if a valid custom field passes the check', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const response2 = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    livechatData: { intfield: '1' },
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response2.body).to.have.property('success', true);
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should update room priority', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.addPermissions)({
                'save-others-livechat-room-info': ['admin', 'livechat-manager'],
                'view-l-room': ['livechat-agent', 'admin', 'livechat-manager'],
            });
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const priority = yield (0, priorities_1.getRandomPriority)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    priorityId: priority._id,
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(updatedRoom).to.have.property('priorityId', priority._id);
            (0, chai_1.expect)(updatedRoom).to.have.property('priorityWeight', priority.sortItem);
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should update room sla', () => __awaiter(void 0, void 0, void 0, function* () {
            const newVisitor = yield (0, rooms_1.createVisitor)();
            const newRoom = yield (0, rooms_1.createLivechatRoom)(newVisitor.token);
            const sla = yield (0, priorities_1.createSLA)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.saveInfo'))
                .set(api_data_1.credentials)
                .send({
                roomData: {
                    _id: newRoom._id,
                    slaId: sla._id,
                },
                guestData: {
                    _id: newVisitor._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(newRoom._id);
            (0, chai_1.expect)(updatedRoom).to.have.property('slaId', sla._id);
            yield (0, rooms_1.deleteVisitor)(newVisitor.token);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('livechat/room/:rid/priority', () => __awaiter(void 0, void 0, void 0, function* () {
        let priorities;
        let chosenPriority;
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateEEPermission)('manage-livechat-priorities', ['admin', 'livechat-manager']);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-manager', 'livechat-agent']);
        }));
        (0, mocha_1.it)('should return the list of priorities', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .get((0, api_data_1.api)('livechat/priorities'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('priorities').and.to.be.an('array');
                (0, chai_1.expect)(res.body.priorities).to.have.length.greaterThan(0);
            });
            priorities = response.body.priorities;
            const rnd = faker_1.faker.number.int({ min: 0, max: priorities.length - 1 });
            chosenPriority = priorities[rnd];
        }));
        (0, mocha_1.it)('should prioritize the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/room/${room._id}/priority`))
                .set(api_data_1.credentials)
                .send({
                priorityId: chosenPriority._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should return the room with the new priority', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom).to.have.property('priorityId', chosenPriority._id);
            (0, chai_1.expect)(updatedRoom).to.have.property('priorityWeight', chosenPriority.sortItem);
        }));
        (0, mocha_1.it)('should unprioritize the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/room/${room._id}/priority`))
                .set(api_data_1.credentials)
                .send()
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should return the room with the new priority', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom).to.not.have.property('priorityId');
            (0, chai_1.expect)(updatedRoom).to.have.property('priorityWeight', core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED);
        }));
        (0, mocha_1.it)('should fail to return the priorities if lacking permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-livechat-priorities', []);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/priorities')).set(api_data_1.credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should fail to prioritize the room from a lack of permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/room/${room._id}/priority`))
                .set(api_data_1.credentials)
                .send({
                priorityId: chosenPriority._id,
            })
                .expect(403);
        }));
        (0, mocha_1.it)('should fail to unprioritize the room from a lack of permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/room/${room._id}/priority`))
                .set(api_data_1.credentials)
                .send()
                .expect(403);
        }));
    }));
    (0, mocha_1.describe)('livechat/rooms/filters', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms/filters')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should return a list of available source filters', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-agent', 'livechat-manager']);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/rooms/filters')).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(response.body).to.have.property('filters').and.to.be.an('array');
            (0, chai_1.expect)(response.body.filters.find((f) => f.type === 'api')).to.not.be.undefined;
        }));
    });
    (0, mocha_1.describe)('livechat/room.closeByUser', () => {
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).expect(401);
        }));
        (0, mocha_1.it)('should fail if not all required params are passed (rid)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if user doesnt have close-livechat-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('close-livechat-room', []);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: 'invalid-room-id' }).expect(403);
        }));
        (0, mocha_1.it)('should fail if room is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('close-livechat-room', ['admin']);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: 'invalid-room-id' }).expect(400);
        }));
        (0, mocha_1.it)('should fail if user is not serving and doesnt have close-others-livechat-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('close-others-livechat-room', []);
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id }).expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should not close a room without comment', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('close-others-livechat-room');
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id }).expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'error-comment-is-required');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should not close a room when comment is an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.restorePermissionToRoles)('close-others-livechat-room');
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const response = yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: '' }).expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should close room if user has permission', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }).expect(200);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should fail if room is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            // close room
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }).expect(200);
            // try to close again
            yield api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }).expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should fail one of the requests if 3 simultaneous closes are attempted', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const results = yield Promise.allSettled([
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
            ]);
            const validResponse = results.filter((res) => res.value.status === 200);
            const invalidResponses = results.filter((res) => res.value.status !== 200);
            (0, chai_1.expect)(validResponse.length).to.equal(1);
            (0, chai_1.expect)(invalidResponses.length).to.equal(2);
            // @ts-expect-error promise typings
            (0, chai_1.expect)(invalidResponses[0].value.body).to.have.property('success', false);
            // @ts-expect-error promise typings
            (0, chai_1.expect)(invalidResponses[0].value.body).to.have.property('error');
            // The transaction is not consistent on the error apparently, sometimes it will reach the point of trying to close the inquiry and abort there (since another call already closed the room and finished)
            // and sometimes it will abort because the transactions are still running and they're being locked. This is something i'm not liking but since tx should be retried we got this
            // @ts-expect-error promise typings
            (0, chai_1.expect)(['error-room-cannot-be-closed-try-again', 'Error removing inquiry']).to.include(invalidResponses[0].value.body.error);
        }));
        (0, mocha_1.it)('should allow different rooms to be closed simultaneously', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const visitor2 = yield (0, rooms_1.createVisitor)();
            const { _id: _id2 } = yield (0, rooms_1.createLivechatRoom)(visitor2.token);
            const results = yield Promise.allSettled([
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id2, comment: 'test' }),
            ]);
            const validResponse = results.filter((res) => res.value.status === 200);
            const invalidResponses = results.filter((res) => res.value.status !== 200);
            (0, chai_1.expect)(validResponse.length).to.equal(2);
            (0, chai_1.expect)(invalidResponses.length).to.equal(0);
        }));
        (0, mocha_1.it)('when both user & visitor try to close room, only one will succeed (theres no guarantee who will win)', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const results = yield Promise.allSettled([
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
                api_data_1.request.post((0, api_data_1.api)('livechat/room.close')).set(api_data_1.credentials).send({ rid: _id, token: visitor.token }),
            ]);
            const validResponse = results.filter((res) => res.value.status === 200);
            const invalidResponses = results.filter((res) => res.value.status !== 200);
            // @ts-expect-error promise typings
            const whoWon = validResponse[0].value.request.url.includes('closeByUser') ? 'user' : 'visitor';
            (0, chai_1.expect)(validResponse.length).to.equal(1);
            (0, chai_1.expect)(invalidResponses.length).to.equal(1);
            // @ts-expect-error promise typings
            (0, chai_1.expect)(invalidResponses[0].value.body).to.have.property('success', false);
            // This error indicates a conflict in the simultaneous close and that the request was rejected
            // @ts-expect-error promise typings
            (0, chai_1.expect)(invalidResponses[0].value.body).to.have.property('error');
            // @ts-expect-error promise typings
            (0, chai_1.expect)(['error-room-cannot-be-closed-try-again', 'Error removing inquiry']).to.include(invalidResponses[0].value.body.error);
            const room = yield (0, rooms_1.getLivechatRoomInfo)(_id);
            (0, chai_1.expect)(room).to.not.have.property('open');
            (0, chai_1.expect)(room).to.have.property('closer', whoWon);
        }));
        (0, mocha_1.it)('when a close request is tried multiple times, the final state of the room should be valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield Promise.allSettled([
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
                api_data_1.request.post((0, api_data_1.api)('livechat/room.closeByUser')).set(api_data_1.credentials).send({ rid: _id, comment: 'test' }),
            ]);
            const room = yield (0, rooms_1.getLivechatRoomInfo)(_id);
            const inqForRoom = yield (0, rooms_1.fetchInquiry)(_id);
            const sub = yield api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({ roomId: _id })
                .expect('Content-Type', 'application/json');
            (0, chai_1.expect)(room).to.not.have.property('open');
            (0, chai_1.expect)(room).to.have.property('closedAt');
            (0, chai_1.expect)(room).to.have.property('closer', 'user');
            (0, chai_1.expect)(inqForRoom).to.be.null;
            (0, chai_1.expect)(sub.body.subscription).to.be.null;
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should close room and generate transcript pdf', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.closeByUser'))
                .set(api_data_1.credentials)
                .send({ rid: roomId, comment: 'test', generateTranscriptPdf: true })
                .expect(200);
            // Wait for the pdf to be generated
            yield (0, utils_1.sleep)(1500);
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(roomId);
            (0, chai_1.expect)(latestRoom).to.have.property('pdfTranscriptFileId').and.to.be.a('string');
        }));
        (constants_1.IS_EE ? mocha_1.it : mocha_1.it.skip)('should close room and not generate transcript pdf', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.closeByUser'))
                .set(api_data_1.credentials)
                .send({ rid: roomId, comment: 'test', generateTranscriptPdf: false })
                .expect(200);
            // Wait for the pdf to not be generated
            yield (0, utils_1.sleep)(1500);
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(roomId);
            (0, chai_1.expect)(latestRoom).to.not.have.property('pdfTranscriptFileId');
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('omnichannel/:rid/request-transcript', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
            // Wait for one sec to be sure routing stops
            yield (0, utils_1.sleep)(1000);
        }));
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('omnichannel/rid/request-transcript')).expect(401);
        }));
        (0, mocha_1.it)('should fail if :rid doesnt exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('omnichannel/rid/request-transcript')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if user doesnt have request-pdf-transcript permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('request-pdf-transcript', []);
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`omnichannel/${_id}/request-transcript`))
                .set(api_data_1.credentials)
                .expect(403);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should fail if room is not closed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('request-pdf-transcript', ['admin', 'livechat-agent', 'livechat-manager']);
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .post((0, api_data_1.api)(`omnichannel/${_id}/request-transcript`))
                .set(api_data_1.credentials)
                .expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should return OK if no one is serving the room (queued)', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(_id);
            yield api_data_1.request
                .post((0, api_data_1.api)(`omnichannel/${_id}/request-transcript`))
                .set(api_data_1.credentials)
                .expect(200);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        let roomWithTranscriptGenerated;
        (0, mocha_1.it)('should request a pdf transcript when all conditions are met', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: { _id: roomId }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            // close room since pdf transcript is only generated for closed rooms
            yield (0, rooms_1.closeOmnichannelRoom)(roomId);
            yield api_data_1.request
                .post((0, api_data_1.api)(`omnichannel/${roomId}/request-transcript`))
                .set(api_data_1.credentials)
                .expect(200);
            // wait for the pdf to be generated
            yield (0, utils_1.sleep)(1500);
            const latestRoom = yield (0, rooms_1.getLivechatRoomInfo)(roomId);
            (0, chai_1.expect)(latestRoom).to.have.property('pdfTranscriptFileId').and.to.be.a('string');
            roomWithTranscriptGenerated = roomId;
        }));
        (0, mocha_1.it)('should return immediately if transcript was already requested', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)(`omnichannel/${roomWithTranscriptGenerated}/request-transcript`))
                .set(api_data_1.credentials)
                .expect(200);
        }));
    });
    (0, mocha_1.describe)('it should mark room as unread when a new message arrives and the config is activated', () => {
        let room;
        let visitor;
        let totalMessagesSent = 0;
        let departmentWithAgent;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            yield (0, permissions_helper_1.updateSetting)('Unread_Count_Omni', 'all_messages');
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, department_1.deleteDepartment)(departmentWithAgent.department._id);
        }));
        (0, mocha_1.it)('it should prepare the required data for further tests', () => __awaiter(void 0, void 0, void 0, function* () {
            departmentWithAgent = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            visitor = yield (0, rooms_1.createVisitor)(departmentWithAgent.department._id);
            room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'message 1', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'message 2', visitor.token);
            // 1st message is for the room creation, so we need to add 1 to the total messages sent
            totalMessagesSent = 3;
        }));
        (0, mocha_1.it)("room's subscription should have correct unread count", () => __awaiter(void 0, void 0, void 0, function* () {
            const { unread } = yield getSubscriptionForRoom(room._id, departmentWithAgent.agent.credentials);
            (0, chai_1.expect)(unread).to.equal(totalMessagesSent);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('it should NOT mark room as unread when a new message arrives and the config is deactivated', () => {
        let room;
        let visitor;
        let totalMessagesSent = 0;
        let departmentWithAgent;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            yield (0, permissions_helper_1.updateSetting)('Unread_Count_Omni', 'mentions_only');
        }));
        (0, mocha_1.it)('it should prepare the required data for further tests', () => __awaiter(void 0, void 0, void 0, function* () {
            departmentWithAgent = yield (0, department_1.createDepartmentWithAnOnlineAgent)();
            visitor = yield (0, rooms_1.createVisitor)(departmentWithAgent.department._id);
            room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'message 1', visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'message 2', visitor.token);
            // 1st message is for the room creation, so we need to add 1 to the total messages sent
            totalMessagesSent = 1;
        }));
        (0, mocha_1.it)("room's subscription should have correct unread count", () => __awaiter(void 0, void 0, void 0, function* () {
            const { unread } = yield getSubscriptionForRoom(room._id, departmentWithAgent.agent.credentials);
            (0, chai_1.expect)(unread).to.equal(totalMessagesSent);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('livechat/transcript/:rid', () => {
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/transcript/rid')).expect(401);
        }));
        (0, mocha_1.it)('should fail if user doesnt have send-omnichannel-chat-transcript permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('send-omnichannel-chat-transcript', []);
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/transcript/rid')).set(api_data_1.credentials).expect(403);
        }));
        (0, mocha_1.it)('should fail if :rid is not a valid room id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('send-omnichannel-chat-transcript', ['admin']);
            yield api_data_1.request.delete((0, api_data_1.api)('livechat/transcript/rid')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if room is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(_id);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${_id}`))
                .set(api_data_1.credentials)
                .expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should fail if room doesnt have a transcript request active', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${_id}`))
                .set(api_data_1.credentials)
                .expect(400);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should return OK if all conditions are met', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            // First, request transcript with livechat:requestTranscript method
            yield api_data_1.request
                .post((0, api_data_1.api)(`livechat/transcript/${_id}`))
                .set(api_data_1.credentials)
                .send({
                email: 'test@test.com',
                subject: 'Transcript of your omnichannel conversation',
            })
                .expect(200);
            // Then, delete the transcript
            yield api_data_1.request
                .delete((0, api_data_1.api)(`livechat/transcript/${_id}`))
                .set(api_data_1.credentials)
                .expect(200);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
    (0, mocha_1.describe)('livechat:sendTranscript', () => {
        (0, mocha_1.it)('should fail if user doesnt have send-omnichannel-chat-transcript permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('send-omnichannel-chat-transcript', []);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: ['test', 'test', 'test', 'test'],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('error').that.is.an('object').that.has.property('error', 'error-not-allowed');
        }));
        (0, mocha_1.it)('should fail if not all params are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('send-omnichannel-chat-transcript', ['admin']);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: [],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('error').that.is.an('object').that.has.property('errorType', 'Match.Error');
        }));
        (0, mocha_1.it)('should fail if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: ['invalid-token', 'test', 'test', 'test'],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('error').that.is.an('object');
        }));
        (0, mocha_1.it)('should fail if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: [visitor.token, 'invalid-room-id', 'test', 'test'],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('error').that.is.an('object');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should fail if token is from another conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const visitor2 = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: [visitor2.token, _id, 'test', 'test'],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('error').that.is.an('object');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
            yield (0, rooms_1.deleteVisitor)(visitor2.token);
        }));
        (0, mocha_1.it)('should fail if email provided is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: [visitor.token, _id, 'invalid-email', 'test'],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('error').that.is.an('object');
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
        (0, mocha_1.it)('should work if all params are good', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const { _id } = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const { body } = yield api_data_1.request
                .post((0, api_data_1.methodCall)('livechat:sendTranscript'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '1091',
                    method: 'livechat:sendTranscript',
                    params: [visitor.token, _id, 'test@test', 'test'],
                }),
            })
                .expect(200);
            const result = (0, utils_1.parseMethodResponse)(body);
            (0, chai_1.expect)(body.success).to.be.true;
            (0, chai_1.expect)(result).to.have.property('result', true);
            yield (0, rooms_1.deleteVisitor)(visitor.token);
        }));
    });
});
