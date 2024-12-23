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
const apps_data_1 = require("../../data/apps/apps-data");
const helper_1 = require("../../data/apps/helper");
const chat_helper_1 = require("../../data/chat.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const constants_1 = require("../../e2e/config/constants");
(constants_1.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('Apps - Send Messages As User', () => {
    let app;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helper_1.cleanupApps)();
        app = yield (0, helper_1.installTestApp)();
    }));
    (0, mocha_1.after)(() => (0, helper_1.cleanupApps)());
    (0, mocha_1.describe)('[Send Message as user]', () => {
        (0, mocha_1.it)('should return an error when the room is not found', (done) => {
            void api_data_1.request
                .post((0, apps_data_1.apps)(`/public/${app.id}/send-message-as-user`))
                .send({
                roomId: 'invalid-room',
            })
                .set(api_data_1.credentials)
                .expect(404)
                .expect((err, res) => {
                (0, chai_1.expect)(err).to.have.a.property('error');
                (0, chai_1.expect)(res).to.be.equal(undefined);
                (0, chai_1.expect)(err.error).to.have.a.property('text');
                (0, chai_1.expect)(err.error.text).to.be.equal('Room "invalid-room" could not be found');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the user is not found', (done) => {
            void api_data_1.request
                .post((0, apps_data_1.apps)(`/public/${app.id}/send-message-as-user?userId=invalid-user`))
                .send({
                roomId: 'GENERAL',
            })
                .set(api_data_1.credentials)
                .expect(404)
                .expect((err, res) => {
                (0, chai_1.expect)(err).to.have.a.property('error');
                (0, chai_1.expect)(res).to.be.equal(undefined);
                (0, chai_1.expect)(err.error).to.have.a.property('text');
                (0, chai_1.expect)(err.error.text).to.be.equal('User with id "invalid-user" could not be found');
            })
                .end(done);
        });
        (0, mocha_1.describe)('Send to a Public Channel', () => {
            let publicMessageId;
            (0, mocha_1.it)('should send a message as app user', (done) => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)(`/public/${app.id}/send-message-as-user?userId=${user_1.adminUsername}`))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: 'GENERAL',
                })
                    .expect(200)
                    .expect((res) => {
                    const response = JSON.parse(res.text);
                    (0, chai_1.expect)(response).to.have.a.property('messageId');
                    publicMessageId = response.messageId;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should be a valid message', () => __awaiter(void 0, void 0, void 0, function* () {
                const message = yield (0, chat_helper_1.getMessageById)({ msgId: publicMessageId });
                (0, chai_1.expect)(message.msg).to.be.equal('Executing send-message-as-user test endpoint');
            }));
        });
        (0, mocha_1.describe)('Send to a Private Channel', () => {
            let privateMessageId;
            let group;
            let user;
            let userCredentials;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                group = (yield (0, rooms_helper_1.createRoom)({
                    type: 'p',
                    name: `apps-e2etest-room-${Date.now()}`,
                })).body.group;
                user = yield (0, users_helper_1.createUser)();
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            }));
            (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: group._id }), (0, users_helper_1.deleteUser)(user)]));
            (0, mocha_1.it)('should return 500 when sending a message as user that has no permissions', (done) => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)(`/public/${app.id}/send-message-as-user?userId=${user._id}`))
                    .set(userCredentials)
                    .send({
                    roomId: group._id,
                })
                    .expect(500)
                    .end(done);
            });
            (0, mocha_1.it)('should send a message as app user', (done) => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)(`/public/${app.id}/send-message-as-user?userId=${user_1.adminUsername}`))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: group._id,
                })
                    .expect(200)
                    .expect((res) => {
                    const response = JSON.parse(res.text);
                    (0, chai_1.expect)(response).to.have.a.property('messageId');
                    privateMessageId = response.messageId;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should be a valid message', () => __awaiter(void 0, void 0, void 0, function* () {
                const message = yield (0, chat_helper_1.getMessageById)({ msgId: privateMessageId });
                (0, chai_1.expect)(message.msg).to.be.equal('Executing send-message-as-user test endpoint');
            }));
        });
        (0, mocha_1.describe)('Send to a DM Channel', () => {
            let DMMessageId;
            let dmRoom;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                dmRoom = (yield (0, rooms_helper_1.createRoom)({
                    type: 'd',
                    username: 'rocket.cat',
                })).body.room;
            }));
            (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: dmRoom._id }));
            (0, mocha_1.it)('should send a message as app user', (done) => {
                void api_data_1.request
                    .post((0, apps_data_1.apps)(`/public/${app.id}/send-message-as-user?userId=${user_1.adminUsername}`))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: dmRoom._id,
                })
                    .expect(200)
                    .expect((res) => {
                    const response = JSON.parse(res.text);
                    (0, chai_1.expect)(response).to.have.a.property('messageId');
                    DMMessageId = response.messageId;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should be a valid message', () => __awaiter(void 0, void 0, void 0, function* () {
                const message = yield (0, chat_helper_1.getMessageById)({ msgId: DMMessageId });
                (0, chai_1.expect)(message.msg).to.be.equal('Executing send-message-as-user test endpoint');
            }));
        });
    });
});
