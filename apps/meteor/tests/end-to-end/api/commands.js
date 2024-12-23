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
const rooms_helper_1 = require("../../data/rooms.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Commands]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('[/commands.get]', () => {
        (0, mocha_1.it)('should return an error when call the endpoint without "command" required parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('commands.get'))
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('The query param "command" must be provided.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint with an invalid command', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('commands.get'))
                .set(api_data_1.credentials)
                .query({
                command: 'invalid-command',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('There is no command in the system by the name of: invalid-command');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success when parameters are correct', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('commands.get'))
                .set(api_data_1.credentials)
                .query({
                command: 'help',
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('command');
                (0, chai_1.expect)(res.body.command).to.have.property('command');
                (0, chai_1.expect)(res.body.command).to.have.property('description');
                (0, chai_1.expect)(res.body.command).to.have.property('clientOnly');
                (0, chai_1.expect)(res.body.command).to.have.property('providesPreview');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/commands.list]', () => {
        (0, mocha_1.it)('should return a list of commands', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('commands.list'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('commands').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a list of commands even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('commands.list'))
                .set(api_data_1.credentials)
                .query({
                count: 5,
                offset: 0,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('commands').and.to.be.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/commands.run]', () => {
        let testChannel;
        let threadMessage;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.commands.${Date.now()}` })).body.channel;
            const { body: { message } = {} } = yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Message to create thread',
            });
            threadMessage = (yield (0, chat_helper_1.sendSimpleMessage)({
                roomId: testChannel._id,
                text: 'Thread Message',
                tmid: message._id,
            })).body.message;
        }));
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }));
        (0, mocha_1.it)('should return an error when call the endpoint without "command" required parameter', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('You must provide a command to run.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint with the param "params" and it is not a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'help',
                params: true,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('The parameters for the command must be a single string.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint without "roomId" required parameter', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'help',
                params: 'params',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal("The room's id where to execute this command must be provided and be a string.");
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint with the param "tmid" and it is not a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'help',
                params: 'params',
                roomId: 'GENERAL',
                tmid: true,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('The tmid parameter when provided must be a string.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint with the invalid "command" param', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'invalid-command',
                params: 'params',
                roomId: 'GENERAL',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('The command provided does not exist (or is disabled).');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint with an invalid thread id', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'tableflip',
                params: 'params',
                roomId: 'GENERAL',
                tmid: 'invalid-thread',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Invalid thread.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when call the endpoint with a valid thread id of wrong channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'tableflip',
                params: 'params',
                roomId: 'GENERAL',
                tmid: threadMessage.tmid,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Invalid thread.');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return success when parameters are correct', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(api_data_1.credentials)
                .send({
                command: 'tableflip',
                params: 'params',
                roomId: threadMessage.rid,
                tmid: threadMessage.tmid,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('Command archive', function () {
        (0, mocha_1.describe)('unauthorized cases', () => {
            let user;
            let credentials;
            this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)({
                    joinDefaultChannels: true,
                });
                credentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            }));
            this.afterAll(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, users_helper_1.deleteUser)(user);
            }));
            (0, mocha_1.it)('should return an error when the user is not logged in', () => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .send({ command: 'archive', roomId: 'GENERAL' })
                    .expect(401)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                });
            }));
            (0, mocha_1.it)('should return an error when the user has not enough permissions', () => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .set(credentials)
                    .send({
                    command: 'archive',
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-authorized');
                });
            }));
        });
        (0, mocha_1.describe)('authorized cases', function () {
            this.afterAll(() => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .set(api_data_1.credentials)
                    .send({
                    command: 'unarchive',
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
            (0, mocha_1.it)('should return a success when the user has enough permissions', () => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .set(api_data_1.credentials)
                    .send({
                    command: 'archive',
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
        });
    });
    (0, mocha_1.describe)('Command unarchive', function () {
        (0, mocha_1.describe)('unauthorized cases', () => {
            let user;
            let credentials;
            this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)({
                    joinDefaultChannels: true,
                });
                credentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            }));
            this.afterAll(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, users_helper_1.deleteUser)(user);
            }));
            (0, mocha_1.it)('should return an error when the user is not logged in', () => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .send({ command: 'unarchive', roomId: 'GENERAL' })
                    .expect(401)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                });
            }));
            (0, mocha_1.it)('should return an error when the user has not enough permissions', () => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .set(credentials)
                    .send({
                    command: 'unarchive',
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-authorized');
                });
            }));
        });
        (0, mocha_1.describe)('authorized cases', () => {
            (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .set(api_data_1.credentials)
                    .send({
                    command: 'archive',
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
            (0, mocha_1.it)('should return a success when the user has enough permissions', () => __awaiter(this, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('commands.run'))
                    .set(api_data_1.credentials)
                    .send({
                    command: 'unarchive',
                    roomId: 'GENERAL',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
        });
    });
    (0, mocha_1.describe)('Command "invite-all-from"', function () {
        let group;
        let group1;
        let channel;
        let user1;
        let user2;
        let user1Credentials;
        let user2Credentials;
        this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            user1 = yield (0, users_helper_1.createUser)();
            user2 = yield (0, users_helper_1.createUser)();
            [user1Credentials, user2Credentials] = yield Promise.all([(0, users_helper_1.login)(user1.username, user_1.password), (0, users_helper_1.login)(user2.username, user_1.password)]);
        }));
        this.beforeAll(() => __awaiter(this, void 0, void 0, function* () {
            const [response1, response2, response3] = yield Promise.all([
                (0, rooms_helper_1.createRoom)({ type: 'p', name: `room1-${Date.now()}.${random_1.Random.id()}`, credentials: user1Credentials }),
                (0, rooms_helper_1.createRoom)({ type: 'c', name: `room2-${Date.now()}.${random_1.Random.id()}`, credentials: user2Credentials }),
                (0, rooms_helper_1.createRoom)({ type: 'p', name: `room3-${Date.now()}.${random_1.Random.id()}` }),
            ]);
            group = response1.body.group;
            channel = response2.body.channel;
            group1 = response3.body.group;
        }));
        this.afterAll(() => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: group._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channel._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: group1._id }),
            ]);
            yield Promise.all([(0, users_helper_1.deleteUser)(user1), (0, users_helper_1.deleteUser)(user2)]);
        }));
        (0, mocha_1.it)('should not add users from group which is not accessible by current user', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(user2Credentials)
                .send({
                roomId: channel._id,
                command: 'invite-all-from',
                params: `#${group.name}`,
                msg: {
                    _id: random_1.Random.id(),
                    rid: channel._id,
                    msg: `invite-all-from #${group.name}`,
                },
                triggerId: random_1.Random.id(),
            })
                .expect(200)
                .expect((res) => __awaiter(this, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            }));
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.members'))
                .query({ roomId: channel._id })
                .set(user2Credentials)
                .expect(200)
                .expect((res) => {
                const isUser1Added = res.body.members.some((member) => member.username === user1.username);
                (0, chai_1.expect)(isUser1Added).to.be.false;
            });
        }));
        (0, mocha_1.it)('should not add users to a room that is not accessible by the current user', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(user1Credentials)
                .send({
                roomId: group1._id,
                command: 'invite-all-from',
                params: `#${group.name}`,
                msg: {
                    _id: random_1.Random.id(),
                    rid: group1._id,
                    msg: `invite-all-from #${group.name}`,
                },
                triggerId: random_1.Random.id(),
            })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('error', 'unauthorized');
            });
        }));
        (0, mocha_1.it)('should add users from group which is accessible by current user', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.invite'))
                .set(user1Credentials)
                .send({
                roomId: group._id,
                userId: user2._id,
            })
                .expect(200);
            yield api_data_1.request
                .post((0, api_data_1.api)('commands.run'))
                .set(user2Credentials)
                .send({
                roomId: channel._id,
                command: 'invite-all-from',
                params: `#${group.name}`,
                msg: {
                    _id: random_1.Random.id(),
                    rid: channel._id,
                    msg: `invite-all-from #${group.name}`,
                },
                triggerId: random_1.Random.id(),
            })
                .expect(200)
                .expect((res) => __awaiter(this, void 0, void 0, function* () {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            }));
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.members'))
                .set(user2Credentials)
                .query({ roomId: channel._id })
                .expect(200)
                .expect((res) => {
                const isUser1Added = res.body.members.some((member) => member.username === user1.username);
                (0, chai_1.expect)(isUser1Added).to.be.true;
            });
        }));
    });
});
