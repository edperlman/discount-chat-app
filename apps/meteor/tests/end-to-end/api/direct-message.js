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
const uploads_helper_1 = require("../../data/uploads.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Direct Messages]', () => {
    let testDM;
    let user;
    let directMessage;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        user = yield (0, users_helper_1.createUser)();
        const cred = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield (0, users_helper_1.setUserStatus)(cred);
        yield api_data_1.request
            .post((0, api_data_1.api)('im.create'))
            .set(api_data_1.credentials)
            .send({
            username: user.username,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            testDM = res.body.room;
        });
    }));
    (0, mocha_1.before)('/chat.postMessage', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('chat.postMessage'))
            .set(api_data_1.credentials)
            .send({
            roomId: testDM.rid,
            text: 'This message was sent using the API',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was sent using the API');
            (0, chai_1.expect)(res.body).to.have.nested.property('message.rid');
            directMessage = { _id: res.body.message.rid };
        })
            .end(done);
    });
    (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(user));
    (0, mocha_1.describe)('/im.setTopic', () => {
        (0, mocha_1.it)('should set the topic of the DM with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.setTopic'))
                .set(api_data_1.credentials)
                .send({
                roomId: directMessage._id,
                topic: `a direct message with ${user.username}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('topic', `a direct message with ${user.username}`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should set the topic of DM with an empty string(remove the topic)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.setTopic'))
                .set(api_data_1.credentials)
                .send({
                roomId: directMessage._id,
                topic: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('topic', '');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('Testing DM info', () => {
        let dmMessage;
        (0, mocha_1.it)('sending a message...', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid: testDM._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                dmMessage = res.body.message;
            })
                .end(done);
        });
        (0, mocha_1.it)('REACTing with last message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: dmMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('STARring last message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.starMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: dmMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('PINning last message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.pinMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: dmMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all DM messages where the last message of array should have the "star" array with USERS star ONLY', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testDM._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                var _a;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                const messages = res.body.messages;
                const lastMessage = messages.filter((message) => message._id === dmMessage._id)[0];
                (0, chai_1.expect)(lastMessage).to.have.property('starred').and.to.be.an('array');
                (0, chai_1.expect)((_a = lastMessage.starred) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(user_1.adminUsername);
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('/im.history', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('im.history'))
            .set(api_data_1.credentials)
            .query({
            roomId: directMessage._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('messages');
        })
            .end(done);
    });
    (0, mocha_1.it)('/im.list', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('im.list'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('count');
            (0, chai_1.expect)(res.body).to.have.property('total');
            (0, chai_1.expect)(res.body).to.have.property('ims').and.to.be.an('array');
            const im = res.body.ims.find((dm) => dm._id === testDM._id);
            (0, chai_1.expect)(im).to.have.property('_id');
            (0, chai_1.expect)(im).to.have.property('t').and.to.be.eq('d');
            (0, chai_1.expect)(im).to.have.property('msgs').and.to.be.a('number');
            (0, chai_1.expect)(im).to.have.property('usernames').and.to.be.an('array');
            (0, chai_1.expect)(im).to.have.property('lm');
            (0, chai_1.expect)(im).to.have.property('_updatedAt');
            (0, chai_1.expect)(im).to.have.property('ts');
            (0, chai_1.expect)(im).to.have.property('lastMessage');
        })
            .end(done);
    });
    (0, mocha_1.describe)('/im.list.everyone', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']);
        }));
        (0, mocha_1.it)('should succesfully return a list of direct messages', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.list.everyone'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total', 1);
                (0, chai_1.expect)(res.body).to.have.property('ims').and.to.be.an('array');
                const im = res.body.ims[0];
                (0, chai_1.expect)(im).to.have.property('_id');
                (0, chai_1.expect)(im).to.have.property('t').and.to.be.eq('d');
                (0, chai_1.expect)(im).to.have.property('msgs').and.to.be.a('number');
                (0, chai_1.expect)(im).to.have.property('usernames').and.to.be.an('array');
                (0, chai_1.expect)(im).to.have.property('ro');
                (0, chai_1.expect)(im).to.have.property('sysMes');
                (0, chai_1.expect)(im).to.have.property('_updatedAt');
                (0, chai_1.expect)(im).to.have.property('ts');
                (0, chai_1.expect)(im).to.have.property('lastMessage');
            });
        }));
        (0, mocha_1.it)('should fail if user does NOT have the view-room-administration permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-room-administration', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('im.list.everyone'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)("Setting: 'Use Real Name': true", () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', true); }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', false); }));
        (0, mocha_1.it)('/im.list', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('ims').and.to.be.an('array');
                const im = res.body.ims.find((dm) => dm._id === testDM._id);
                (0, chai_1.expect)(im).to.have.property('_id');
                (0, chai_1.expect)(im).to.have.property('t').and.to.be.eq('d');
                (0, chai_1.expect)(im).to.have.property('msgs').and.to.be.a('number');
                (0, chai_1.expect)(im).to.have.property('usernames').and.to.be.an('array');
                (0, chai_1.expect)(im).to.have.property('lm');
                (0, chai_1.expect)(im).to.have.property('_updatedAt');
                (0, chai_1.expect)(im).to.have.property('ts');
                (0, chai_1.expect)(im).to.have.property('lastMessage');
                const { lastMessage } = im;
                (0, chai_1.expect)(lastMessage).to.have.nested.property('u.name', 'RocketChat Internal Admin Test');
            })
                .end(done);
        });
        (0, mocha_1.it)('/im.list.everyone', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.list.everyone'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('ims').and.to.be.an('array');
                const im = res.body.ims.find((dm) => dm._id === testDM._id);
                (0, chai_1.expect)(im).to.have.property('_id');
                (0, chai_1.expect)(im).to.have.property('t').and.to.be.eq('d');
                (0, chai_1.expect)(im).to.have.property('msgs').and.to.be.a('number');
                (0, chai_1.expect)(im).to.have.property('usernames').and.to.be.an('array');
                (0, chai_1.expect)(im).to.have.property('ro');
                (0, chai_1.expect)(im).to.have.property('sysMes');
                (0, chai_1.expect)(im).to.have.property('_updatedAt');
                (0, chai_1.expect)(im).to.have.property('ts');
                (0, chai_1.expect)(im).to.have.property('lastMessage');
                const { lastMessage } = im;
                (0, chai_1.expect)(lastMessage).to.have.nested.property('u.name', 'RocketChat Internal Admin Test');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('/im.open', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('im.open'))
            .set(api_data_1.credentials)
            .send({
            roomId: directMessage._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.describe)('/im.counters', () => {
        (0, mocha_1.it)('should require auth', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.counters'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
            });
        }));
        (0, mocha_1.it)('should require a roomId', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.counters'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should work with all params right', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.counters'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('joined', true);
                (0, chai_1.expect)(res.body).to.have.property('members');
                (0, chai_1.expect)(res.body).to.have.property('unreads');
                (0, chai_1.expect)(res.body).to.have.property('unreadsFrom');
                (0, chai_1.expect)(res.body).to.have.property('msgs');
                (0, chai_1.expect)(res.body).to.have.property('latest');
                (0, chai_1.expect)(res.body).to.have.property('userMentions');
            })
                .end(done);
        });
        (0, mocha_1.describe)('with valid room id', () => {
            let testDM;
            let user2;
            let userCreds;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                user2 = yield (0, users_helper_1.createUser)();
                userCreds = yield (0, users_helper_1.login)(user2.username, user_1.password);
                yield api_data_1.request
                    .post((0, api_data_1.api)('im.create'))
                    .set(api_data_1.credentials)
                    .send({
                    username: user2.username,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    testDM = res.body.room;
                });
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        text: 'Sample message',
                        rid: testDM._id,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('im.delete'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testDM._id,
                })
                    .expect(200);
                yield (0, users_helper_1.deleteUser)(user2);
            }));
            (0, mocha_1.it)('should properly return counters before opening the dm', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('im.counters'))
                    .set(userCreds)
                    .query({
                    roomId: testDM._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('joined', true);
                    (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.a('number').and.to.be.eq(2);
                    (0, chai_1.expect)(res.body).to.have.property('unreads').and.to.be.a('number').and.to.be.eq(1);
                    (0, chai_1.expect)(res.body).to.have.property('unreadsFrom');
                    (0, chai_1.expect)(res.body).to.have.property('msgs').and.to.be.a('number').and.to.be.eq(1);
                    (0, chai_1.expect)(res.body).to.have.property('latest');
                    (0, chai_1.expect)(res.body).to.have.property('userMentions').and.to.be.a('number').and.to.be.eq(0);
                });
            }));
        });
    });
    (0, mocha_1.describe)('[/im.files]', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, uploads_helper_1.testFileUploads)('im.files', 'd', 'invalid-channel');
    }));
    (0, mocha_1.describe)('/im.messages', () => {
        let testUser;
        let testUserDMRoom;
        let testUserCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false, roles: ['admin'] });
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            yield (0, users_helper_1.setUserStatus)(testUserCredentials);
            testUserDMRoom = (yield api_data_1.request
                .post((0, api_data_1.api)('im.create'))
                .set(testUserCredentials)
                .send({ username: `${testUser.username}` })).body.room;
            const messages = [
                {
                    rid: testUserDMRoom._id,
                    msg: `@${user_1.adminUsername} youre being mentioned`,
                    mentions: [{ username: user_1.adminUsername, _id: user_1.adminUsername, name: user_1.adminUsername }],
                },
                {
                    rid: testUserDMRoom._id,
                    msg: `@${testUser.username} youre being mentioned`,
                    mentions: [{ username: testUser.username, _id: testUser._id, name: testUser.name }],
                },
                {
                    rid: testUserDMRoom._id,
                    msg: `A simple message`,
                },
                {
                    rid: testUserDMRoom._id,
                    msg: `A pinned simple message`,
                },
            ];
            const [, , starredMessage, pinnedMessage] = yield Promise.all(messages.map((message) => (0, chat_helper_1.sendMessage)({ message, requestCredentials: testUserCredentials })));
            yield Promise.all([
                (0, chat_helper_1.starMessage)({ messageId: starredMessage.body.message._id, requestCredentials: testUserCredentials }),
                (0, chat_helper_1.pinMessage)({ messageId: pinnedMessage.body.message._id, requestCredentials: testUserCredentials }),
            ]);
        }));
        (0, mocha_1.it)('should return all DM messages that were sent to yourself using your username', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(testUserCredentials)
                .query({
                username: testUser.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying to access a DM that does not belong to the current user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(api_data_1.credentials)
                .query({ roomId: testUserDMRoom._id })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'unauthorized');
            });
        }));
        (0, mocha_1.it)('should return messages that mention a single user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(testUserCredentials)
                .query({
                roomId: testUserDMRoom._id,
                mentionIds: user_1.adminUsername,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('mentions').that.is.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0].mentions[0]).to.have.property('_id', user_1.adminUsername);
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total', 1);
            });
        }));
        (0, mocha_1.it)('should return messages that mention multiple users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(testUserCredentials)
                .query({
                roomId: testUserDMRoom._id,
                mentionIds: `${user_1.adminUsername},${testUser._id}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(2);
                (0, chai_1.expect)(res.body).to.have.property('count', 2);
                (0, chai_1.expect)(res.body).to.have.property('total', 2);
                const mentionIds = res.body.messages.map((message) => message.mentions[0]._id);
                (0, chai_1.expect)(mentionIds).to.include.members([user_1.adminUsername, testUser._id]);
            });
        }));
        (0, mocha_1.it)('should return messages that are starred by a specific user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(testUserCredentials)
                .query({
                roomId: testUserDMRoom._id,
                starredIds: testUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('starred').that.is.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total', 1);
            });
        }));
        (0, mocha_1.it)('should return messages that are pinned', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages'))
                .set(testUserCredentials)
                .query({
                roomId: testUserDMRoom._id,
                pinned: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('pinned').that.is.an('boolean').and.to.be.true;
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('pinnedBy').that.is.an('object');
                (0, chai_1.expect)(res.body.messages[0].pinnedBy).to.have.property('_id', testUser._id);
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total', 1);
            });
        }));
    });
    (0, mocha_1.describe)('/im.messages.others', () => {
        (0, mocha_1.it)('should fail when the endpoint is disabled and the user has permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_Enable_Direct_Message_History_EndPoint', false);
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages.others'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-endpoint-disabled');
            });
        }));
        (0, mocha_1.it)('should fail when the endpoint is disabled and the user doesnt have permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_Enable_Direct_Message_History_EndPoint', false);
            yield (0, permissions_helper_1.updatePermission)('view-room-administration', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages.others'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should fail when the endpoint is enabled but the user doesnt have permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_Enable_Direct_Message_History_EndPoint', true);
            yield (0, permissions_helper_1.updatePermission)('view-room-administration', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages.others'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should succeed when the endpoint is enabled and user has permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_Enable_Direct_Message_History_EndPoint', true);
            yield (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('im.messages.others'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
    });
    (0, mocha_1.it)('/im.close', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('im.close'))
            .set(api_data_1.credentials)
            .send({
            roomId: directMessage._id,
            userId: user._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.describe)('fname property', () => {
        const username = `fname_${api_data_1.apiUsername}`;
        const name = `Name fname_${api_data_1.apiUsername}`;
        const updatedName = `Updated Name fname_${api_data_1.apiUsername}`;
        const email = `fname_${api_data_1.apiEmail}`;
        let userId;
        let directMessageId;
        let user;
        (0, mocha_1.before)((done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.create'))
                .set(api_data_1.credentials)
                .send({
                email,
                name,
                username,
                password: user_1.password,
                active: true,
                roles: ['user'],
                joinDefaultChannels: true,
                verified: true,
            })
                .expect((res) => {
                user = res.body.user;
                userId = res.body.user._id;
            })
                .end(done);
        });
        (0, mocha_1.before)((done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.postMessage'))
                .set(api_data_1.credentials)
                .send({
                channel: `@${username}`,
                text: 'This message was sent using the API',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('message.msg', 'This message was sent using the API');
                (0, chai_1.expect)(res.body).to.have.nested.property('message.rid');
                directMessageId = res.body.message.rid;
            })
                .end(done);
        });
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, users_helper_1.deleteUser)(user); }));
        (0, mocha_1.it)('should have fname property', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessageId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.subscription).to.have.property('name', username);
                (0, chai_1.expect)(res.body.subscription).to.have.property('fname', name);
            })
                .end(done);
        });
        (0, mocha_1.it)("should update user's name", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId,
                data: {
                    name: updatedName,
                },
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body.user).to.have.property('name', updatedName);
            })
                .end(done);
        });
        (0, mocha_1.it)('should have fname property updated', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessageId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.subscription).to.have.property('name', username);
                (0, chai_1.expect)(res.body.subscription).to.have.property('fname', updatedName);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/im.members', () => {
        (0, mocha_1.it)('should return and array with two members', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: directMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.equal(2);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.be.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.be.equal(2);
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.have.lengthOf(2);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return and array with one member', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.members'))
                .set(api_data_1.credentials)
                .query({
                username: user.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.equal(2);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.be.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.be.equal(2);
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.have.lengthOf(2);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return and array with one member queried by status', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('im.members'))
                .set(api_data_1.credentials)
                .query({
                'roomId': directMessage._id,
                'status[]': ['online'],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.be.equal(1);
                (0, chai_1.expect)(res.body).to.have.property('offset').and.to.be.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.be.equal(1);
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.have.lengthOf(1);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/im.create', () => {
        let user;
        let userCredentials;
        let otherUser;
        let otherUserCredentials;
        let thirdUser;
        let thirdUserCredentials;
        let roomIds = {};
        // Names have to be in alfabetical order so we can test the room's fullname
        const userFullName = 'User A';
        const otherUserFullName = 'User B';
        const thirdUserFullName = 'User C';
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)({ name: userFullName });
            otherUser = yield (0, users_helper_1.createUser)({ name: otherUserFullName });
            thirdUser = yield (0, users_helper_1.createUser)({ name: thirdUserFullName });
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            otherUserCredentials = yield (0, users_helper_1.login)(otherUser.username, user_1.password);
            thirdUserCredentials = yield (0, users_helper_1.login)(thirdUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all(Object.values(roomIds).map((roomId) => (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId })));
            yield (0, users_helper_1.deleteUser)(user);
            yield (0, users_helper_1.deleteUser)(otherUser);
            yield (0, users_helper_1.deleteUser)(thirdUser);
        }));
        (0, mocha_1.it)('creates a DM between two other parties (including self)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.create'))
                .set(userCredentials)
                .send({
                usernames: [otherUser.username, thirdUser.username].join(','),
            })
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('usernames').and.to.have.members([thirdUser.username, user.username, otherUser.username]);
                roomIds = Object.assign(Object.assign({}, roomIds), { multipleDm: res.body.room._id });
            })
                .end(done);
        });
        (0, mocha_1.it)('creates a DM between two other parties (excluding self)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.create'))
                .set(api_data_1.credentials)
                .send({
                usernames: [user.username, otherUser.username].join(','),
                excludeSelf: true,
            })
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('usernames').and.to.have.members([user.username, otherUser.username]);
                roomIds = Object.assign(Object.assign({}, roomIds), { dm: res.body.room._id });
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a self-DM', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.create'))
                .set(userCredentials)
                .send({
                username: user.username,
            })
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                (0, chai_1.expect)(res.body.room).to.have.property('usernames').and.to.have.members([user.username]);
                roomIds = Object.assign(Object.assign({}, roomIds), { self: res.body.room._id });
            })
                .end(done);
        });
        (0, mocha_1.describe)('should create dm with correct notification preferences', () => {
            let user;
            let userCredentials;
            let userPrefRoomId;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)();
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                if (userPrefRoomId) {
                    yield (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: userPrefRoomId });
                }
                yield (0, users_helper_1.deleteUser)(user);
            }));
            (0, mocha_1.it)('should save user preferences', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.methodCall)('saveUserPreferences'))
                    .set(userCredentials)
                    .send({
                    message: JSON.stringify({
                        id: 'id',
                        msg: 'method',
                        method: 'saveUserPreferences',
                        params: [{ emailNotificationMode: 'nothing' }],
                    }),
                })
                    .expect(200);
            }));
            (0, mocha_1.it)('should create a DM', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('im.create'))
                    .set(userCredentials)
                    .send({
                    usernames: [user.username, otherUser.username].join(','),
                })
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('room').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.room).to.have.property('usernames').and.to.have.members([user.username, otherUser.username]);
                    userPrefRoomId = res.body.room._id;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return the right user notification preferences in the dm', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(userCredentials)
                    .query({
                    roomId: userPrefRoomId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
                    (0, chai_1.expect)(res.body).to.have.nested.property('subscription.emailNotifications').and.to.be.equal('nothing');
                })
                    .end(done);
            });
        });
        function testRoomFNameForUser(testCredentials, roomId, fullName) {
            return __awaiter(this, void 0, void 0, function* () {
                return api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(testCredentials)
                    .query({ roomId })
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.subscription).to.have.property('fname', fullName);
                });
            });
        }
        (0, mocha_1.describe)('Rooms fullName', () => {
            (0, mocha_1.it)("should be own user's name for self DM", () => __awaiter(void 0, void 0, void 0, function* () {
                yield testRoomFNameForUser(userCredentials, roomIds.self, userFullName);
            }));
            (0, mocha_1.it)("should be other user's name concatenated for multiple users's DM for every user", () => __awaiter(void 0, void 0, void 0, function* () {
                yield testRoomFNameForUser(userCredentials, roomIds.multipleDm, [otherUserFullName, thirdUserFullName].join(', '));
                yield testRoomFNameForUser(otherUserCredentials, roomIds.multipleDm, [userFullName, thirdUserFullName].join(', '));
                yield testRoomFNameForUser(thirdUserCredentials, roomIds.multipleDm, [userFullName, otherUserFullName].join(', '));
            }));
            (0, mocha_1.it)("should be other user's name for DM for both users", () => __awaiter(void 0, void 0, void 0, function* () {
                yield testRoomFNameForUser(userCredentials, roomIds.dm, otherUserFullName);
                yield testRoomFNameForUser(otherUserCredentials, roomIds.dm, userFullName);
            }));
        });
    });
    (0, mocha_1.describe)('/im.delete', () => {
        let testDM;
        (0, mocha_1.it)('/im.create', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.create'))
                .set(api_data_1.credentials)
                .send({
                username: user.username,
            })
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                testDM = res.body.room;
            })
                .end(done);
        });
        (0, mocha_1.it)('/im.delete', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.delete'))
                .set(api_data_1.credentials)
                .send({
                username: user.username,
            })
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('/im.open', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('im.open'))
                .set(api_data_1.credentials)
                .send({
                roomId: testDM._id,
            })
                .expect(403)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'unauthorized');
            })
                .end(done);
        });
        (0, mocha_1.describe)('when authenticated as a non-admin user', () => {
            let otherUser;
            let otherCredentials;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                otherUser = yield (0, users_helper_1.createUser)();
                otherCredentials = yield (0, users_helper_1.login)(otherUser.username, user_1.password);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, users_helper_1.deleteUser)(otherUser);
            }));
            (0, mocha_1.it)('/im.create', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('im.create'))
                    .set(api_data_1.credentials)
                    .send({
                    username: otherUser.username,
                })
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    testDM = res.body.room;
                })
                    .end(done);
            });
            (0, mocha_1.it)('/im.delete', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('im.delete'))
                    .set(otherCredentials)
                    .send({
                    roomId: testDM._id,
                })
                    .expect(400)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                })
                    .end(done);
            });
        });
    });
});
