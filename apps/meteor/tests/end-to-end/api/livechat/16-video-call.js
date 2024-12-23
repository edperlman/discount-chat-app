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
const permissions_helper_1 = require("../../../data/permissions.helper");
(0, mocha_1.describe)('LIVECHAT - WebRTC video call', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('Livechat_enabled', true);
        yield (0, permissions_helper_1.updateSetting)('Livechat_accept_chats_with_no_agents', true);
    }));
    (0, mocha_1.describe)('livechat/webrtc.call', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/webrtc.call')).set(api_data_1.credentials).query({
                rid: 'invalid-room',
            });
            (0, chai_1.expect)(response.statusCode).to.be.equal(403);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['user', 'bot', 'livechat-agent', 'admin']);
        }));
        (0, mocha_1.it)('should fail if room doesnt exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/webrtc.call')).set(api_data_1.credentials).query({
                rid: 'invalid-room',
            });
            (0, chai_1.expect)(response.statusCode).to.be.equal(400);
        }));
        (0, mocha_1.it)('should fail if WebRTC_Enabled setting is set to false', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('WebRTC_Enabled', false);
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/webrtc.call')).set(api_data_1.credentials).query({
                rid: room._id,
            });
            (0, chai_1.expect)(response.statusCode).to.be.equal(400);
            yield (0, permissions_helper_1.updateSetting)('WebRTC_Enabled', true);
        }));
        (0, mocha_1.it)('should fail if WebRTC_Enabled is true but Omnichannel_call_provider setting is not WebRTC', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Omnichannel_call_provider', 'default-provider');
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/webrtc.call')).set(api_data_1.credentials).query({
                rid: room._id,
            });
            (0, chai_1.expect)(response.statusCode).to.be.equal(400);
            yield (0, permissions_helper_1.updateSetting)('Omnichannel_call_provider', 'WebRTC');
        }));
        (0, mocha_1.it)('should return callStatus as "ringing" when room doesnt have any active call', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const response = yield api_data_1.request.get((0, api_data_1.api)('livechat/webrtc.call')).set(api_data_1.credentials).query({
                rid: room._id,
            });
            (0, chai_1.expect)(response.statusCode).to.be.equal(200);
            (0, chai_1.expect)(response.body).to.have.a.property('videoCall').that.is.an('object');
            (0, chai_1.expect)(response.body.videoCall).to.have.property('callStatus', 'ringing');
            (0, chai_1.expect)(response.body.videoCall).to.have.property('provider', 'webrtc');
        }));
    });
    (0, mocha_1.describe)('livechat/webrtc.call/:callId', () => {
        (0, mocha_1.it)('should fail if user doesnt have view-l-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-l-room', []);
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/webrtc.call/invalid-call'))
                .send({ rid: 'fasd', status: 'invalid' })
                .set(api_data_1.credentials);
            (0, chai_1.expect)(response.statusCode).to.be.equal(403);
            yield (0, permissions_helper_1.updatePermission)('view-l-room', ['user', 'bot', 'livechat-agent', 'admin']);
        }));
        (0, mocha_1.it)('should fail if room doesnt exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/webrtc.call/invalid-call'))
                .send({ rid: 'invalid', status: 'invalid' })
                .set(api_data_1.credentials);
            (0, chai_1.expect)(response.statusCode).to.be.equal(400);
        }));
        (0, mocha_1.it)('should fail when rid is good, but callId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const response = yield api_data_1.request
                .put((0, api_data_1.api)('livechat/webrtc.call/invalid-call'))
                .send({ rid: room._id, status: 'invalid' })
                .set(api_data_1.credentials);
            (0, chai_1.expect)(response.statusCode).to.be.equal(400);
        }));
        (0, mocha_1.it)('should fail when callId points to a message but message is not of type livechat_webrtc_video_call', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            const message = yield (0, rooms_1.sendMessage)(room._id, 'This is a test message', visitor.token);
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/webrtc.call/${message._id}`))
                .send({ rid: room._id, status: 'invalid' })
                .set(api_data_1.credentials);
            (0, chai_1.expect)(response.statusCode).to.be.equal(400);
        }));
        (0, mocha_1.it)('should update the call status when all params and room are good', () => __awaiter(void 0, void 0, void 0, function* () {
            const visitor = yield (0, rooms_1.createVisitor)();
            const room = yield (0, rooms_1.createLivechatRoom)(visitor.token);
            // Start call
            yield api_data_1.request
                .get((0, api_data_1.api)('livechat/webrtc.call'))
                .set(api_data_1.credentials)
                .query({
                rid: room._id,
            })
                .expect(200);
            const messages = yield (0, rooms_1.fetchMessages)(room._id, visitor.token);
            const callMessage = messages.find((message) => message.t === 'livechat_webrtc_video_call');
            (0, chai_1.expect)(callMessage).to.be.an('object');
            const response = yield api_data_1.request
                .put((0, api_data_1.api)(`livechat/webrtc.call/${callMessage === null || callMessage === void 0 ? void 0 : callMessage._id}`))
                .send({ rid: room._id, status: 'invalid' })
                .set(api_data_1.credentials);
            (0, chai_1.expect)(response.statusCode).to.be.equal(200);
            (0, chai_1.expect)(response.body).to.have.a.property('status', 'invalid');
        }));
    });
});
