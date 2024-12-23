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
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Subscriptions]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    let testChannel;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}` })).body.channel;
    }));
    (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
    (0, mocha_1.it)('/subscriptions.get', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('subscriptions.get'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('update');
            (0, chai_1.expect)(res.body).to.have.property('remove');
        })
            .end(done);
    });
    (0, mocha_1.it)('/subscriptions.get?updatedSince', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('subscriptions.get'))
            .set(api_data_1.credentials)
            .query({
            updatedSince: new Date(),
        })
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('update').that.have.lengthOf(0);
            (0, chai_1.expect)(res.body).to.have.property('remove').that.have.lengthOf(0);
        })
            .end(done);
    });
    (0, mocha_1.describe)('/subscriptions.getOne', () => {
        (0, mocha_1.it)('should fail if no roomId provided', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', "must have required property 'roomId' [invalid-params]");
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the subscription with success', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
            })
                .end(done);
        });
        (0, mocha_1.it)('should keep subscription as read after sending a message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
                (0, chai_1.expect)(res.body.subscription).to.have.property('alert', false);
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Sample message',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
                (0, chai_1.expect)(res.body.subscription).to.have.property('alert', false);
            });
        }));
    });
    (0, mocha_1.describe)('[/subscriptions.read]', () => {
        let testChannel;
        let testGroup;
        let testDM;
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}` })).body.channel;
            testGroup = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `group.test.${Date.now()}` })).body.group;
            testDM = (yield (0, rooms_helper_1.createRoom)({ type: 'd', username: user.username })).body.room;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, rooms_helper_1.deleteRoom)({ type: 'd', roomId: testDM._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testGroup._id }),
            (0, users_helper_1.deleteUser)(user),
        ]));
        (0, mocha_1.it)('should mark public channels as read', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should mark groups as read', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: testGroup._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should mark DMs as read', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: testDM._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on two params with different ids', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: testDM._id,
                roomId: testChannel._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on mark inexistent public channel as read', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: 'foobar123-somechannel',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-invalid-subscription');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on mark inexistent group as read', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: 'foobar123-somegroup',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-invalid-subscription');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on mark inexistent DM as read', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: 'foobar123-somedm',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-invalid-subscription');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on invalid params', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({
                rid: 12345,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'error-invalid-subscription');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on empty params', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.read'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
            })
                .end(done);
        });
        (0, mocha_1.describe)('should handle threads correctly', () => {
            let threadId;
            let user;
            let threadUserCredentials;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)({ username: 'testthread123', password: 'testthread123' });
                threadUserCredentials = yield (0, users_helper_1.login)('testthread123', 'testthread123');
                const res = yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(threadUserCredentials)
                    .send({
                    message: {
                        rid: testChannel._id,
                        msg: 'Starting a Thread',
                    },
                });
                threadId = res.body.message._id;
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, users_helper_1.deleteUser)(user);
            }));
            (0, mocha_1.it)('should mark threads as read', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(threadUserCredentials)
                    .send({
                    message: {
                        rid: testChannel._id,
                        msg: `@${user_1.adminUsername} making admin follow this thread`,
                        tmid: threadId,
                    },
                });
                yield api_data_1.request
                    .post((0, api_data_1.api)('subscriptions.read'))
                    .set(api_data_1.credentials)
                    .send({
                    rid: testChannel._id,
                    readThreads: true,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: testChannel._id,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body.subscription).to.not.have.property('tunread');
                });
            }));
            (0, mocha_1.it)('should not mark threads as read', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(threadUserCredentials)
                    .send({
                    message: {
                        rid: testChannel._id,
                        msg: `@${user_1.adminUsername} making admin follow this thread`,
                        tmid: threadId,
                    },
                });
                yield api_data_1.request
                    .post((0, api_data_1.api)('subscriptions.read'))
                    .set(api_data_1.credentials)
                    .send({
                    rid: testChannel._id,
                    readThreads: false,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: testChannel._id,
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body.subscription).to.have.property('tunread');
                    (0, chai_1.expect)(res.body.subscription.tunread).to.be.an('array');
                    (0, chai_1.expect)(res.body.subscription.tunread).to.deep.equal([threadId]);
                });
            }));
        });
    });
    (0, mocha_1.describe)('[/subscriptions.unread]', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should fail when there are no messages on an channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.unread'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-no-message-for-unread');
            })
                .end(done);
        });
        (0, mocha_1.it)('sending message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    rid: testChannel._id,
                    msg: 'Sample message',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('message').and.to.be.an('object');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success: true when make as unread successfully', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.unread'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on invalid params', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.unread'))
                .set(api_data_1.credentials)
                .send({
                roomId: 12345,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail on empty params', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('subscriptions.unread'))
                .set(api_data_1.credentials)
                .send({})
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
    });
});
