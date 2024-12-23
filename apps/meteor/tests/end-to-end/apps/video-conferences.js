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
const api_data_1 = require("../../data/api-data");
const helper_1 = require("../../data/apps/helper");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const constants_1 = require("../../e2e/config/constants");
(0, mocha_1.describe)('Apps - Video Conferences', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    const roomName = `apps-e2etest-room-${Date.now()}-videoconf`;
    let roomId;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, rooms_helper_1.createRoom)({
            type: 'p',
            name: roomName,
            username: undefined,
            token: undefined,
            agentId: undefined,
            members: undefined,
            credentials: undefined,
            extraData: undefined,
        });
        roomId = res.body.group._id;
    }));
    (0, mocha_1.after)(() => Promise.all([(0, helper_1.cleanupApps)(), (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: roomId }), (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', '')]));
    (0, mocha_1.describe)('[With No App]', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, helper_1.cleanupApps)();
        }));
        (0, mocha_1.it)('should fail to load capabilities', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('video-conference.capabilities'))
                .set(api_data_1.credentials)
                .send()
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.equal(false);
                (0, chai_1.expect)(res.body.error).to.be.equal('no-videoconf-provider-app');
            });
        }));
        (0, mocha_1.it)('should fail to start a call', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('video-conference.start'))
                .set(api_data_1.credentials)
                .send({
                roomId,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body.success).to.be.equal(false);
                (0, chai_1.expect)(res.body.error).to.be.equal('no-videoconf-provider-app');
            });
        }));
    });
    (constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[With Test App]', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, helper_1.cleanupApps)();
            yield (0, helper_1.installTestApp)();
            yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', '');
            yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
            if (!process.env.IS_EE) {
                return;
            }
            yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', false);
            yield (0, permissions_helper_1.updateSetting)('VideoConf_Persistent_Chat_Discussion_Name', '[date] - Video Call Persisted Chat');
        }));
        (0, mocha_1.describe)('[/video-conference.capabilities]', () => {
            (0, mocha_1.it)('should fail to load capabilities with no default provider', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', '');
                yield api_data_1.request
                    .get((0, api_data_1.api)('video-conference.capabilities'))
                    .set(api_data_1.credentials)
                    .send()
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('no-active-video-conf-provider');
                });
            }));
            (0, mocha_1.it)('should fail to load capabilities with an invalid default provider', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'invalid');
                yield api_data_1.request
                    .get((0, api_data_1.api)('video-conference.capabilities'))
                    .set(api_data_1.credentials)
                    .send()
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('no-active-video-conf-provider');
                });
            }));
            (0, mocha_1.it)('should fail to load capabilities with a default provider lacking configuration', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'unconfigured');
                yield api_data_1.request
                    .get((0, api_data_1.api)('video-conference.capabilities'))
                    .set(api_data_1.credentials)
                    .send()
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('video-conf-provider-not-configured');
                });
            }));
            (0, mocha_1.it)('should load capabilities successfully with a valid default provider', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                yield api_data_1.request
                    .get((0, api_data_1.api)('video-conference.capabilities'))
                    .set(api_data_1.credentials)
                    .send()
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body.providerName).to.be.equal('test');
                    (0, chai_1.expect)(res.body.capabilities).to.be.an('object');
                    (0, chai_1.expect)(res.body.capabilities).to.have.a.property('mic').equal(true);
                    (0, chai_1.expect)(res.body.capabilities).to.have.a.property('cam').equal(false);
                    (0, chai_1.expect)(res.body.capabilities).to.have.a.property('title').equal(true);
                    (0, chai_1.expect)(res.body.capabilities).to.have.a.property('persistentChat').equal(false);
                });
            }));
        });
        (0, mocha_1.describe)('[/video-conference.start]', () => {
            (0, mocha_1.it)('should fail to start a call with no default provider', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', '');
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.start'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId,
                })
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('no-active-video-conf-provider');
                });
            }));
            (0, mocha_1.it)('should fail to start a call with an invalid default provider', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'invalid');
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.start'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId,
                })
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('no-active-video-conf-provider');
                });
            }));
            (0, mocha_1.it)('should fail to start a call with a default provider lacking configuration', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'unconfigured');
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.start'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId,
                })
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('video-conf-provider-not-configured');
                });
            }));
            (0, mocha_1.it)('should start a call successfully with a valid default provider', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.start'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body.data).to.be.an('object');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('providerName').equal('test');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('type').equal('videoconference');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('callId').that.is.a('string');
                    // expect(res.body.data).to.have.a.property('rid').equal(roomId);
                    // expect(res.body.data).to.have.a.property('createdBy').that.is.an('object').with.a.property('username').equal(adminUsername);
                });
            }));
            (0, mocha_1.it)('should start a call successfully when sending a title', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.start'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId,
                    title: 'Conference Title',
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body.data).to.be.an('object');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('providerName').equal('test');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('type').equal('videoconference');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('callId').that.is.a('string');
                });
            }));
            (0, mocha_1.it)('should start a call successfully when sending the allowRinging attribute', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.start'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId,
                    title: 'Conference Title',
                    allowRinging: true,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body.data).to.be.an('object');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('providerName').equal('test');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('type').equal('videoconference');
                    (0, chai_1.expect)(res.body.data).to.have.a.property('callId').that.is.a('string');
                });
            }));
            (0, mocha_1.it)('should start a call successfully when using a provider that supports persistent chat', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        this.skip();
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    yield api_data_1.request
                        .post((0, api_data_1.api)('video-conference.start'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId,
                    })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body.success).to.be.equal(true);
                        (0, chai_1.expect)(res.body.data).to.be.an('object');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('providerName').equal('persistentchat');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('type').equal('videoconference');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('callId').that.is.a('string');
                    });
                });
            });
            (0, mocha_1.it)('should start a call successfully when using a provider that supports persistent chat with the feature disabled', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        this.skip();
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', false);
                    yield api_data_1.request
                        .post((0, api_data_1.api)('video-conference.start'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId,
                    })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body.success).to.be.equal(true);
                        (0, chai_1.expect)(res.body.data).to.be.an('object');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('providerName').equal('persistentchat');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('type').equal('videoconference');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('callId').that.is.a('string');
                    });
                });
            });
            (0, mocha_1.it)('should start a call successfully when using a provider that supports persistent chat with discussions disabled', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        this.skip();
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', false);
                    yield api_data_1.request
                        .post((0, api_data_1.api)('video-conference.start'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId,
                    })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body.success).to.be.equal(true);
                        (0, chai_1.expect)(res.body.data).to.be.an('object');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('providerName').equal('persistentchat');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('type').equal('videoconference');
                        (0, chai_1.expect)(res.body.data).to.have.a.property('callId').that.is.a('string');
                    });
                });
            });
        });
        (0, mocha_1.describe)('[/video-conference.join]', () => {
            let callId;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                    roomId,
                });
                callId = res.body.data.callId;
            }));
            (0, mocha_1.it)('should join a videoconference successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.join'))
                    .set(api_data_1.credentials)
                    .send({
                    callId,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('test');
                    const userId = api_data_1.credentials['X-User-Id'];
                    (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`test/videoconference/${callId}/${roomName}/${userId}`);
                });
            }));
            (0, mocha_1.it)('should join a videoconference using the specified state', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('video-conference.join'))
                    .set(api_data_1.credentials)
                    .send({
                    callId,
                    state: {
                        mic: true,
                        cam: false,
                    },
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('test');
                    const userId = api_data_1.credentials['X-User-Id'];
                    (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`test/videoconference/${callId}/${roomName}/${userId}/mic`);
                });
            }));
        });
        (0, mocha_1.describe)('[/video-conference.info]', () => {
            let callId;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                    roomId,
                });
                callId = res.body.data.callId;
            }));
            (0, mocha_1.it)('should load the video conference data successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('video-conference.info'))
                    .set(api_data_1.credentials)
                    .query({
                    callId,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.success).to.be.equal(true);
                    (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('test');
                    (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                    (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                    (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`test/videoconference/${callId}/${roomName}`);
                    (0, chai_1.expect)(res.body).to.have.a.property('type').equal('videoconference');
                    (0, chai_1.expect)(res.body).to.have.a.property('rid').equal(roomId);
                    (0, chai_1.expect)(res.body).to.have.a.property('users').that.is.an('array').with.lengthOf(0);
                    (0, chai_1.expect)(res.body).to.have.a.property('status').equal(1);
                    (0, chai_1.expect)(res.body).to.have.a.property('title').equal(roomName);
                    (0, chai_1.expect)(res.body).to.have.a.property('messages').that.is.an('object');
                    (0, chai_1.expect)(res.body.messages).to.have.a.property('started').that.is.a('string');
                    (0, chai_1.expect)(res.body).to.have.a.property('createdBy').that.is.an('object');
                    (0, chai_1.expect)(res.body.createdBy).to.have.a.property('_id').equal(api_data_1.credentials['X-User-Id']);
                    (0, chai_1.expect)(res.body.createdBy).to.have.a.property('username').equal(user_1.adminUsername);
                });
            }));
        });
        (0, mocha_1.describe)('[video-conference.start + video-conference.info]', () => {
            (0, mocha_1.describe)('[Test provider with the persistent chat feature disabled]', () => {
                let callId;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    if (process.env.IS_EE) {
                        yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', false);
                    }
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId = res.body.data.callId;
                }));
                (0, mocha_1.it)('should load the video conference data successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .get((0, api_data_1.api)('video-conference.info'))
                        .set(api_data_1.credentials)
                        .query({
                        callId,
                    })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body.success).to.be.equal(true);
                        (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('test');
                        (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                        (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                        (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`test/videoconference/${callId}/${roomName}`);
                        (0, chai_1.expect)(res.body).to.have.a.property('type').equal('videoconference');
                        (0, chai_1.expect)(res.body).to.have.a.property('rid').equal(roomId);
                        (0, chai_1.expect)(res.body).to.have.a.property('users').that.is.an('array').with.lengthOf(0);
                        (0, chai_1.expect)(res.body).to.have.a.property('status').equal(1);
                        (0, chai_1.expect)(res.body).to.have.a.property('title').equal(roomName);
                        (0, chai_1.expect)(res.body).to.have.a.property('messages').that.is.an('object');
                        (0, chai_1.expect)(res.body.messages).to.have.a.property('started').that.is.a('string');
                        (0, chai_1.expect)(res.body).to.have.a.property('createdBy').that.is.an('object');
                        (0, chai_1.expect)(res.body.createdBy).to.have.a.property('_id').equal(api_data_1.credentials['X-User-Id']);
                        (0, chai_1.expect)(res.body.createdBy).to.have.a.property('username').equal(user_1.adminUsername);
                        (0, chai_1.expect)(res.body).to.not.have.a.property('discussionRid');
                    });
                }));
            });
            (0, mocha_1.describe)('[Test provider with the persistent chat feature enabled]', () => {
                let callId;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId = res.body.data.callId;
                }));
                (0, mocha_1.it)('should load the video conference data successfully', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('video-conference.info'))
                            .set(api_data_1.credentials)
                            .query({
                            callId,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body.success).to.be.equal(true);
                            (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('test');
                            (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                            (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                            (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`test/videoconference/${callId}/${roomName}`);
                            (0, chai_1.expect)(res.body).to.have.a.property('type').equal('videoconference');
                            (0, chai_1.expect)(res.body).to.have.a.property('rid').equal(roomId);
                            (0, chai_1.expect)(res.body).to.have.a.property('users').that.is.an('array').with.lengthOf(0);
                            (0, chai_1.expect)(res.body).to.have.a.property('status').equal(1);
                            (0, chai_1.expect)(res.body).to.have.a.property('title').equal(roomName);
                            (0, chai_1.expect)(res.body).to.have.a.property('messages').that.is.an('object');
                            (0, chai_1.expect)(res.body.messages).to.have.a.property('started').that.is.a('string');
                            (0, chai_1.expect)(res.body).to.have.a.property('createdBy').that.is.an('object');
                            (0, chai_1.expect)(res.body.createdBy).to.have.a.property('_id').equal(api_data_1.credentials['X-User-Id']);
                            (0, chai_1.expect)(res.body.createdBy).to.have.a.property('username').equal(user_1.adminUsername);
                            (0, chai_1.expect)(res.body).to.not.have.a.property('discussionRid');
                        });
                    });
                });
            });
            (0, mocha_1.describe)('[Persistent Chat provider with the persistent chat feature enabled]', () => {
                let callId;
                let discussionRid;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Persistent_Chat_Discussion_Name', 'Chat History');
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId = res.body.data.callId;
                }));
                (0, mocha_1.it)('should include a discussion room id on the response', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('video-conference.info'))
                            .set(api_data_1.credentials)
                            .query({
                            callId,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body.success).to.be.equal(true);
                            (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('persistentchat');
                            (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                            (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                            (0, chai_1.expect)(res.body).to.have.a.property('discussionRid').that.is.a('string');
                            discussionRid = res.body.discussionRid;
                            (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`pchat/videoconference/${callId}/${discussionRid}`);
                        });
                    });
                });
                (0, mocha_1.it)('should have created the discussion room using the configured name', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('rooms.info'))
                            .set(api_data_1.credentials)
                            .query({
                            roomId: discussionRid,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', true);
                            (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                            (0, chai_1.expect)(res.body.room).to.have.a.property('_id').equal(discussionRid);
                            (0, chai_1.expect)(res.body.room)
                                .to.have.a.property('fname')
                                .that.is.a('string')
                                .that.satisfies((msg) => !msg.startsWith('Chat History'))
                                .that.satisfies((msg) => msg.includes('Chat History'));
                        });
                    });
                });
            });
            (0, mocha_1.describe)('[Persistent Chat provider with the persistent chat feature enabled and custom discussion names]', () => {
                let callId;
                let discussionRid;
                let chatDate;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Persistent_Chat_Discussion_Name', 'Date [date] between');
                    chatDate = new Date().toISOString().substring(0, 10);
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId = res.body.data.callId;
                }));
                (0, mocha_1.it)('should include a discussion room id on the response', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('video-conference.info'))
                            .set(api_data_1.credentials)
                            .query({
                            callId,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body.success).to.be.equal(true);
                            (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('persistentchat');
                            (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                            (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                            (0, chai_1.expect)(res.body).to.have.a.property('discussionRid').that.is.a('string');
                            discussionRid = res.body.discussionRid;
                            (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`pchat/videoconference/${callId}/${discussionRid}`);
                        });
                    });
                });
                (0, mocha_1.it)('should have created the discussion room using the configured name', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('rooms.info'))
                            .set(api_data_1.credentials)
                            .query({
                            roomId: discussionRid,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', true);
                            (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                            (0, chai_1.expect)(res.body.room).to.have.a.property('_id').equal(discussionRid);
                            (0, chai_1.expect)(res.body.room)
                                .to.have.a.property('fname')
                                .that.is.a('string')
                                .that.satisfies((msg) => msg.includes(`Date ${chatDate} between`));
                        });
                    });
                });
            });
            (0, mocha_1.describe)('[Persistent Chat provider with the persistent chat feature disabled]', () => {
                let callId;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    if (process.env.IS_EE) {
                        yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', false);
                    }
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId = res.body.data.callId;
                }));
                (0, mocha_1.it)('should not include a discussion room id on the response', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .get((0, api_data_1.api)('video-conference.info'))
                        .set(api_data_1.credentials)
                        .query({
                        callId,
                    })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body.success).to.be.equal(true);
                        (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('persistentchat');
                        (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                        (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                        (0, chai_1.expect)(res.body).to.not.have.a.property('discussionRid');
                        (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`pchat/videoconference/${callId}/none`);
                    });
                }));
            });
            (0, mocha_1.describe)('[Persistent Chat provider with the persistent chat feature enabled but discussions disabled]', () => {
                let callId;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', false);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId = res.body.data.callId;
                }));
                (0, mocha_1.it)('should not include a discussion room id on the response', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('video-conference.info'))
                            .set(api_data_1.credentials)
                            .query({
                            callId,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body.success).to.be.equal(true);
                            (0, chai_1.expect)(res.body).to.have.a.property('providerName').equal('persistentchat');
                            (0, chai_1.expect)(res.body).to.not.have.a.property('providerData');
                            (0, chai_1.expect)(res.body).to.have.a.property('_id').equal(callId);
                            (0, chai_1.expect)(res.body).to.not.have.a.property('discussionRid');
                            (0, chai_1.expect)(res.body).to.have.a.property('url').equal(`pchat/videoconference/${callId}/none`);
                        });
                    });
                });
            });
        });
        (0, mocha_1.describe)('[/video-conference.list]', () => {
            (0, mocha_1.describe)('[Test provider]', () => {
                let callId1;
                let callId2;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId1 = res.body.data.callId;
                    const res2 = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId2 = res2.body.data.callId;
                }));
                (0, mocha_1.it)('should load the list of video conferences sorted by new', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .get((0, api_data_1.api)('video-conference.list'))
                        .set(api_data_1.credentials)
                        .query({
                        roomId,
                    })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body.success).to.be.equal(true);
                        (0, chai_1.expect)(res.body).to.have.a.property('count').that.is.greaterThanOrEqual(2);
                        (0, chai_1.expect)(res.body).to.have.a.property('data').that.is.an('array').with.lengthOf(res.body.count);
                        const call2 = res.body.data[0];
                        const call1 = res.body.data[1];
                        (0, chai_1.expect)(call1).to.have.a.property('_id').equal(callId1);
                        (0, chai_1.expect)(call1).to.have.a.property('url').equal(`test/videoconference/${callId1}/${roomName}`);
                        (0, chai_1.expect)(call1).to.have.a.property('type').equal('videoconference');
                        (0, chai_1.expect)(call1).to.have.a.property('rid').equal(roomId);
                        (0, chai_1.expect)(call1).to.have.a.property('users').that.is.an('array').with.lengthOf(0);
                        (0, chai_1.expect)(call1).to.have.a.property('status').equal(1);
                        (0, chai_1.expect)(call1).to.have.a.property('title').equal(roomName);
                        (0, chai_1.expect)(call1).to.have.a.property('messages').that.is.an('object');
                        (0, chai_1.expect)(call1.messages).to.have.a.property('started').that.is.a('string');
                        (0, chai_1.expect)(call1).to.have.a.property('createdBy').that.is.an('object');
                        (0, chai_1.expect)(call1.createdBy).to.have.a.property('_id').equal(api_data_1.credentials['X-User-Id']);
                        (0, chai_1.expect)(call1.createdBy).to.have.a.property('username').equal(user_1.adminUsername);
                        (0, chai_1.expect)(call1).to.not.have.a.property('discussionRid');
                        (0, chai_1.expect)(call2).to.have.a.property('_id').equal(callId2);
                    });
                }));
            });
            (0, mocha_1.describe)('[Persistent Chat Provider]', () => {
                let callId1;
                let callId2;
                let callId3;
                let callId4;
                (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                    if (!process.env.IS_EE) {
                        return;
                    }
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', true);
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'test');
                    const res = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId1 = res.body.data.callId;
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Default_Provider', 'persistentchat');
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', false);
                    const res2 = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId2 = res2.body.data.callId;
                    yield (0, permissions_helper_1.updateSetting)('VideoConf_Enable_Persistent_Chat', true);
                    const res3 = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId3 = res3.body.data.callId;
                    yield (0, permissions_helper_1.updateSetting)('Discussion_enabled', false);
                    const res4 = yield api_data_1.request.post((0, api_data_1.api)('video-conference.start')).set(api_data_1.credentials).send({
                        roomId,
                    });
                    callId4 = res4.body.data.callId;
                }));
                (0, mocha_1.it)('should load the list of video conferences sorted by new', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!process.env.IS_EE) {
                            this.skip();
                            return;
                        }
                        yield api_data_1.request
                            .get((0, api_data_1.api)('video-conference.list'))
                            .set(api_data_1.credentials)
                            .query({
                            roomId,
                        })
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body.success).to.be.equal(true);
                            (0, chai_1.expect)(res.body).to.have.a.property('count').that.is.greaterThanOrEqual(4);
                            (0, chai_1.expect)(res.body).to.have.a.property('data').that.is.an('array').with.lengthOf(res.body.count);
                            const call4 = res.body.data[0];
                            const call3 = res.body.data[1];
                            const call2 = res.body.data[2];
                            const call1 = res.body.data[3];
                            (0, chai_1.expect)(call1).to.have.a.property('_id').equal(callId1);
                            (0, chai_1.expect)(call1).to.have.a.property('url').equal(`test/videoconference/${callId1}/${roomName}`);
                            (0, chai_1.expect)(call1).to.have.a.property('type').equal('videoconference');
                            (0, chai_1.expect)(call1).to.have.a.property('rid').equal(roomId);
                            (0, chai_1.expect)(call1).to.have.a.property('users').that.is.an('array').with.lengthOf(0);
                            (0, chai_1.expect)(call1).to.have.a.property('status').equal(1);
                            (0, chai_1.expect)(call1).to.have.a.property('title').equal(roomName);
                            (0, chai_1.expect)(call1).to.have.a.property('messages').that.is.an('object');
                            (0, chai_1.expect)(call1.messages).to.have.a.property('started').that.is.a('string');
                            (0, chai_1.expect)(call1).to.have.a.property('createdBy').that.is.an('object');
                            (0, chai_1.expect)(call1.createdBy).to.have.a.property('_id').equal(api_data_1.credentials['X-User-Id']);
                            (0, chai_1.expect)(call1.createdBy).to.have.a.property('username').equal(user_1.adminUsername);
                            (0, chai_1.expect)(call1).to.not.have.a.property('discussionRid');
                            (0, chai_1.expect)(call2).to.have.a.property('_id').equal(callId2);
                            (0, chai_1.expect)(call2).to.not.have.a.property('discussionRid');
                            (0, chai_1.expect)(call3).to.have.a.property('_id').equal(callId3);
                            (0, chai_1.expect)(call3).to.have.a.property('discussionRid').that.is.a('string');
                            (0, chai_1.expect)(call4).to.have.a.property('_id').equal(callId4);
                            (0, chai_1.expect)(call4).to.not.have.a.property('discussionRid');
                        });
                    });
                });
            });
        });
    });
});
