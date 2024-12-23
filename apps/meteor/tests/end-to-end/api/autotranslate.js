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
const chat_helper_1 = require("../../data/chat.helper");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const resetAutoTranslateDefaults = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        (0, permissions_helper_1.updateSetting)('AutoTranslate_Enabled', false),
        (0, permissions_helper_1.updateSetting)('AutoTranslate_AutoEnableOnJoinRoom', false),
        (0, permissions_helper_1.updateSetting)('Language', ''),
        (0, permissions_helper_1.updatePermission)('auto-translate', ['admin']),
    ]);
});
const resetE2EDefaults = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([(0, permissions_helper_1.updateSetting)('E2E_Enabled_Default_PrivateRooms', false), (0, permissions_helper_1.updateSetting)('E2E_Enable', false)]);
});
(0, mocha_1.describe)('AutoTranslate', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[AutoTranslate]', () => {
        (0, mocha_1.describe)('[/autotranslate.getSupportedLanguages', () => {
            (0, mocha_1.before)(() => resetAutoTranslateDefaults());
            (0, mocha_1.after)(() => resetAutoTranslateDefaults());
            (0, mocha_1.it)('should throw an error when the "AutoTranslate_Enabled" setting is disabled', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('autotranslate.getSupportedLanguages'))
                    .set(api_data_1.credentials)
                    .query({
                    targetLanguage: 'en',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('AutoTranslate is disabled.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the user does not have the "auto-translate" permission', (done) => {
                void (0, permissions_helper_1.updateSetting)('AutoTranslate_Enabled', true).then(() => {
                    void (0, permissions_helper_1.updatePermission)('auto-translate', []).then(() => {
                        void api_data_1.request
                            .get((0, api_data_1.api)('autotranslate.getSupportedLanguages'))
                            .set(api_data_1.credentials)
                            .query({
                            targetLanguage: 'en',
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                            (0, chai_1.expect)(res.body.errorType).to.be.equal('error-action-not-allowed');
                            (0, chai_1.expect)(res.body.error).to.be.equal('Auto-Translate is not allowed [error-action-not-allowed]');
                        })
                            .end(done);
                    });
                });
            });
            (0, mocha_1.it)('should return a list of languages', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('auto-translate', ['admin']);
                yield api_data_1.request
                    .get((0, api_data_1.api)('autotranslate.getSupportedLanguages'))
                    .set(api_data_1.credentials)
                    .query({
                    targetLanguage: 'en',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body.languages).to.be.an('array');
                });
            }));
        });
        (0, mocha_1.describe)('[/autotranslate.saveSettings', () => {
            let testGroupId;
            let testChannelId;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    resetAutoTranslateDefaults(),
                    (0, permissions_helper_1.updateSetting)('E2E_Enable', true),
                    (0, permissions_helper_1.updateSetting)('E2E_Enabled_Default_PrivateRooms', true),
                ]);
                testGroupId = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `e2etest-autotranslate-${Date.now()}` })).body.group._id;
                testChannelId = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `test-autotranslate-${Date.now()}` })).body.channel._id;
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    resetAutoTranslateDefaults(),
                    resetE2EDefaults(),
                    (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroupId }),
                    (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannelId }),
                ]);
            }));
            (0, mocha_1.it)('should throw an error when the "AutoTranslate_Enabled" setting is disabled', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                    field: 'autoTranslate',
                    defaultLanguage: 'en',
                    value: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('AutoTranslate is disabled.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the user does not have the "auto-translate" permission', (done) => {
                void (0, permissions_helper_1.updateSetting)('AutoTranslate_Enabled', true).then(() => {
                    void (0, permissions_helper_1.updatePermission)('auto-translate', []).then(() => {
                        void api_data_1.request
                            .post((0, api_data_1.api)('autotranslate.saveSettings'))
                            .set(api_data_1.credentials)
                            .send({
                            roomId: testChannelId,
                            defaultLanguage: 'en',
                            field: 'autoTranslateLanguage',
                            value: 'en',
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                            (0, chai_1.expect)(res.body.errorType).to.be.equal('error-action-not-allowed');
                            (0, chai_1.expect)(res.body.error).to.be.equal('Auto-Translate is not allowed [error-action-not-allowed]');
                        })
                            .end(done);
                    });
                });
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "roomId" is not provided', (done) => {
                void (0, permissions_helper_1.updatePermission)('auto-translate', ['admin']).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('autotranslate.saveSettings'))
                        .set(api_data_1.credentials)
                        .send({})
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    })
                        .end(done);
                });
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "field" is not provided', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "value" is not provided', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                    field: 'autoTranslate',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "autoTranslate" is not a boolean', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                    field: 'autoTranslate',
                    value: 'test',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "autoTranslateLanguage" is not a string', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                    field: 'autoTranslateLanguage',
                    value: 12,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "field" is invalid', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                    field: 'invalid',
                    value: 12,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "roomId" is invalid or the user is not subscribed', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: 'invalid',
                    field: 'autoTranslateLanguage',
                    value: 'en',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-invalid-subscription');
                    (0, chai_1.expect)(res.body.error).to.be.equal('Invalid subscription [error-invalid-subscription]');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when E2E encryption is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testGroupId,
                    field: 'autoTranslate',
                    defaultLanguage: 'en',
                    value: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-e2e-enabled');
                });
            }));
            (0, mocha_1.it)('should return success when the setting is saved correctly', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.saveSettings'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelId,
                    field: 'autoTranslateLanguage',
                    value: 'en',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('[/autotranslate.translateMessage', () => {
            let messageSent;
            let testChannelId;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield resetAutoTranslateDefaults();
                testChannelId = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `test-autotranslate-message-${Date.now()}` })).body.channel._id;
                const res = yield (0, chat_helper_1.sendSimpleMessage)({
                    roomId: testChannelId,
                    text: 'Isso é um teste',
                });
                messageSent = res.body.message;
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([resetAutoTranslateDefaults(), (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannelId })]);
            }));
            (0, mocha_1.it)('should throw an error when the "AutoTranslate_Enabled" setting is disabled', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.translateMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: 'test',
                    targetLanguage: 'en',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('AutoTranslate is disabled.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "messageId" is not provided', (done) => {
                void (0, permissions_helper_1.updateSetting)('AutoTranslate_Enabled', true).then(() => {
                    void (0, permissions_helper_1.updatePermission)('auto-translate', ['admin']).then(() => {
                        void api_data_1.request
                            .post((0, api_data_1.api)('autotranslate.translateMessage'))
                            .set(api_data_1.credentials)
                            .send({})
                            .expect('Content-Type', 'application/json')
                            .expect(400)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                        })
                            .end(done);
                    });
                });
            });
            (0, mocha_1.it)('should throw an error when the bodyParam "messageId" is invalid', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.translateMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: 'invalid',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('Message not found.');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return success when the translate is successful', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('autotranslate.translateMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    messageId: messageSent._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('Autoenable setting', () => {
            let userA;
            let userB;
            let credA;
            let credB;
            let channel;
            const channelsToRemove = [];
            const createChannel = (members, cred) => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, rooms_helper_1.createRoom)({ type: 'c', members, name: `channel-test-${Date.now()}`, credentials: cred })).body.channel; });
            const setLanguagePref = (language, cred) => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.setPreferences'))
                    .set(cred)
                    .send({ data: { language } })
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            });
            const getSub = (roomId, cred) => __awaiter(void 0, void 0, void 0, function* () {
                return (yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(cred)
                    .query({
                    roomId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
                })).body.subscription;
            });
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    (0, permissions_helper_1.updateSetting)('AutoTranslate_Enabled', true),
                    (0, permissions_helper_1.updateSetting)('AutoTranslate_AutoEnableOnJoinRoom', true),
                    (0, permissions_helper_1.updateSetting)('Language', 'pt-BR'),
                ]);
                userA = yield (0, users_helper_1.createUser)();
                userB = yield (0, users_helper_1.createUser)();
                credA = yield (0, users_helper_1.login)(userA.username, user_1.password);
                credB = yield (0, users_helper_1.login)(userB.username, user_1.password);
                channel = yield createChannel(undefined, credA);
                yield setLanguagePref('en', credB);
                channelsToRemove.push(channel);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    (0, permissions_helper_1.updateSetting)('AutoTranslate_AutoEnableOnJoinRoom', false),
                    (0, permissions_helper_1.updateSetting)('AutoTranslate_Enabled', false),
                    (0, permissions_helper_1.updateSetting)('Language', ''),
                    (0, users_helper_1.deleteUser)(userA),
                    (0, users_helper_1.deleteUser)(userB),
                    channelsToRemove.map(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channel._id })),
                ]);
            }));
            (0, mocha_1.it)("should do nothing if the user hasn't changed his language preference", () => __awaiter(void 0, void 0, void 0, function* () {
                const sub = yield getSub(channel._id, credA);
                (0, chai_1.expect)(sub).to.not.have.property('autoTranslate');
                (0, chai_1.expect)(sub).to.not.have.property('autoTranslateLanguage');
            }));
            (0, mocha_1.it)("should do nothing if the user changed his language preference to be the same as the server's", () => __awaiter(void 0, void 0, void 0, function* () {
                yield setLanguagePref('pt-BR', credA);
                const sub = yield getSub(channel._id, credA);
                (0, chai_1.expect)(sub).to.not.have.property('autoTranslate');
                (0, chai_1.expect)(sub).to.not.have.property('autoTranslateLanguage');
            }));
            (0, mocha_1.it)('should enable autotranslate with the correct language when joining a room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('channels.join'))
                    .set(credB)
                    .send({
                    roomId: channel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200);
                const sub = yield getSub(channel._id, credB);
                (0, chai_1.expect)(sub).to.have.property('autoTranslate');
                (0, chai_1.expect)(sub).to.have.property('autoTranslateLanguage').and.to.be.equal('en');
            }));
            (0, mocha_1.it)('should enable autotranslate with the correct language when creating a new room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield setLanguagePref('en', credA);
                const newChannel = yield createChannel(undefined, credA);
                const sub = yield getSub(newChannel._id, credA);
                (0, chai_1.expect)(sub).to.have.property('autoTranslate');
                (0, chai_1.expect)(sub).to.have.property('autoTranslateLanguage').and.to.be.equal('en');
                channelsToRemove.push(newChannel);
            }));
            (0, mocha_1.it)('should enable autotranslate for all the members added to the room upon creation', () => __awaiter(void 0, void 0, void 0, function* () {
                const newChannel = yield createChannel([userA.username, userB.username], credA);
                const subA = yield getSub(newChannel._id, credA);
                (0, chai_1.expect)(subA).to.have.property('autoTranslate');
                (0, chai_1.expect)(subA).to.have.property('autoTranslateLanguage').and.to.be.equal('en');
                const subB = yield getSub(newChannel._id, credB);
                (0, chai_1.expect)(subB).to.have.property('autoTranslate');
                (0, chai_1.expect)(subB).to.have.property('autoTranslateLanguage').and.to.be.equal('en');
                channelsToRemove.push(newChannel);
            }));
            (0, mocha_1.it)('should enable autotranslate with the correct language when added to a room', () => __awaiter(void 0, void 0, void 0, function* () {
                const newChannel = yield createChannel(undefined, credA);
                yield api_data_1.request
                    .post((0, api_data_1.api)('channels.invite'))
                    .set(credA)
                    .send({
                    roomId: newChannel._id,
                    userId: userB._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200);
                const sub = yield getSub(newChannel._id, credB);
                (0, chai_1.expect)(sub).to.have.property('autoTranslate');
                (0, chai_1.expect)(sub).to.have.property('autoTranslateLanguage').and.to.be.equal('en');
                channelsToRemove.push(newChannel);
            }));
            (0, mocha_1.it)('should change the auto translate language when the user changes his language preference', () => __awaiter(void 0, void 0, void 0, function* () {
                yield setLanguagePref('es', credA);
                const newChannel = yield createChannel(undefined, credA);
                const subscription = yield getSub(newChannel._id, credA);
                (0, chai_1.expect)(subscription).to.have.property('autoTranslate', true);
                (0, chai_1.expect)(subscription).to.have.property('autoTranslateLanguage', 'es');
                channelsToRemove.push(newChannel);
            }));
        });
    });
});
