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
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[EE] LIVECHAT - rooms', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    let agent2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
        yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
    }));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield (0, rooms_1.createAgent)(user.username);
        yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold', true);
        agent2 = {
            user,
            credentials: userCredentials,
        };
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, users_helper_1.deleteUser)(agent2.user);
        yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold', false);
        yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold_upon_agent_engagement_only', true);
    }));
    (0, mocha_1.describe)('livechat/room.onHold', () => {
        (0, mocha_1.it)('should fail if user doesnt have on-hold-livechat-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('on-hold-livechat-room', []);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room-id',
            })
                .expect(403);
            (0, chai_1.expect)(response.body.success).to.be.false;
            yield (0, permissions_helper_1.updatePermission)('on-hold-livechat-room', ['livechat-manager', 'livechat-monitor', 'livechat-agent', 'admin']);
        }));
        (0, mocha_1.it)('should fail if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room-id',
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if room is an empty string', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: '                ',
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if room is not a livechat room', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'GENERAL',
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if visitor is awaiting response (visitor sent last message)', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-cannot-place-chat-on-hold');
        }));
        (0, mocha_1.it)('should fail if room is closed', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            yield (0, rooms_1.closeOmnichannelRoom)(room._id);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-room-already-closed');
        }));
        (0, mocha_1.it)('should fail if user is not serving the chat and doesnt have on-hold-others-livechat-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.sendAgentMessage)(room._id);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(agent2.credentials)
                .send({
                roomId: room._id,
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('Not_authorized');
        }));
        (0, mocha_1.it)('should put room on hold', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom.onHold).to.be.true;
        }));
        (0, mocha_1.it)('Should put room on hold, even in the visitor sent the last message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room, visitor } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold_upon_agent_engagement_only', false);
            yield (0, rooms_1.sendMessage)(room._id, '-', visitor.token);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(200);
            (0, chai_1.expect)(response.body.success).to.be.true;
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom.onHold).to.be.true;
        }));
        (0, mocha_1.it)('should not put room on hold when visitor sent the last message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room, visitor } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, permissions_helper_1.updateSetting)('Livechat_allow_manual_on_hold_upon_agent_engagement_only', true);
            yield (0, rooms_1.sendMessage)(room._id, '-', visitor.token);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.onHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-cannot-place-chat-on-hold');
        }));
    });
    (0, mocha_1.describe)('livechat/room.resumeOnHold', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.resumeOnHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room-id',
            })
                .expect(403);
            (0, chai_1.expect)(response.body.success).to.be.false;
        }));
        (0, mocha_1.it)('should fail if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['admin', 'livechat-manager', 'livechat-agent']);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.resumeOnHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid-room-id',
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if room is not a livechat room', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.resumeOnHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'GENERAL',
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-invalid-room');
        }));
        (0, mocha_1.it)('should fail if room is not on hold', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.resumeOnHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(400);
            (0, chai_1.expect)(response.body.success).to.be.false;
            (0, chai_1.expect)(response.body.error).to.be.equal('error-room-not-on-hold');
        }));
        (0, mocha_1.it)('should resume room on hold', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.sendAgentMessage)(room._id);
            yield (0, rooms_1.placeRoomOnHold)(room._id);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.resumeOnHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(200);
            (0, chai_1.expect)(response.body.success).to.be.true;
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom).to.not.have.property('onHold');
        }));
        (0, mocha_1.it)('should resume room on hold and send proper system message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room, visitor } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.sendAgentMessage)(room._id);
            yield (0, rooms_1.placeRoomOnHold)(room._id);
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('livechat/room.resumeOnHold'))
                .set(api_data_1.credentials)
                .send({
                roomId: room._id,
            })
                .expect(200);
            (0, chai_1.expect)(response.body.success).to.be.true;
            const messages = yield (0, rooms_1.fetchMessages)(room._id, visitor.token);
            (0, chai_1.expect)(messages).to.be.an('array');
            (0, chai_1.expect)(messages[0]).to.not.be.undefined;
            (0, chai_1.expect)(messages[0]).to.have.property('t', 'omnichannel_on_hold_chat_resumed');
            (0, chai_1.expect)(messages[0]).to.have.property('comment', 'The chat was manually resumed from On Hold by RocketChat Internal Admin Test');
        }));
        (0, mocha_1.it)('should resume chat automatically if visitor sent a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room, visitor } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.sendAgentMessage)(room._id);
            yield (0, rooms_1.placeRoomOnHold)(room._id);
            yield (0, rooms_1.sendMessage)(room._id, 'test', visitor.token);
            // wait for the room to be resumed since that logic is within callbacks
            yield (0, utils_1.sleep)(500);
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            (0, chai_1.expect)(updatedRoom).to.not.have.property('onHold');
        }));
    });
    (0, mocha_1.describe)('visitor abandonment feature', () => {
        let room;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_abandoned_rooms_action', 'Livechat_close_chat');
            yield (0, permissions_helper_1.updateSetting)('Livechat_visitor_inactivity_timeout', 60);
        }));
        (0, mocha_1.it)('should set predictedVisitorAbandonmentAt when agent sends a message', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const { room: newRoom } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            room = newRoom;
            yield (0, rooms_1.sendAgentMessage)(room._id);
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            const lastMessageTs = (_a = updatedRoom.responseBy) === null || _a === void 0 ? void 0 : _a.lastMessageTs;
            const firstResponseTs = (_b = updatedRoom.responseBy) === null || _b === void 0 ? void 0 : _b.firstResponseTs;
            const predictedVisitorAbandonmentAt = (_c = updatedRoom.omnichannel) === null || _c === void 0 ? void 0 : _c.predictedVisitorAbandonmentAt;
            (0, chai_1.expect)(predictedVisitorAbandonmentAt).to.not.be.undefined;
            (0, chai_1.expect)(lastMessageTs).to.not.be.undefined;
            (0, chai_1.expect)(firstResponseTs).to.not.be.undefined;
            // expect predictedVisitorAbandonmentAt to be 60 seconds after lastMessageTs
            const lastMessageTsDate = new Date(lastMessageTs);
            const predictedVisitorAbandonmentAtDate = new Date(predictedVisitorAbandonmentAt);
            const firstResponseTsDate = new Date(firstResponseTs);
            (0, chai_1.expect)(predictedVisitorAbandonmentAtDate.getTime()).to.be.equal(lastMessageTsDate.getTime() + 60000);
            (0, chai_1.expect)(firstResponseTsDate.getTime()).to.be.equal(lastMessageTsDate.getTime());
        }));
        (0, mocha_1.it)('should not update predictedVisitorAbandonmentAt when agent sends yet another message', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            yield (0, rooms_1.sendAgentMessage)(room._id);
            const updatedRoom = yield (0, rooms_1.getLivechatRoomInfo)(room._id);
            const lastMessageTs = (_a = updatedRoom.responseBy) === null || _a === void 0 ? void 0 : _a.lastMessageTs;
            const firstResponseTs = (_b = updatedRoom.responseBy) === null || _b === void 0 ? void 0 : _b.firstResponseTs;
            const predictedVisitorAbandonmentAt = (_c = updatedRoom.omnichannel) === null || _c === void 0 ? void 0 : _c.predictedVisitorAbandonmentAt;
            (0, chai_1.expect)(predictedVisitorAbandonmentAt).to.not.be.undefined;
            (0, chai_1.expect)(lastMessageTs).to.not.be.undefined;
            // expect predictedVisitorAbandonmentAt to be 60 seconds after first message
            const lastMessageTsDate = new Date(lastMessageTs);
            const predictedVisitorAbandonmentAtDate = new Date(predictedVisitorAbandonmentAt);
            const firstResponseTsDate = new Date(firstResponseTs);
            (0, chai_1.expect)(predictedVisitorAbandonmentAtDate.getTime()).to.be.equal(firstResponseTsDate.getTime() + 60000);
            // lastMessageTs should be updated
            (0, chai_1.expect)(lastMessageTsDate.getTime()).to.not.be.equal(firstResponseTsDate.getTime());
            (0, chai_1.expect)(lastMessageTsDate.getTime()).to.be.greaterThan(firstResponseTsDate.getTime());
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_abandoned_rooms_action', 'none');
            yield (0, permissions_helper_1.updateSetting)('Livechat_visitor_inactivity_timeout', 3600);
        }));
    });
});
