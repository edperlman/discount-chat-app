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
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const chat_helper_1 = require("../../data/chat.helper");
const constants_1 = require("../../data/constants");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const constants_2 = require("../../e2e/config/constants");
(0, mocha_1.describe)('Meteor.methods', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[@getThreadMessages]', () => {
        let rid;
        let firstMessage;
        let channelName;
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                firstMessage = res.body.message;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message into thread', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Second Sample message',
                    rid,
                    tmid: firstMessage._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getThreadMessages'))
                .send({
                message: JSON.stringify({
                    method: 'getThreadMessages',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return message thread', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getThreadMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getThreadMessages',
                    params: [{ tmid: firstMessage._id }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                (0, chai_1.expect)(data.result.length).to.equal(2);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@getReadReceipts]', () => {
        (0, mocha_1.it)('should fail if not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('getReadReceipts'))
                .send({
                message: JSON.stringify({
                    method: 'getReadReceipts',
                    params: [{ messageId: 'test' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message', 'You must be logged in to do this.');
            });
        }));
        (!constants_2.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[@getReadReceipts] CE', () => {
            (0, mocha_1.it)('should fail if there is no enterprise license', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.methodCall)('getReadReceipts'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'getReadReceipts',
                        params: [{ messageId: 'test' }],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    const data = JSON.parse(res.body.message);
                    (0, chai_1.expect)(data).to.have.property('error').that.is.an('object');
                    (0, chai_1.expect)(data.error).to.have.property('error', 'error-action-not-allowed');
                    (0, chai_1.expect)(data.error).to.have.property('message', 'This is an enterprise feature [error-action-not-allowed]');
                });
            }));
        });
        (constants_2.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[@getReadReceipts] EE', () => {
            let user;
            let userCredentials;
            let room;
            let firstMessage;
            let firstThreadMessage;
            const roomName = `methods-test-channel-${Date.now()}`;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([(0, permissions_helper_1.updateSetting)('Message_Read_Receipt_Enabled', true), (0, permissions_helper_1.updateSetting)('Message_Read_Receipt_Store_Users', true)]);
                user = yield (0, users_helper_1.createUser)();
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
                room = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: roomName, members: [user.username] })).body.group;
                firstMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: room._id })).body.message;
                firstThreadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: room._id, tmid: firstMessage._id })).body.message;
            }));
            (0, mocha_1.after)(() => Promise.all([
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: room._id }),
                (0, users_helper_1.deleteUser)(user),
                (0, permissions_helper_1.updateSetting)('Message_Read_Receipt_Enabled', false),
                (0, permissions_helper_1.updateSetting)('Message_Read_Receipt_Store_Users', false),
            ]));
            (0, mocha_1.describe)('simple message and thread that nobody has read yet', () => {
                (0, mocha_1.it)("should return only the sender's read receipt for a message sent in the main room", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: firstMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(1);
                        (0, chai_1.expect)(data.result[0]).to.have.property('userId', api_data_1.credentials['X-User-Id']);
                    });
                }));
                (0, mocha_1.it)("should return only the sender's read receipt for a message sent in a thread", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: firstThreadMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(1);
                        (0, chai_1.expect)(data.result[0]).to.have.property('userId', api_data_1.credentials['X-User-Id']);
                    });
                }));
            });
            (0, mocha_1.describe)('simple message and thread where the room message was read by the invited user but the thread message was not', () => {
                (0, mocha_1.before)("should read all main room's messages with the invited user", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('readMessages'))
                        .set(userCredentials)
                        .send({
                        message: JSON.stringify({
                            id: 'id',
                            msg: 'method',
                            method: 'readMessages',
                            params: [room._id, true],
                        }),
                    });
                }));
                (0, mocha_1.it)("should return both the sender's and the invited user's read receipt for a message sent in the main room", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: firstMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(2);
                        const receiptsUserIds = [data.result[0].userId, data.result[1].userId];
                        (0, chai_1.expect)(receiptsUserIds).to.have.members([api_data_1.credentials['X-User-Id'], user._id]);
                    });
                }));
                (0, mocha_1.it)("should return only the sender's read receipt for a message sent in a thread", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: firstThreadMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(1);
                        (0, chai_1.expect)(data.result[0]).to.have.property('userId', api_data_1.credentials['X-User-Id']);
                    });
                }));
            });
            (0, mocha_1.describe)('simple message and thread where both was read by the invited user', () => {
                (0, mocha_1.before)('should read thread messages with the invited user', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getThreadMessages'))
                        .set(userCredentials)
                        .send({
                        message: JSON.stringify({
                            id: 'id',
                            msg: 'method',
                            method: 'getThreadMessages',
                            params: [
                                {
                                    tmid: firstMessage._id,
                                },
                            ],
                        }),
                    });
                }));
                (0, mocha_1.it)("should return both the sender's and invited user's read receipt for a message sent in a thread", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: firstThreadMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(2);
                        const receiptsUserIds = [data.result[0].userId, data.result[1].userId];
                        (0, chai_1.expect)(receiptsUserIds).to.have.members([api_data_1.credentials['X-User-Id'], user._id]);
                    });
                }));
            });
            (0, mocha_1.describe)('simple message and thread marked as read by the invited user', () => {
                let otherMessage;
                let otherThreadMessage;
                (0, mocha_1.before)('should send another message and create a thread', () => __awaiter(void 0, void 0, void 0, function* () {
                    otherMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: room._id })).body.message;
                    otherThreadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({ roomId: room._id, tmid: otherMessage._id })).body.message;
                }));
                (0, mocha_1.before)('should mark the thread as read by the invited user', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('readThreads'))
                        .set(userCredentials)
                        .send({
                        message: JSON.stringify({
                            method: 'readThreads',
                            params: [otherMessage._id],
                            id: 'id',
                            msg: 'method',
                        }),
                    });
                }));
                (0, mocha_1.it)("should return both the sender's and invited user's read receipt for a message sent in the main room", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: otherThreadMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(2);
                        const receiptsUserIds = [data.result[0].userId, data.result[1].userId];
                        (0, chai_1.expect)(receiptsUserIds).to.have.members([api_data_1.credentials['X-User-Id'], user._id]);
                    });
                }));
                (0, mocha_1.it)("should return both the sender's and invited user's read receipt for a message sent in a thread", () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('getReadReceipts'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'getReadReceipts',
                            params: [{ messageId: otherThreadMessage._id }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                        (0, chai_1.expect)(data.result.length).to.equal(2);
                        const receiptsUserIds = [data.result[0].userId, data.result[1].userId];
                        (0, chai_1.expect)(receiptsUserIds).to.have.members([api_data_1.credentials['X-User-Id'], user._id]);
                    });
                }));
            });
        });
    });
    (0, mocha_1.describe)('[@getMessages]', () => {
        let rid;
        let firstMessage;
        let lastMessage;
        let channelName;
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                firstMessage = res.body.message;
            })
                .end(done);
        });
        (0, mocha_1.before)('send another sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Second Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                lastMessage = res.body.message;
            })
                .end(done);
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getMessages'))
                .send({
                message: JSON.stringify({
                    method: 'getMessages',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if msgIds not specified', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getMessages',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.a.property('sanitizedError');
                (0, chai_1.expect)(data.error.sanitizedError).to.have.property('error', 400);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the first message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getMessages',
                    params: [[firstMessage._id]],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                (0, chai_1.expect)(data.result.length).to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return both messages', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getMessages',
                    params: [[firstMessage._id, lastMessage._id]],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                (0, chai_1.expect)(data.result.length).to.equal(2);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@cleanRoomHistory]', () => {
        let rid;
        let testUser;
        let testUserCredentials;
        let channelName;
        (0, mocha_1.before)('update permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('clean-channel-history', ['admin', 'user']);
        }));
        (0, mocha_1.before)('create test user', () => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.before)('send another sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Second Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }), (0, users_helper_1.deleteUser)(testUser), (0, permissions_helper_1.updatePermission)('clean-channel-history', ['admin'])]));
        (0, mocha_1.it)('should throw an error if user is not part of the room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('cleanRoomHistory'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'cleanRoomHistory',
                    params: [
                        {
                            roomId: rid,
                            oldest: { $date: new Date().getTime() },
                            latest: { $date: new Date().getTime() },
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.a.property('error', 'error-not-allowed');
            });
        }));
        (0, mocha_1.it)('should not change the _updatedAt value when nothing is changed on the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomBefore = yield api_data_1.request.get((0, api_data_1.api)('groups.info')).set(api_data_1.credentials).query({
                roomId: rid,
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: rid,
                latest: '2016-12-09T13:42:25.304Z',
                oldest: '2016-08-30T13:42:25.304Z',
                excludePinned: false,
                filesOnly: false,
                ignoreThreads: false,
                ignoreDiscussion: false,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('count', 0);
            });
            const roomAfter = yield api_data_1.request.get((0, api_data_1.api)('groups.info')).set(api_data_1.credentials).query({
                roomId: rid,
            });
            (0, chai_1.expect)(roomBefore.body.group._updatedAt).to.be.equal(roomAfter.body.group._updatedAt);
        }));
        (0, mocha_1.it)('should change the _updatedAt value when room is cleaned', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomBefore = yield api_data_1.request.get((0, api_data_1.api)('groups.info')).set(api_data_1.credentials).query({
                roomId: rid,
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('rooms.cleanHistory'))
                .set(api_data_1.credentials)
                .send({
                roomId: rid,
                latest: '9999-12-31T23:59:59.000Z',
                oldest: '0001-01-01T00:00:00.000Z',
                excludePinned: false,
                filesOnly: false,
                ignoreThreads: false,
                ignoreDiscussion: false,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('count', 2);
            });
            const roomAfter = yield api_data_1.request.get((0, api_data_1.api)('groups.info')).set(api_data_1.credentials).query({
                roomId: rid,
            });
            (0, chai_1.expect)(roomBefore.body.group._updatedAt).to.not.be.equal(roomAfter.body.group._updatedAt);
        }));
    });
    (0, mocha_1.describe)('[@loadHistory]', () => {
        let rid;
        let postMessageDate;
        let lastMessage;
        let channelName;
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                postMessageDate = { $date: new Date().getTime() };
            })
                .end(done);
        });
        (0, mocha_1.before)('send another sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Second Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                lastMessage = res.body.message;
            })
                .end(done);
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadHistory'))
                .send({
                message: JSON.stringify({
                    method: 'loadHistory',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if roomId not specified', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadHistory'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadHistory',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.a.property('sanitizedError');
                (0, chai_1.expect)(data.error.sanitizedError).to.have.property('error', 400);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all messages for the specified room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadHistory'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    id: 'id',
                    msg: 'method',
                    method: 'loadHistory',
                    params: [rid],
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(2);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return only the first message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadHistory'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadHistory',
                    params: [rid, postMessageDate],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return only one message when limit = 1', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadHistory'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadHistory',
                    params: [rid, { $date: new Date().getTime() }, 1],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the messages since the last one', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadHistory'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadHistory',
                    params: [rid, null, 20, lastMessage],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(2);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@loadNextMessages]', () => {
        let rid;
        let postMessageDate;
        const startDate = { $date: new Date().getTime() };
        let channelName;
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                postMessageDate = { $date: new Date().getTime() };
            })
                .end(done);
        });
        (0, mocha_1.before)('send another sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Second Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadNextMessages'))
                .send({
                message: JSON.stringify({
                    method: 'loadNextMessages',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if roomId not specified', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadNextMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadNextMessages',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.a.property('sanitizedError');
                (0, chai_1.expect)(data.error.sanitizedError).to.have.property('error', 400);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all messages for the specified room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadNextMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadNextMessages',
                    params: [rid],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(2);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return only the latest message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadNextMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadNextMessages',
                    params: [rid, postMessageDate],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return only one message when limit = 1', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadNextMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadNextMessages',
                    params: [rid, startDate, 1],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('messages').that.is.an('array');
                (0, chai_1.expect)(data.result.messages.length).to.equal(1);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@getUsersOfRoom]', () => {
        let testUser;
        let rid;
        let channelName;
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('create test user', (done) => {
            const username = `user.test.${Date.now()}`;
            const email = `${username}@rocket.chat`;
            void api_data_1.request
                .post((0, api_data_1.api)('users.create'))
                .set(api_data_1.credentials)
                .send({ email, name: username, username, password: username })
                .end((_err, res) => {
                testUser = res.body.user;
                done();
            });
        });
        (0, mocha_1.before)('add user to room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: rid,
                userId: testUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .end(done);
        });
        (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }), (0, users_helper_1.deleteUser)(testUser)]));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getUsersOfRoom'))
                .send({
                message: JSON.stringify({
                    method: 'getUsersOfRoom',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if roomId not specified', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getUsersOfRoom'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getUsersOfRoom',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error).to.have.a.property('error', 'error-invalid-room');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the users for the specified room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getUsersOfRoom'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getUsersOfRoom',
                    params: [rid],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('total', 2);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@getUserRoles]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getUserRoles'))
                .send({
                message: JSON.stringify({
                    method: 'getUserRoles',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the roles for the current user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getUserRoles'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getUserRoles',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@listCustomUserStatus]', () => {
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('listCustomUserStatus'))
                .send({
                message: JSON.stringify({
                    method: 'listCustomUserStatus',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return custom status for the current user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('listCustomUserStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'listCustomUserStatus',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@permissions:get]', () => {
        const date = {
            $date: new Date().getTime(),
        };
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('permissions:get'))
                .send({
                message: JSON.stringify({
                    method: 'permissions/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all permissions', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('permissions:get'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'permissions/get',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                (0, chai_1.expect)(data.result.length).to.be.above(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all permissions after the given date', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('permissions:get'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'permissions/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('update').that.is.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@loadMissedMessages]', () => {
        let rid;
        const date = {
            $date: new Date().getTime(),
        };
        let postMessageDate;
        const channelName = `methods-test-channel-${Date.now()}`;
        (0, mocha_1.before)('create test group', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                postMessageDate = { $date: new Date().getTime() };
            })
                .end(done);
        });
        (0, mocha_1.before)('send another sample message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Second Sample message',
                    rid,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadMissedMessages'))
                .send({
                message: JSON.stringify({
                    method: 'loadMissedMessages',
                    params: [rid, date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error if the rid param is empty', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadMissedMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadMissedMessages',
                    params: ['', date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.include('error-invalid-room');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error if the start param is missing', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadMissedMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadMissedMessages',
                    params: [rid],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.include('Match error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return and empty list if using current time', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadMissedMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadMissedMessages',
                    params: [rid, { $date: new Date().getTime() }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.a('array');
                (0, chai_1.expect)(data.result.length).to.be.equal(0);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return two messages if using a time from before the first msg was sent', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadMissedMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadMissedMessages',
                    params: [rid, date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.a('array');
                (0, chai_1.expect)(data.result.length).to.be.equal(2);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a single message if using a time from in between the messages', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('loadMissedMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'loadMissedMessages',
                    params: [rid, postMessageDate],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.a('array');
                (0, chai_1.expect)(data.result.length).to.be.equal(1);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@public-settings:get]', () => {
        const date = {
            $date: new Date().getTime(),
        };
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('public-settings:get'))
                .send({
                message: JSON.stringify({
                    method: 'public-settings/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the list of public settings', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('public-settings:get'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'public-settings/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@private-settings:get]', () => {
        const date = {
            $date: 0,
        };
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updatePermission)('view-privileged-setting', ['admin']),
            (0, permissions_helper_1.updatePermission)('edit-privileged-setting', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-selected-settings', ['admin']),
        ]));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('private-settings:get'))
                .send({
                message: JSON.stringify({
                    method: 'private-settings/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return nothing when user doesnt have any permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-privileged-setting', [])
                .then(() => (0, permissions_helper_1.updatePermission)('edit-privileged-setting', []))
                .then(() => (0, permissions_helper_1.updatePermission)('manage-selected-settings', []))
                .then(() => {
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('private-settings:get'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'private-settings/get',
                        params: [date],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                    const data = JSON.parse(res.body.message);
                    (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                    (0, chai_1.expect)(data.result.length).to.be.equal(0);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return properties when user has any related permissions', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-privileged-setting', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('private-settings:get'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'private-settings/get',
                        params: [date],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                    const data = JSON.parse(res.body.message);
                    (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                    (0, chai_1.expect)(data.result).to.have.a.property('update').that.is.an('array');
                    (0, chai_1.expect)(data.result.update.length).to.not.equal(0);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return properties when user has all related permissions', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-privileged-setting', ['admin'])
                .then(() => (0, permissions_helper_1.updatePermission)('edit-privileged-setting', ['admin']))
                .then(() => (0, permissions_helper_1.updatePermission)('manage-selected-settings', ['admin']))
                .then(() => {
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('private-settings:get'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'private-settings/get',
                        params: [date],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                    const data = JSON.parse(res.body.message);
                    (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                    (0, chai_1.expect)(data.result).to.have.a.property('update').that.is.an('array');
                    (0, chai_1.expect)(data.result.update.length).to.not.equal(0);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[@subscriptions:get]', () => {
        const date = {
            $date: new Date().getTime(),
        };
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('subscriptions:get'))
                .send({
                message: JSON.stringify({
                    method: 'subscriptions/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all subscriptions', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('subscriptions:get'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'subscriptions/get',
                    params: [],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                (0, chai_1.expect)(data.result.length).to.be.above(1);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all subscriptions after the given date', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('subscriptions:get'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'subscriptions/get',
                    params: [date],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('update').that.is.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@sendMessage]', () => {
        let rid;
        let channelName;
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
            })
                .end(done);
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }));
        (0, mocha_1.it)('should send a message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'sendMessage',
                    params: [{ _id: `${Date.now() + Math.random()}`, rid, msg: 'test message' }],
                    id: 1000,
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result.msg).to.equal('test message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should parse correctly urls sent in message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'sendMessage',
                    params: [
                        {
                            _id: `${Date.now() + Math.random()}`,
                            rid,
                            msg: 'test message with https://github.com',
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('urls').that.is.an('array');
                (0, chai_1.expect)(data.result.urls[0].url).to.equal('https://github.com');
            })
                .end(done);
        });
        (0, mocha_1.it)('should not send message if it is a system message', () => __awaiter(void 0, void 0, void 0, function* () {
            const msgId = random_1.Random.id();
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'sendMessage',
                    params: [
                        {
                            _id: msgId,
                            rid: 'GENERAL',
                            msg: 'xss',
                            t: 'subscription-role-added',
                            role: '<h1>XSS<iframe srcdoc=\'<script src="/file-upload/664b3f90c4d3e60470c5e34a/js.js"></script>\'></iframe>',
                        },
                    ],
                    id: 1000,
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.not.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .set(api_data_1.credentials)
                .query({ msgId })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should return an error if request includes unallowed parameters', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'sendMessage',
                    params: [{ _id: `${Date.now() + Math.random()}`, rid, msg: 'test message', _notAllowed: '1' }],
                    id: 1000,
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                (0, chai_1.expect)(data.error.sanitizedError).to.have.a.property('reason', 'Match failed');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[@updateMessage]', () => {
        let rid;
        let roomName;
        let messageId;
        let simpleMessageId;
        let messageWithMarkdownId;
        let channelName;
        const siteUrl = process.env.SITE_URL || process.env.TEST_API_URL || 'http://localhost:3000';
        let testUser;
        let testUserCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.before)('create room', (done) => {
            channelName = `methods-test-channel-${Date.now()}`;
            void api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: channelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', channelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                rid = res.body.group._id;
                roomName = res.body.group.name;
            })
                .end(done);
        });
        (0, mocha_1.before)('send simple message', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, chat_helper_1.sendSimpleMessage)({ roomId: rid });
            simpleMessageId = res.body.message._id;
        }));
        (0, mocha_1.before)('send message with URL', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'sendMessage',
                    params: [
                        {
                            _id: `${Date.now() + Math.random()}`,
                            rid,
                            msg: 'test message with https://github.com',
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                (0, chai_1.expect)(data.result).to.have.a.property('urls').that.is.an('array');
                (0, chai_1.expect)(data.result.urls[0].url).to.equal('https://github.com');
                messageId = data.result._id;
            })
                .end(done);
        });
        (0, mocha_1.before)('send message with URL inside markdown', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'sendMessage',
                    params: [
                        {
                            _id: `${Date.now() + Math.random()}`,
                            rid,
                            msg: 'test message with ```https://github.com```',
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('object');
                messageWithMarkdownId = data.result._id;
            })
                .end(done);
        });
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: rid }),
            (0, users_helper_1.deleteUser)(testUser),
            (0, permissions_helper_1.updatePermission)('bypass-time-limit-edit-and-delete', ['bot', 'app']),
            (0, permissions_helper_1.updateSetting)('Message_AllowEditing_BlockEditInMinutes', 0),
        ]));
        (0, mocha_1.it)('should update a message with a URL', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: 'https://github.com updated' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('msg').that.is.an('string');
            });
        }));
        (0, mocha_1.it)('should fail if user does not have permissions to update a message with the same content', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: 'test message with https://github.com' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('msg').that.is.an('string');
                (0, chai_1.expect)(data.error).to.have.a.property('error', 'error-action-not-allowed');
            });
        }));
        (0, mocha_1.it)('should fail if user does not have permissions to update a message with different content', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: 'updating test message with https://github.com' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('msg').that.is.an('string');
                (0, chai_1.expect)(data.error).to.have.a.property('error', 'error-action-not-allowed');
            });
        }));
        (0, mocha_1.it)('should add a quote attachment to a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const quotedMsgLink = `${siteUrl}/group/${roomName}?msg=${messageWithMarkdownId}`;
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: `${quotedMsgLink} updated` }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .query({ msgId: messageId })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.an('object');
                (0, chai_1.expect)(res.body.message).to.have.property('msg', `${quotedMsgLink} updated`);
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('message_link', quotedMsgLink);
            });
        }));
        (0, mocha_1.it)('should replace a quote attachment in a message', () => __awaiter(void 0, void 0, void 0, function* () {
            const quotedMsgLink = `${siteUrl}/group/${roomName}?msg=${simpleMessageId}`;
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: `${quotedMsgLink} updated` }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .query({ msgId: messageId })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.an('object');
                (0, chai_1.expect)(res.body.message).to.have.property('msg', `${quotedMsgLink} updated`);
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(1);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('message_link', quotedMsgLink);
            });
        }));
        (0, mocha_1.it)('should add multiple quote attachments in a single message', () => __awaiter(void 0, void 0, void 0, function* () {
            const quotedMsgLink = `${siteUrl}/group/${roomName}?msg=${simpleMessageId}`;
            const newQuotedMsgLink = `${siteUrl}/group/${roomName}?msg=${messageWithMarkdownId}`;
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: `${newQuotedMsgLink} ${quotedMsgLink} updated` }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .query({ msgId: messageId })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.an('object');
                (0, chai_1.expect)(res.body.message).to.have.property('msg', `${newQuotedMsgLink} ${quotedMsgLink} updated`);
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(2);
                (0, chai_1.expect)(res.body.message.attachments[0]).to.have.property('message_link', newQuotedMsgLink);
                (0, chai_1.expect)(res.body.message.attachments[1]).to.have.property('message_link', quotedMsgLink);
            });
        }));
        (0, mocha_1.it)('should remove a quote attachment from a message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: 'updated' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .query({ msgId: messageId })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.an('object');
                (0, chai_1.expect)(res.body.message).to.have.property('msg', 'updated');
                (0, chai_1.expect)(res.body.message).to.have.property('attachments').that.is.an('array').that.has.lengthOf(0);
            });
        }));
        (0, mocha_1.it)('should update a message when bypass time limits permission is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('bypass-time-limit-edit-and-delete', ['admin']),
                (0, permissions_helper_1.updateSetting)('Message_AllowEditing_BlockEditInMinutes', 0.01),
            ]);
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [{ _id: messageId, rid, msg: 'https://github.com updated with bypass' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('chat.getMessage'))
                .query({ msgId: messageId })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message').that.is.an('object');
                (0, chai_1.expect)(res.body.message.msg).to.equal('https://github.com updated with bypass');
            });
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('bypass-time-limit-edit-and-delete', ['bot', 'app']),
                (0, permissions_helper_1.updateSetting)('Message_AllowEditing_BlockEditInMinutes', 0),
            ]);
        }));
        (0, mocha_1.it)('should not parse URLs inside markdown on update', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('updateMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateMessage',
                    params: [
                        {
                            _id: messageWithMarkdownId,
                            rid,
                            msg: 'test message with ```https://github.com``` updated',
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('msg').that.is.an('string');
            })
                .then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('chat.getMessage'))
                    .query({ msgId: messageWithMarkdownId })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('message').that.is.an('object');
                    (0, chai_1.expect)(res.body.message.msg).to.equal('test message with ```https://github.com``` updated');
                    (0, chai_1.expect)(res.body.message).to.have.property('urls');
                    (0, chai_1.expect)(res.body.message.urls.length).to.be.equal(0);
                })
                    .end(done);
            });
        });
        ['tshow', 'alias', 'attachments', 'avatar', 'emoji', 'msg'].forEach((prop) => {
            (0, mocha_1.it)(`should allow to update a message changing property '${prop}'`, (done) => {
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('updateMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'updateMessage',
                        params: [{ _id: messageId, rid, msg: 'Message updated', [prop]: 'valid' }],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                    const data = JSON.parse(res.body.message);
                    (0, chai_1.expect)(data).to.have.a.property('msg').that.is.a('string');
                })
                    .end(done);
            });
        });
        ['tmid', '_hidden', 'rid'].forEach((prop) => {
            (0, mocha_1.it)(`should fail to update a message changing invalid property '${prop}'`, (done) => {
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('updateMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'updateMessage',
                        params: [{ _id: messageId, rid, msg: 'Message updated invalid', [prop]: 'invalid' }],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                    const data = JSON.parse(res.body.message);
                    (0, chai_1.expect)(data).to.have.a.property('error').that.is.an('object');
                    (0, chai_1.expect)(data.error).to.have.a.property('error', 'error-invalid-update-key');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[@setUserActiveStatus]', () => {
        let testUser;
        let testUser2;
        let testUserCredentials;
        let dmId;
        let dmTestId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUser2 = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.before)('create direct conversation with user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('createDirectMessage'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'createDirectMessage',
                    params: [testUser.username],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.an('object');
                (0, chai_1.expect)(result.result).to.have.property('rid').that.is.an('string');
                dmId = result.result.rid;
                done();
            });
        });
        (0, mocha_1.before)('create direct conversation between both users', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('createDirectMessage'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'createDirectMessage',
                    params: [testUser2.username],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.an('object');
                (0, chai_1.expect)(result.result).to.have.property('rid').that.is.an('string');
                dmTestId = result.result.rid;
                done();
            });
        });
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: dmId }),
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: dmTestId }),
            (0, users_helper_1.deleteUser)(testUser),
            (0, users_helper_1.deleteUser)(testUser2),
        ]));
        (0, mocha_1.it)('should deactivate a user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('setUserActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'setUserActiveStatus',
                    params: [testUser._id, false, false],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').that.is.an('boolean');
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.equal(true);
                done();
            });
        });
        (0, mocha_1.it)('should deactivate another user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('setUserActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'setUserActiveStatus',
                    params: [testUser2._id, false, false],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').that.is.an('boolean');
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.equal(true);
                done();
            });
        });
        (0, mocha_1.it)('should mark the direct conversation between admin=>testUser as readonly when user is deactivated', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getRoomByTypeAndName'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getRoomByTypeAndName',
                    params: ['d', dmId],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body.success).to.equal(true);
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result.ro).to.equal(true);
                done();
            });
        });
        (0, mocha_1.it)('should activate a user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('setUserActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'setUserActiveStatus',
                    params: [testUser._id, true, false],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').that.is.an('boolean');
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.equal(true);
                done();
            });
        });
        (0, mocha_1.it)('should set readonly=false when user is activated (and the other side is also active)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getRoomByTypeAndName'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'getRoomByTypeAndName',
                    params: ['d', dmId],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body.success).to.equal(true);
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result.ro).to.equal(false);
                done();
            });
        });
        (0, mocha_1.it)('should keep the direct conversation between testUser=>testUser2 as readonly when one of them is deactivated', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('login'))
                .send({
                user: testUser.username,
                password: user_1.password,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                testUserCredentials['X-Auth-Token'] = res.body.data.authToken;
                testUserCredentials['X-User-Id'] = res.body.data.userId;
            })
                .then(() => {
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('getRoomByTypeAndName'))
                    .set(testUserCredentials)
                    .send({
                    message: JSON.stringify({
                        method: 'getRoomByTypeAndName',
                        params: ['d', dmTestId],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .end((_err, res) => {
                    (0, chai_1.expect)(res.body.success).to.equal(true);
                    const result = JSON.parse(res.body.message);
                    (0, chai_1.expect)(result.result.ro).to.equal(true);
                    done();
                });
            })
                .catch(done);
        });
        (0, mocha_1.it)('should activate another user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('setUserActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'setUserActiveStatus',
                    params: [testUser2._id, true, false],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body).to.have.property('success').that.is.an('boolean');
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.equal(true);
                done();
            });
        });
        (0, mocha_1.it)('should set readonly=false when both users are activated', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getRoomByTypeAndName'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'getRoomByTypeAndName',
                    params: ['d', dmTestId],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body.success).to.equal(true);
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result.ro).to.equal(false);
                done();
            });
        });
        (0, mocha_1.it)('should keep readonly=true when user is activated (and the other side is deactivated)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('getRoomByTypeAndName'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'getRoomByTypeAndName',
                    params: ['d', dmTestId],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                (0, chai_1.expect)(res.body.success).to.equal(true);
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result.ro).to.equal(false);
                done();
            });
        });
    });
    (0, mocha_1.describe)('[@addUsersToRoom]', () => {
        let guestUser;
        let user;
        let room;
        let createdRooms = [];
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            guestUser = yield (0, users_helper_1.createUser)({ roles: ['guest'] });
            user = yield (0, users_helper_1.createUser)();
            room = (yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: `channel.test.${Date.now()}-${Math.random()}`,
            })).body.channel;
            createdRooms.push(room);
        }));
        (0, mocha_1.after)(() => Promise.all([...createdRooms.map((r) => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: r._id })), (0, users_helper_1.deleteUser)(user), (0, users_helper_1.deleteUser)(guestUser)]));
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('addUsersToRoom'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should add a single user to a room', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('addUsersToRoom'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'addUsersToRoom',
                    params: [{ rid: room._id, users: [user.username] }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('channels.members'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: room._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
                    (0, chai_1.expect)(res.body.members).to.have.lengthOf(2);
                })
                    .end(done);
            })
                .catch(done);
        });
        (0, mocha_1.it)('should not add guest users to more rooms than defined in the license', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!process.env.IS_EE) {
                    this.skip();
                }
                const promises = [];
                for (let i = 0; i < constants_1.CI_MAX_ROOMS_PER_GUEST; i++) {
                    promises.push((0, rooms_helper_1.createRoom)({
                        type: 'c',
                        name: `channel.test.${Date.now()}-${Math.random()}`,
                        members: [guestUser.username],
                    }));
                }
                createdRooms = [...createdRooms, ...(yield Promise.all(promises)).map((res) => res.body.channel)];
                void api_data_1.request
                    .post((0, api_data_1.methodCall)('addUsersToRoom'))
                    .set(api_data_1.credentials)
                    .send({
                    message: JSON.stringify({
                        method: 'addUsersToRoom',
                        params: [{ rid: room._id, users: [guestUser.username] }],
                        id: 'id',
                        msg: 'method',
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    const parsedBody = JSON.parse(res.body.message);
                    (0, chai_1.expect)(parsedBody).to.have.property('error');
                    (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'error-max-rooms-per-guest-reached');
                });
            });
        });
    });
    (0, mocha_1.describe)('[@muteUserInRoom & @unmuteUserInRoom]', () => {
        let rid;
        let channelName;
        let testUser;
        let testUserCredentials = {};
        (0, mocha_1.before)('create test user', () => __awaiter(void 0, void 0, void 0, function* () {
            const username = `user.test.${Date.now()}`;
            const email = `${username}@rocket.chat`;
            testUser = yield (0, users_helper_1.createUser)({ email, name: username, username, password: username, roles: ['user'] });
        }));
        (0, mocha_1.before)('create channel', () => __awaiter(void 0, void 0, void 0, function* () {
            channelName = `methods-test-channel-${Date.now()}`;
            rid = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: channelName, members: [testUser.username] })).body.channel._id;
        }));
        (0, mocha_1.before)('login testUser', () => __awaiter(void 0, void 0, void 0, function* () {
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, testUser.username);
        }));
        (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: rid }), (0, users_helper_1.deleteUser)(testUser)]));
        (0, mocha_1.describe)('-> standard room', () => {
            (0, mocha_1.describe)('- when muting a user in a standard room', () => {
                (0, mocha_1.it)('should mute an user in a standard room', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('muteUserInRoom'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'muteUserInRoom',
                            params: [{ rid, username: testUser.username }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                        (0, chai_1.expect)(data).to.have.a.property('id', 'id');
                        (0, chai_1.expect)(data).not.to.have.a.property('error');
                    });
                }));
                (0, mocha_1.it)('muted user should not be able to send message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.sendMessage'))
                        .set(testUserCredentials)
                        .send({
                        message: {
                            msg: 'Sample message',
                            rid,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.property('error').that.is.a('string');
                        (0, chai_1.expect)(res.body.error).to.equal('You_have_been_muted');
                    });
                }));
            });
            (0, mocha_1.describe)('- when unmuting a user in a standard room', () => {
                (0, mocha_1.it)('should unmute an user in a standard room', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('unmuteUserInRoom'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'unmuteUserInRoom',
                            params: [{ rid, username: testUser.username }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                        (0, chai_1.expect)(data).to.have.a.property('id', 'id');
                        (0, chai_1.expect)(data).not.to.have.a.property('error');
                    });
                }));
                (0, mocha_1.it)('unmuted user should be able to send message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.sendMessage'))
                        .set(testUserCredentials)
                        .send({
                        message: {
                            msg: 'Sample message',
                            rid,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    });
                }));
            });
        });
        (0, mocha_1.describe)('-> read-only room', () => {
            (0, mocha_1.before)('set room to read-only', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('channels.setReadOnly'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: rid,
                    readOnly: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200);
            }));
            (0, mocha_1.it)('should not allow an user to send messages', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(testUserCredentials)
                    .send({
                    message: {
                        msg: 'Sample message',
                        rid,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error').that.is.a('string');
                    (0, chai_1.expect)(res.body.error).to.equal(`You can't send messages because the room is readonly.`);
                });
            }));
            (0, mocha_1.describe)('- when unmuting a user in a read-only room', () => {
                (0, mocha_1.it)('should unmute an user in a read-only room', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('unmuteUserInRoom'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'unmuteUserInRoom',
                            params: [{ rid, username: testUser.username }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                        (0, chai_1.expect)(data).to.have.a.property('id', 'id');
                        (0, chai_1.expect)(data).not.to.have.a.property('error');
                    });
                }));
                (0, mocha_1.it)('unmuted user in read-only room should be able to send message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.sendMessage'))
                        .set(testUserCredentials)
                        .send({
                        message: {
                            msg: 'Sample message',
                            rid,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    });
                }));
            });
            (0, mocha_1.describe)('- when muting a user in a read-only room', () => {
                (0, mocha_1.it)('should mute an user in a read-only room', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.methodCall)('muteUserInRoom'))
                        .set(api_data_1.credentials)
                        .send({
                        message: JSON.stringify({
                            method: 'muteUserInRoom',
                            params: [{ rid, username: testUser.username }],
                            id: 'id',
                            msg: 'method',
                        }),
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                        const data = JSON.parse(res.body.message);
                        (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                        (0, chai_1.expect)(data).to.have.a.property('id', 'id');
                        (0, chai_1.expect)(data).not.to.have.a.property('error');
                    });
                }));
                (0, mocha_1.it)('muted user in read-only room should not be able to send message', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield api_data_1.request
                        .post((0, api_data_1.api)('chat.sendMessage'))
                        .set(testUserCredentials)
                        .send({
                        message: {
                            msg: 'Sample message',
                            rid,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.property('error').that.is.a('string');
                    });
                }));
            });
        });
    });
    (0, mocha_1.describe)('[@saveSettings]', () => {
        (0, mocha_1.it)('should return an error when trying to save a "NaN" value', () => {
            void api_data_1.request
                .post((0, api_data_1.api)('method.call/saveSettings'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '13',
                    method: 'saveSettings',
                    params: [[{ _id: 'Message_AllowEditing_BlockEditInMinutes', value: { $InfNaN: 0 } }]],
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'Invalid setting value NaN');
            });
        });
        (0, mocha_1.it)('should return an error when trying to save a "Infinity" value', () => {
            void api_data_1.request
                .post((0, api_data_1.api)('method.call/saveSettings'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '13',
                    method: 'saveSettings',
                    params: [[{ _id: 'Message_AllowEditing_BlockEditInMinutes', value: { $InfNaN: 1 } }]],
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'Invalid setting value Infinity');
            });
        });
        (0, mocha_1.it)('should return an error when trying to save a "-Infinity" value', () => {
            void api_data_1.request
                .post((0, api_data_1.api)('method.call/saveSettings'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    msg: 'method',
                    id: '13',
                    method: 'saveSettings',
                    params: [[{ _id: 'Message_AllowEditing_BlockEditInMinutes', value: { $InfNaN: -1 } }]],
                }),
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const parsedBody = JSON.parse(res.body.message);
                (0, chai_1.expect)(parsedBody).to.have.property('error');
                (0, chai_1.expect)(parsedBody.error).to.have.property('error', 'Invalid setting value -Infinity');
            });
        });
    });
    (0, mocha_1.describe)('@insertOrUpdateUser', () => {
        let testUser;
        let testUserCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser)]));
        (0, mocha_1.it)('should fail if user tries to verify their own email via insertOrUpdateUser', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('insertOrUpdateUser'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'insertOrUpdateUser',
                    params: [
                        {
                            _id: testUserCredentials['X-User-Id'],
                            email: 'manager@rocket.chat',
                            verified: true,
                        },
                    ],
                    id: '52',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                (0, chai_1.expect)(data).to.have.a.property('id', '52');
                (0, chai_1.expect)(data.error).to.have.property('error', 'error-action-not-allowed');
            })
                .end(done);
        });
        (0, mocha_1.it)('should pass if a user with the right permissions tries to verify the email of another user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('insertOrUpdateUser'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'insertOrUpdateUser',
                    params: [
                        {
                            _id: testUserCredentials['X-User-Id'],
                            email: 'testuser@rocket.chat',
                            verified: true,
                        },
                    ],
                    id: '52',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                (0, chai_1.expect)(data).to.have.a.property('id', '52');
                (0, chai_1.expect)(data).to.have.a.property('result', true);
            })
                .end(done);
        });
    });
    (constants_2.IS_EE ? mocha_1.describe : mocha_1.describe.skip)('[@auditGetAuditions] EE', () => {
        let testUser;
        let testUserCredentials;
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
        (0, mocha_1.before)('create test user', () => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.before)('generate audits data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('auditGetMessages'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'auditGetMessages',
                    params: [
                        {
                            type: '',
                            msg: 'test1234',
                            startDate: { $date: startDate },
                            endDate: { $date: endDate },
                            rid: 'GENERAL',
                            users: [],
                        },
                    ],
                    id: '14',
                    msg: 'method',
                }),
            });
        }));
        (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser)]));
        (0, mocha_1.it)('should fail if the user does not have permissions to get auditions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('auditGetAuditions'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'auditGetAuditions',
                    params: [
                        {
                            startDate: { $date: startDate },
                            endDate: { $date: endDate },
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('error', 'Not allowed');
            });
        }));
        (0, mocha_1.it)('should not return more user data than necessary - e.g. passwords, hashes, tokens', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('auditGetAuditions'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'auditGetAuditions',
                    params: [
                        {
                            startDate: { $date: startDate },
                            endDate: { $date: endDate },
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('message').that.is.a('string');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('result').that.is.an('array');
                (0, chai_1.expect)(data.result.length).to.be.greaterThan(0);
                (0, chai_1.expect)(data).to.have.a.property('msg', 'result');
                (0, chai_1.expect)(data).to.have.a.property('id', '18');
                data.result.forEach((item) => {
                    (0, chai_1.expect)(item).to.have.all.keys('_id', 'ts', 'results', 'u', 'fields', '_updatedAt');
                    (0, chai_1.expect)(item.u).to.not.have.property('services');
                    (0, chai_1.expect)(item.u).to.not.have.property('roles');
                    (0, chai_1.expect)(item.u).to.not.have.property('lastLogin');
                    (0, chai_1.expect)(item.u).to.not.have.property('statusConnection');
                    (0, chai_1.expect)(item.u).to.not.have.property('emails');
                });
            });
        }));
    });
    (0, mocha_1.describe)('UpdateOTRAck', () => {
        let testUser;
        let testUser2;
        let testUserCredentials;
        let dmTestId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUser2 = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        }));
        (0, mocha_1.before)('create direct conversation between both users', (done) => {
            void api_data_1.request
                .post((0, api_data_1.methodCall)('createDirectMessage'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'createDirectMessage',
                    params: [testUser2.username],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .end((_err, res) => {
                const result = JSON.parse(res.body.message);
                (0, chai_1.expect)(result.result).to.be.an('object');
                (0, chai_1.expect)(result.result).to.have.property('rid').that.is.an('string');
                dmTestId = result.result.rid;
                done();
            });
        });
        (0, mocha_1.after)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: dmTestId }), (0, users_helper_1.deleteUser)(testUser), (0, users_helper_1.deleteUser)(testUser2)]));
        (0, mocha_1.it)('should fail if required parameters are not present', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                // rid: 'test',
                                msg: 'test',
                                t: 'otr',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: 'test',
                                    username: 'test',
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('message', "Match error: Missing key 'rid'");
            });
        }));
        (0, mocha_1.it)('should fail if required parameters have a different type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                rid: { $ne: 'test' },
                                msg: 'test',
                                t: 'otr',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: 'test',
                                    username: 'test',
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('message', 'Match error: Expected string, got object in field rid');
            });
        }));
        (0, mocha_1.it)('should fail if "t" is not "otr"', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                rid: 'test',
                                msg: 'test',
                                t: 'notOTR',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: 'test',
                                    username: 'test',
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('message', 'Invalid message type [error-invalid-message]');
            });
        }));
        (0, mocha_1.it)('should fail if room does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                rid: 'test',
                                msg: 'test',
                                t: 'otr',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: 'test',
                                    username: 'test',
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('message', 'Invalid room [error-invalid-room]');
            });
        }));
        (0, mocha_1.it)('should fail if room is not a DM', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                rid: 'GENERAL',
                                msg: 'test',
                                t: 'otr',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: 'test',
                                    username: 'test',
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('message', 'Invalid room [error-invalid-room]');
            });
        }));
        (0, mocha_1.it)('should fail if user is not part of DM room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                rid: dmTestId,
                                msg: 'test',
                                t: 'otr',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: testUser._id,
                                    username: testUser.username,
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                const data = JSON.parse(res.body.message);
                (0, chai_1.expect)(data).to.have.a.property('error');
                (0, chai_1.expect)(data.error).to.have.a.property('message', 'Invalid user, not in room [error-invalid-user]');
            });
        }));
        (0, mocha_1.it)('should pass if all parameters are present and user is part of DM room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('updateOTRAck'))
                .set(testUserCredentials)
                .send({
                message: JSON.stringify({
                    method: 'updateOTRAck',
                    params: [
                        {
                            message: {
                                _id: 'czjFdkFab7H5bWxYq',
                                rid: dmTestId,
                                msg: 'test',
                                t: 'otr',
                                ts: { $date: 1725447664093 },
                                u: {
                                    _id: testUser._id,
                                    username: testUser.username,
                                    name: 'test',
                                },
                            },
                            ack: 'test',
                        },
                    ],
                    id: '18',
                    msg: 'method',
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('message');
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            });
        }));
    });
});
