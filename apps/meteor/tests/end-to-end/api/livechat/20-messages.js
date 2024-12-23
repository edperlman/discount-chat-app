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
const chat_helper_1 = require("../../../data/chat.helper");
const rooms_1 = require("../../../data/livechat/rooms");
const users_1 = require("../../../data/livechat/users");
const permissions_helper_1 = require("../../../data/permissions.helper");
const rooms_helper_1 = require("../../../data/rooms.helper");
(0, mocha_1.describe)('LIVECHAT - messages', () => {
    let agent;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        agent = yield (0, rooms_1.createAgent)();
        yield (0, rooms_1.makeAgentAvailable)();
        yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Manual_Selection');
        yield (0, permissions_helper_1.updateEESetting)('Livechat_Require_Contact_Verification', 'never');
    }));
    (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection'), (0, users_1.removeAgent)(agent._id)]));
    (0, mocha_1.describe)('Quote message feature for visitors', () => {
        (0, mocha_1.it)('it should verify if visitor can quote message', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { room: { _id: roomId }, visitor: { token }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            yield (0, rooms_1.sendMessage)(roomId, 'Hello from visitor', token);
            const agentMsgSentence = faker_1.faker.lorem.sentence();
            const agentMsg = yield (0, rooms_1.sendAgentMessage)(roomId, agentMsgSentence);
            const siteUrl = process.env.SITE_URL || process.env.TEST_API_URL || 'http://localhost:3000';
            const msgLink = `${siteUrl}/live/${roomId}?msg=${agentMsg._id}`;
            const quotedMsgSentence = faker_1.faker.lorem.sentence();
            const wholeQuotedMsg = `[${msgLink}](${quotedMsgSentence})`;
            const quotedMessage = yield (0, rooms_1.sendMessage)(roomId, wholeQuotedMsg, token);
            (0, chai_1.expect)(quotedMessage).to.have.property('_id');
            (0, chai_1.expect)(quotedMessage).to.have.property('msg').that.is.equal(wholeQuotedMsg);
            (0, chai_1.expect)(quotedMessage).to.have.property('attachments');
            (0, chai_1.expect)(quotedMessage.attachments).to.be.an('array').that.has.lengthOf(1);
            const quotedMessageAttachments = (_a = quotedMessage.attachments) === null || _a === void 0 ? void 0 : _a[0];
            if (quotedMessageAttachments) {
                (0, chai_1.expect)(quotedMessageAttachments).to.have.property('message_link').that.is.equal(msgLink);
                (0, chai_1.expect)(quotedMessageAttachments).to.have.property('text').that.is.equal(agentMsgSentence);
            }
        }));
        (0, mocha_1.it)('should verify if visitor is receiving a message with a image attachment', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { room: { _id: roomId }, visitor: { token }, } = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            const imgMessage = yield (0, rooms_1.uploadFile)(roomId, token);
            (0, chai_1.expect)(imgMessage).to.have.property('files').that.is.an('array');
            (0, chai_1.expect)((_a = imgMessage.files) === null || _a === void 0 ? void 0 : _a[0]).to.have.keys('_id', 'name', 'type');
            (0, chai_1.expect)(imgMessage).to.have.property('file').that.deep.equal((_b = imgMessage === null || imgMessage === void 0 ? void 0 : imgMessage.files) === null || _b === void 0 ? void 0 : _b[0]);
        }));
    });
    (0, mocha_1.describe)('Livechat Messages', () => __awaiter(void 0, void 0, void 0, function* () {
        let room;
        let privateRoom;
        let visitor;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Livechat_Routing_Method', 'Auto_Selection');
            const data = yield (0, rooms_1.startANewLivechatRoomAndTakeIt)();
            visitor = data.visitor;
            room = data.room;
            const response = yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `private-room-${Math.random()}` });
            privateRoom = response.body.group;
        }));
        (0, mocha_1.after)(() => Promise.all([(0, rooms_1.closeOmnichannelRoom)(room._id), (0, rooms_helper_1.deleteRoom)({ roomId: privateRoom._id, type: 'p' })]));
        (0, mocha_1.it)('should not allow fetching arbitrary messages from another channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: privateRoom._id });
            const { message } = response.body;
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/message/${message._id}`))
                .query({ token: visitor.token, rid: room._id })
                .send()
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body.error).to.be.equal('invalid-message');
            });
        }));
        (0, mocha_1.it)('should allow fetching messages using their _id and roomId', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = yield (0, rooms_1.sendMessage)(room._id, 'Hello from visitor', visitor.token);
            yield api_data_1.request
                .get((0, api_data_1.api)(`livechat/message/${message._id}`))
                .query({ token: visitor.token, rid: room._id })
                .send()
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body.message._id).to.be.equal(message._id);
            });
        }));
    }));
});
