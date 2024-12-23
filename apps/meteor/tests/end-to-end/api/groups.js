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
const constants_1 = require("../../data/constants");
const groups_helper_1 = require("../../data/groups.helper");
const integration_helper_1 = require("../../data/integration.helper");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const teams_helper_1 = require("../../data/teams.helper");
const uploads_helper_1 = require("../../data/uploads.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
function getRoomInfo(roomId) {
    return new Promise((resolve) => {
        void api_data_1.request
            .get((0, api_data_1.api)('groups.info'))
            .set(api_data_1.credentials)
            .query({
            roomId,
        })
            .end((_err, req) => {
            resolve(req.body);
        });
    });
}
(0, mocha_1.describe)('[Groups]', () => {
    let group;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.api)('groups.create'))
            .set(api_data_1.credentials)
            .send({
            name: api_data_1.apiPrivateChannelName,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('group.name', api_data_1.apiPrivateChannelName);
            (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
            (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
            group = {
                _id: res.body.group._id,
                name: res.body.group.name,
            };
        });
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.api)('groups.delete'))
            .set(api_data_1.credentials)
            .send({
            roomId: group._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200);
    }));
    (0, mocha_1.describe)('/groups.create', () => {
        let guestUser;
        let invitedUser;
        let invitedUserCredentials;
        let room;
        let teamId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            guestUser = yield (0, users_helper_1.createUser)({ roles: ['guest'] });
            invitedUser = yield (0, users_helper_1.createUser)();
            invitedUserCredentials = yield (0, users_helper_1.login)(invitedUser.username, user_1.password);
            yield (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']);
            const teamCreateRes = yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `team-${Date.now()}`,
                type: 0,
                members: [invitedUser.username],
            });
            teamId = teamCreateRes.body.team._id;
            yield (0, permissions_helper_1.updatePermission)('create-team-group', ['owner']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(guestUser);
            yield (0, users_helper_1.deleteUser)(invitedUser);
            yield (0, permissions_helper_1.updatePermission)('create-team-group', ['admin', 'owner', 'moderator']);
        }));
        (0, mocha_1.describe)('guest users', () => {
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
                            type: 'p',
                            name: `channel.test.${Date.now()}-${Math.random()}`,
                            members: [guestUser.username],
                        }));
                    }
                    yield Promise.all(promises);
                    yield api_data_1.request
                        .post((0, api_data_1.api)('groups.create'))
                        .set(api_data_1.credentials)
                        .send({
                        name: `channel.test.${Date.now()}-${Math.random()}`,
                        members: [guestUser.username],
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        room = res.body.group;
                    });
                    yield api_data_1.request
                        .get((0, api_data_1.api)('groups.members'))
                        .set(api_data_1.credentials)
                        .query({
                        roomId: room._id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
                        (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
                    });
                });
            });
        });
        (0, mocha_1.describe)('validate E2E rooms', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([(0, permissions_helper_1.updateSetting)('E2E_Enable', true), (0, permissions_helper_1.updateSetting)('E2E_Allow_Unencrypted_Messages', false)]);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([(0, permissions_helper_1.updateSetting)('E2E_Enable', false), (0, permissions_helper_1.updateSetting)('E2E_Allow_Unencrypted_Messages', true)]);
            }));
            let rid;
            (0, mocha_1.it)('should create a new encrypted group', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('groups.create'))
                    .set(api_data_1.credentials)
                    .send({
                    name: `encrypted-${api_data_1.apiPrivateChannelName}`,
                    extraData: {
                        encrypted: true,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.name', `encrypted-${api_data_1.apiPrivateChannelName}`);
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.encrypted', true);
                    rid = res.body.group._id;
                });
            }));
            (0, mocha_1.it)('should send an encrypted message in encrypted group', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        text: 'Encrypted Message',
                        t: 'e2e',
                        e2e: 'pending',
                        rid,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message');
                    (0, chai_1.expect)(res.body).to.have.nested.property('message.text', 'Encrypted Message');
                    (0, chai_1.expect)(res.body).to.have.nested.property('message.t', 'e2e');
                    (0, chai_1.expect)(res.body).to.have.nested.property('message.e2e', 'pending');
                });
            }));
            (0, mocha_1.it)('should give an error on sending un-encrypted message in encrypted room', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        text: 'Unencrypted Message',
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
            (0, mocha_1.it)('should allow sending un-encrypted messages in encrypted room when setting is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('E2E_Allow_Unencrypted_Messages', true);
                yield api_data_1.request
                    .post((0, api_data_1.api)('chat.sendMessage'))
                    .set(api_data_1.credentials)
                    .send({
                    message: {
                        text: 'Unencrypted Message',
                        rid,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('message');
                    (0, chai_1.expect)(res.body).to.have.nested.property('message.text', 'Unencrypted Message');
                });
            }));
        });
        (0, mocha_1.describe)('E2E enabled by default', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([(0, permissions_helper_1.updateSetting)('E2E_Enable', true), (0, permissions_helper_1.updateSetting)('E2E_Enabled_Default_PrivateRooms', true)]);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([(0, permissions_helper_1.updateSetting)('E2E_Enable', false), (0, permissions_helper_1.updateSetting)('E2E_Enabled_Default_PrivateRooms', false)]);
            }));
            (0, mocha_1.it)('should create the encrypted room by default', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('groups.create'))
                    .set(api_data_1.credentials)
                    .send({
                    name: `default-encrypted-${api_data_1.apiPrivateChannelName}`,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.name', `default-encrypted-${api_data_1.apiPrivateChannelName}`);
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                    (0, chai_1.expect)(res.body).to.have.nested.property('group.encrypted', true);
                });
            }));
        });
        (0, mocha_1.it)(`should fail when trying to use an existing room's name`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: 'general',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.nested.property('errorType', 'error-duplicate-channel-name');
            });
        }));
        (0, mocha_1.it)('should successfully create a group in a team', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `team-group-${Date.now()}`,
                extraData: { teamId },
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('group');
                (0, chai_1.expect)(res.body.group).to.have.property('teamId', teamId);
            });
        }));
        (0, mocha_1.it)('should fail creating a group in a team when member does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(invitedUserCredentials)
                .send({
                name: `team-group-${Date.now()}`,
                extraData: { teamId },
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
            });
        }));
    });
    (0, mocha_1.describe)('/groups.info', () => {
        let testGroup;
        const newGroupInfoName = `info-private-channel-test-${Date.now()}`;
        (0, mocha_1.before)('creating new group...', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: newGroupInfoName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                testGroup = res.body.group;
            });
        }));
        (0, mocha_1.after)('deleting group...', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: newGroupInfoName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should return group basic structure', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', newGroupInfoName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
            });
        }));
        let groupMessage;
        (0, mocha_1.it)('sending a message...', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid: testGroup._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                groupMessage = res.body.message;
            });
        }));
        (0, mocha_1.it)('REACTing with last message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: groupMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('STARring last message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.starMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: groupMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('PINning last message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.pinMessage'))
                .set(api_data_1.credentials)
                .send({
                messageId: groupMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return group structure with "lastMessage" object including pin, reaction and star(should be an array) infos', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('group').and.to.be.an('object');
                const { group } = res.body;
                (0, chai_1.expect)(group).to.have.property('lastMessage').and.to.be.an('object');
                (0, chai_1.expect)(group.lastMessage).to.have.property('reactions').and.to.be.an('object');
                (0, chai_1.expect)(group.lastMessage).to.have.property('pinned').and.to.be.a('boolean');
                (0, chai_1.expect)(group.lastMessage).to.have.property('pinnedAt').and.to.be.a('string');
                (0, chai_1.expect)(group.lastMessage).to.have.property('pinnedBy').and.to.be.an('object');
                (0, chai_1.expect)(group.lastMessage).to.have.property('starred').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should return all groups messages where the last message of array should have the "star" array with USERS star ONLY', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                var _a;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                const messages = res.body.messages;
                const lastMessage = messages.filter((message) => message._id === groupMessage._id)[0];
                (0, chai_1.expect)(lastMessage).to.have.property('starred').and.to.be.an('array');
                (0, chai_1.expect)((_a = lastMessage.starred) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(user_1.adminUsername);
            });
        }));
        (0, mocha_1.it)('should return all groups messages where the last message of array should have the "star" array with USERS star ONLY even requested with count and offset params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                var _a;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                const messages = res.body.messages;
                const lastMessage = messages.filter((message) => message._id === groupMessage._id)[0];
                (0, chai_1.expect)(lastMessage).to.have.property('starred').and.to.be.an('array');
                (0, chai_1.expect)((_a = lastMessage.starred) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(user_1.adminUsername);
            });
        }));
    });
    (0, mocha_1.describe)('/groups.messages', () => {
        let testGroup;
        let firstUser;
        let secondUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testGroup = (yield (0, groups_helper_1.createGroup)({ name: `test-group-${Date.now()}` })).body.group;
            firstUser = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            secondUser = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            const messages = [
                {
                    rid: testGroup._id,
                    msg: `@${firstUser.username} youre being mentioned`,
                    mentions: [{ username: firstUser.username, _id: firstUser._id, name: firstUser.name }],
                },
                {
                    rid: testGroup._id,
                    msg: `@${secondUser.username} youre being mentioned`,
                    mentions: [{ username: secondUser.username, _id: secondUser._id, name: secondUser.name }],
                },
                {
                    rid: testGroup._id,
                    msg: `A simple message`,
                },
                {
                    rid: testGroup._id,
                    msg: `A pinned simple message`,
                },
            ];
            const [, , starredMessage, pinnedMessage] = yield Promise.all(messages.map((message) => (0, chat_helper_1.sendMessage)({ message })));
            yield Promise.all([
                (0, chat_helper_1.starMessage)({ messageId: starredMessage.body.message._id }),
                (0, chat_helper_1.pinMessage)({ messageId: pinnedMessage.body.message._id }),
            ]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, groups_helper_1.deleteGroup)({ roomName: testGroup.name });
        }));
        (0, mocha_1.it)('should return all messages from a group', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({ roomId: testGroup._id })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(5);
            });
        }));
        (0, mocha_1.it)('should return messages that mention a single user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
                mentionIds: firstUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('mentions').that.is.an('array').and.to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0].mentions[0]).to.have.property('_id', firstUser._id);
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total', 1);
            });
        }));
        (0, mocha_1.it)('should return messages that mention multiple users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
                mentionIds: `${firstUser._id},${secondUser._id}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(2);
                (0, chai_1.expect)(res.body).to.have.property('count', 2);
                (0, chai_1.expect)(res.body).to.have.property('total', 2);
                const mentionIds = res.body.messages.map((message) => message.mentions[0]._id);
                (0, chai_1.expect)(mentionIds).to.include.members([firstUser._id, secondUser._id]);
            });
        }));
        (0, mocha_1.it)('should return messages that are starred by a specific user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
                starredIds: 'rocketchat.internal.admin.test',
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
                .get((0, api_data_1.api)('groups.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
                pinned: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.messages).to.have.lengthOf(1);
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('pinned').that.is.an('boolean').and.to.be.true;
                (0, chai_1.expect)(res.body.messages[0]).to.have.nested.property('pinnedBy').that.is.an('object');
                (0, chai_1.expect)(res.body.messages[0].pinnedBy).to.have.property('_id', 'rocketchat.internal.admin.test');
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total', 1);
            });
        }));
    });
    (0, mocha_1.describe)('/groups.invite', () => __awaiter(void 0, void 0, void 0, function* () {
        let roomInfo;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            roomInfo = yield getRoomInfo(group._id);
        }));
        (0, mocha_1.it)('should invite user to group', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', api_data_1.apiPrivateChannelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', roomInfo.group.msgs + 1);
            });
        }));
    }));
    (0, mocha_1.describe)('/groups.addModerator', () => {
        (0, mocha_1.it)('should make user a moderator', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.addModerator'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.removeModerator', () => {
        (0, mocha_1.it)('should remove user from moderator', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.removeModerator'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.addOwner', () => {
        (0, mocha_1.it)('should add user as owner', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.addOwner'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.removeOwner', () => {
        (0, mocha_1.it)('should remove user from owner', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.removeOwner'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.addLeader', () => {
        (0, mocha_1.it)('should add user as leader', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.addLeader'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.removeLeader', () => {
        (0, mocha_1.it)('should remove user from leader', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.removeLeader'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: 'rocket.cat',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.kick', () => {
        let testUserModerator;
        let credsModerator;
        let testUserOwner;
        let credsOwner;
        let testUserMember;
        let groupTest;
        const inviteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.invite'))
                .set(credsOwner)
                .send({
                roomId: groupTest._id,
                userId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        });
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            // had to do them in serie because calling them with Promise.all was failing some times
            testUserModerator = yield (0, users_helper_1.createUser)();
            testUserOwner = yield (0, users_helper_1.createUser)();
            testUserMember = yield (0, users_helper_1.createUser)();
            credsModerator = yield (0, users_helper_1.login)(testUserModerator.username, user_1.password);
            credsOwner = yield (0, users_helper_1.login)(testUserOwner.username, user_1.password);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(credsOwner)
                .send({
                name: `kick-test-group-${Date.now()}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', 0);
                groupTest = res.body.group;
            });
            yield inviteUser(testUserModerator._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.addModerator'))
                .set(credsOwner)
                .send({
                roomId: groupTest._id,
                userId: testUserModerator._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                api_data_1.request
                    .post((0, api_data_1.api)('groups.delete'))
                    .set(credsOwner)
                    .send({
                    roomId: groupTest._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200),
                (0, permissions_helper_1.updatePermission)('kick-user-from-any-p-room', []),
                (0, permissions_helper_1.updatePermission)('remove-user', ['admin', 'owner', 'moderator']),
                (0, users_helper_1.deleteUser)(testUserModerator),
                (0, users_helper_1.deleteUser)(testUserOwner),
                (0, users_helper_1.deleteUser)(testUserMember),
            ]);
        }));
        (0, mocha_1.it)("should return an error when user is not a member of the group and doesn't have permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('kick-user-from-any-p-room', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.kick'))
                .set(api_data_1.credentials)
                .send({
                roomId: groupTest._id,
                userId: testUserMember._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-room-not-found');
            });
        }));
        (0, mocha_1.it)('should allow a moderator to remove user from group', () => __awaiter(void 0, void 0, void 0, function* () {
            yield inviteUser(testUserMember._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.kick'))
                .set(credsModerator)
                .send({
                roomId: groupTest._id,
                userId: testUserMember._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should allow an owner to remove user from group', () => __awaiter(void 0, void 0, void 0, function* () {
            yield inviteUser(testUserMember._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.kick'))
                .set(credsOwner)
                .send({
                roomId: groupTest._id,
                userId: testUserMember._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should kick user from group if not a member of the room but has the required permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('kick-user-from-any-p-room', ['admin']);
            yield inviteUser(testUserMember._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.kick'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                userId: testUserMember._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)("should return an error when the owner doesn't have the required permission", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('remove-user', ['admin', 'moderator']);
            yield inviteUser(testUserMember._id);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.kick'))
                .set(credsOwner)
                .send({
                roomId: groupTest._id,
                userId: testUserMember._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
            });
        }));
        (0, mocha_1.it)('should return an error when trying to kick the last owner from a group', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('kick-user-from-any-p-room', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.kick'))
                .set(api_data_1.credentials)
                .send({
                roomId: groupTest._id,
                userId: testUserOwner._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-you-are-last-owner');
            });
        }));
        (0, mocha_1.it)('should return an error when trying to kick user that does not exist');
        (0, mocha_1.it)('should return an error when trying to kick user from a group that does not exist');
        (0, mocha_1.it)('should return an error when trying to kick user from a group that the user is not in the room');
    });
    (0, mocha_1.describe)('/groups.setDescription', () => {
        (0, mocha_1.it)('should set the description of the group with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setDescription'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                description: 'this is a description for a channel for api tests',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('description', 'this is a description for a channel for api tests');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set the description of the group with an empty string(remove the description)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setDescription'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                description: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('description', '');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.setTopic', () => {
        (0, mocha_1.it)('should set the topic of the group with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setTopic'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                topic: 'this is a topic of a channel for api tests',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('topic', 'this is a topic of a channel for api tests');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set the topic of the group with an empty string(remove the topic)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setTopic'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
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
    (0, mocha_1.describe)('/groups.setPurpose', () => {
        (0, mocha_1.it)('should set the purpose of the group with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setPurpose'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                purpose: 'this is a purpose of a channel for api tests',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('purpose', 'this is a purpose of a channel for api tests');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set the purpose of the group with an empty string(remove the purpose)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setPurpose'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                purpose: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('purpose', '');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.history', () => {
        (0, mocha_1.it)('should return groups history when searching by roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.history'))
                .set(api_data_1.credentials)
                .query({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return groups history when searching by roomId even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.history'))
                .set(api_data_1.credentials)
                .query({
                roomId: group._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.archive', () => {
        (0, mocha_1.it)('should archive the group', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.archive'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.unarchive', () => {
        (0, mocha_1.it)('should unarchive the group', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.unarchive'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.close', () => {
        (0, mocha_1.it)('should close the group', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.close'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying to close a private group that is already closed', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.close'))
                .set(api_data_1.credentials)
                .send({
                roomName: api_data_1.apiPrivateChannelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', `The private group, ${api_data_1.apiPrivateChannelName}, is already closed to the sender`);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.open', () => {
        (0, mocha_1.it)('should open the group', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.open'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.list', () => {
        (0, mocha_1.it)('should list the groups the caller is part of', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('groups').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return a list of zero length if not a member of any group', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            const newCreds = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.list'))
                .set(newCreds)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('total').and.to.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('groups').and.to.be.an('array').and.that.has.lengthOf(0);
            });
        }));
    });
    (0, mocha_1.describe)('/groups.online', () => {
        const createUserAndChannel = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (setAsOnline = true) {
            const testUser = yield (0, users_helper_1.createUser)();
            const testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            if (setAsOnline) {
                yield api_data_1.request.post((0, api_data_1.api)('users.setStatus')).set(testUserCredentials).send({
                    message: '',
                    status: 'online',
                });
            }
            const roomName = `group-test-${Date.now()}`;
            const roomResponse = yield (0, rooms_helper_1.createRoom)({
                name: roomName,
                type: 'p',
                members: [testUser.username],
                credentials: testUserCredentials,
            });
            return {
                testUser,
                testUserCredentials,
                room: roomResponse.body.group,
            };
        });
        (0, mocha_1.it)('should return an error if no query', () => api_data_1.request
            .get((0, api_data_1.api)('groups.online'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid query');
        }));
        (0, mocha_1.it)('should return an error if passing an empty query', () => api_data_1.request
            .get((0, api_data_1.api)('groups.online'))
            .set(api_data_1.credentials)
            .query('query={}')
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid query');
        }));
        (0, mocha_1.it)('should return an array with online members', () => __awaiter(void 0, void 0, void 0, function* () {
            const { testUser, testUserCredentials, room } = yield createUserAndChannel();
            const response = yield api_data_1.request.get((0, api_data_1.api)('groups.online')).set(testUserCredentials).query({
                _id: room._id,
            });
            const { body } = response;
            const expected = {
                _id: testUser._id,
                username: testUser.username,
            };
            (0, chai_1.expect)(body.online).to.deep.include(expected);
        }));
        (0, mocha_1.it)('should return an empty array if members are offline', () => __awaiter(void 0, void 0, void 0, function* () {
            const { testUserCredentials, room } = yield createUserAndChannel(false);
            const response = yield api_data_1.request.get((0, api_data_1.api)('groups.online')).set(testUserCredentials).query({
                _id: room._id,
            });
            const { body } = response;
            (0, chai_1.expect)(body.online).to.deep.equal([]);
        }));
        (0, mocha_1.it)('should return an error if requesting user is not in group', () => __awaiter(void 0, void 0, void 0, function* () {
            const outsider = yield (0, users_helper_1.createUser)();
            const outsiderCredentials = yield (0, users_helper_1.login)(outsider.username, user_1.password);
            const { room } = yield createUserAndChannel();
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.online'))
                .set(outsiderCredentials)
                .query({
                _id: room._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-not-allowed');
            });
        }));
    });
    (0, mocha_1.describe)('/groups.members', () => {
        (0, mocha_1.it)('should return group members when searching by roomId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return group members when searching by roomId even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: group._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.files', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, uploads_helper_1.testFileUploads)('groups.files', 'p');
    }));
    (0, mocha_1.describe)('/groups.listAll', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('view-room-administration', ['admin']);
        }));
        (0, mocha_1.it)('should succeed if user has view-room-administration permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.listAll'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('groups').and.to.be.an('array');
            });
        }));
        (0, mocha_1.it)('should fail if the user doesnt have view-room-administration permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-room-administration', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.listAll'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('/groups.counters', () => {
        (0, mocha_1.it)('should return group counters', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.counters'))
                .set(api_data_1.credentials)
                .query({
                roomId: group._id,
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
    });
    (0, mocha_1.describe)('/groups.rename', () => __awaiter(void 0, void 0, void 0, function* () {
        let roomInfo;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            roomInfo = yield getRoomInfo(group._id);
        }));
        (0, mocha_1.it)('should return the group rename with an additional message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.rename'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                name: `EDITED${api_data_1.apiPrivateChannelName}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', `EDITED${api_data_1.apiPrivateChannelName}`);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.msgs', roomInfo.group.msgs + 1);
            });
        }));
    }));
    (0, mocha_1.describe)('/groups.getIntegrations', () => {
        let integrationCreatedByAnUser;
        let createdGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const resRoom = yield (0, rooms_helper_1.createRoom)({ name: `test-integration-group-${Date.now()}`, type: 'p' });
            createdGroup = resRoom.body.group;
            const user = yield (0, users_helper_1.createUser)();
            const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['user']),
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['user']),
            ]);
            integrationCreatedByAnUser = yield (0, integration_helper_1.createIntegration)({
                type: 'webhook-incoming',
                name: 'Incoming test',
                enabled: true,
                alias: 'test',
                username: 'rocket.cat',
                scriptEnabled: false,
                overrideDestinationChannelEnabled: true,
                channel: `#${createdGroup.name}`,
            }, userCredentials);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, integration_helper_1.removeIntegration)(integrationCreatedByAnUser._id, 'incoming');
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']),
                (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', ['admin']),
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']),
                (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', ['admin']),
            ]);
        }));
        (0, mocha_1.it)('should return the list of integrations of create group and it should contain the integration created by user when the admin DOES have the permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.getIntegrations'))
                .set(api_data_1.credentials)
                .query({
                roomId: createdGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const integrationCreated = res.body.integrations.find((createdIntegration) => createdIntegration._id === integrationCreatedByAnUser._id);
                chai_1.assert.isDefined(integrationCreated);
                (0, chai_1.expect)(integrationCreated).to.be.an('object');
                (0, chai_1.expect)(integrationCreated._id).to.be.equal(integrationCreatedByAnUser._id);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
        (0, mocha_1.it)('should return the list of integrations created by the user only', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']),
                (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []),
            ]);
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.getIntegrations'))
                .set(api_data_1.credentials)
                .query({
                roomId: createdGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const integrationCreated = res.body.integrations.find((createdIntegration) => createdIntegration._id === integrationCreatedByAnUser._id);
                (0, chai_1.expect)(integrationCreated).to.be.equal(undefined);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
        (0, mocha_1.it)('should return unauthorized error when the user does not have any integrations permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', []),
            ]);
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.getIntegrations'))
                .set(api_data_1.credentials)
                .query({
                roomId: createdGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('/groups.setReadOnly', () => {
        (0, mocha_1.it)('should set the group as read only', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setReadOnly'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                readOnly: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    mocha_1.describe.skip('/groups.leave', () => {
        (0, mocha_1.it)('should allow the user to leave the group', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.leave'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.setAnnouncement', () => {
        (0, mocha_1.it)('should set the announcement of the group with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setAnnouncement'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                announcement: 'this is an announcement of a group for api tests',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('announcement', 'this is an announcement of a group for api tests');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set the announcement of the group with an empty string(remove the announcement)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setAnnouncement'))
                .set(api_data_1.credentials)
                .send({
                roomId: group._id,
                announcement: '',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('announcement', '');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.setType', () => {
        let roomTypeId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `channel.type.${Date.now()}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                roomTypeId = res.body.group._id;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(api_data_1.credentials)
                .send({
                roomId: roomTypeId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should change the type of the group to a channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.setType'))
                .set(api_data_1.credentials)
                .send({
                roomId: roomTypeId,
                type: 'c',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'c');
            });
        }));
    });
    (0, mocha_1.describe)('/groups.setCustomFields', () => {
        let cfchannel;
        let groupWithoutCustomFields;
        (0, mocha_1.before)('create group with customFields', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field0: 'value0' };
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `channel.cf.${Date.now()}`,
                customFields,
            })
                .expect((res) => {
                cfchannel = res.body.group;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `channel.cf.${Date.now()}`,
            })
                .expect((res) => {
                groupWithoutCustomFields = res.body.group;
            });
        }));
        (0, mocha_1.after)('delete group with customFields', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: cfchannel.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: groupWithoutCustomFields.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('get customFields using groups.info', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: cfchannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field0', 'value0');
            })
                .end(done);
        });
        (0, mocha_1.it)('change customFields', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field9: 'value9' };
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomId: cfchannel._id,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', cfchannel.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field9', 'value9');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('group.customFields.field0', 'value0');
            });
        }));
        (0, mocha_1.it)('get customFields using groups.info', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: cfchannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field9', 'value9');
            })
                .end(done);
        });
        (0, mocha_1.it)('set customFields with one nested field', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field1: 'value1' };
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomId: groupWithoutCustomFields._id,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', groupWithoutCustomFields.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field1', 'value1');
            });
        }));
        (0, mocha_1.it)('set customFields with multiple nested fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field2: 'value2', field3: 'value3', field4: 'value4' };
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomName: groupWithoutCustomFields.name,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', groupWithoutCustomFields.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field2', 'value2');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field3', 'value3');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.customFields.field4', 'value4');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('group.customFields.field1', 'value1');
            });
        }));
        (0, mocha_1.it)('set customFields to empty object', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = {};
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomName: groupWithoutCustomFields.name,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('group.name', groupWithoutCustomFields.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('group.t', 'p');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('group.customFields.field2', 'value2');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('group.customFields.field3', 'value3');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('group.customFields.field4', 'value4');
            });
        }));
        (0, mocha_1.it)('set customFields as a string -> should return 400', (done) => {
            const customFields = '';
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomName: groupWithoutCustomFields.name,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.delete', () => {
        let testGroup;
        let testTeamGroup;
        let testModeratorTeamGroup;
        let invitedUser;
        let moderatorUser;
        let invitedUserCredentials;
        let moderatorUserCredentials;
        let teamId;
        let teamMainRoomId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testGroup = (yield (0, rooms_helper_1.createRoom)({ name: `group.test.${Date.now()}`, type: 'p' })).body.group;
            invitedUser = yield (0, users_helper_1.createUser)();
            moderatorUser = yield (0, users_helper_1.createUser)();
            invitedUserCredentials = yield (0, users_helper_1.login)(invitedUser.username, user_1.password);
            moderatorUserCredentials = yield (0, users_helper_1.login)(moderatorUser.username, user_1.password);
            const teamCreateRes = yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `team-${Date.now()}`,
                type: 1,
                members: [invitedUser.username, moderatorUser.username],
            });
            teamId = teamCreateRes.body.team._id;
            teamMainRoomId = teamCreateRes.body.team.roomId;
            yield (0, permissions_helper_1.updatePermission)('delete-team-group', ['owner', 'moderator']);
            yield (0, permissions_helper_1.updatePermission)('create-team-group', ['admin', 'owner', 'moderator', 'user']);
            const teamGroupResponse = yield (0, rooms_helper_1.createRoom)({
                name: `group.test.${Date.now()}`,
                type: 'p',
                extraData: { teamId },
                credentials: invitedUserCredentials,
            });
            testTeamGroup = teamGroupResponse.body.group;
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.addModerator'))
                .set(api_data_1.credentials)
                .send({
                userId: moderatorUser._id,
                roomId: teamMainRoomId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            const teamModeratorGroupResponse = yield (0, rooms_helper_1.createRoom)({
                name: `group.test.moderator.${Date.now()}`,
                type: 'p',
                extraData: { teamId },
                credentials: moderatorUserCredentials,
            });
            testModeratorTeamGroup = teamModeratorGroupResponse.body.group;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(invitedUser);
            yield (0, users_helper_1.deleteUser)(moderatorUser);
            yield (0, permissions_helper_1.updatePermission)('create-team-group', ['admin', 'owner', 'moderator']);
            yield (0, permissions_helper_1.updatePermission)('delete-team-group', ['admin', 'owner', 'moderator']);
        }));
        (0, mocha_1.it)('should succesfully delete a group', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: testGroup.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)(`should fail retrieving a group's info after it's been deleted`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('groups.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-room-not-found');
            });
        }));
        (0, mocha_1.it)(`should fail deleting a team's group when member does not have the necessary permission in the team`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(invitedUserCredentials)
                .send({
                roomName: testTeamGroup.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.a.property('error');
                (0, chai_1.expect)(res.body).to.have.a.property('errorType', 'error-not-allowed');
            });
        }));
        (0, mocha_1.it)(`should fail deleting a team's group when member has the necessary permission in the team, but not in the deleted room`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(moderatorUserCredentials)
                .send({
                roomName: testTeamGroup.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.a.property('error');
                (0, chai_1.expect)(res.body).to.have.a.property('errorType', 'error-room-not-found');
            });
        }));
        (0, mocha_1.it)(`should successfully delete a team's group when member has both team and group permissions`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(moderatorUserCredentials)
                .send({
                roomId: testModeratorTeamGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
    });
    (0, mocha_1.describe)('/groups.roles', () => {
        let testGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `group.roles.test.${Date.now()}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                testGroup = res.body.group;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: testGroup.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('/groups.invite', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('/groups.addModerator', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.addModerator'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('/groups.addLeader', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.addLeader'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of roles <-> user relationships in a private group', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.roles'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('roles').that.is.an('array').that.has.lengthOf(2);
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('rid').that.is.equal(testGroup._id);
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('roles').that.is.an('array').that.includes('moderator', 'leader');
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('u').that.is.an('object');
                (0, chai_1.expect)(res.body.roles[0].u).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[0].u).to.have.a.property('username').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('rid').that.is.equal(testGroup._id);
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('roles').that.is.an('array').that.includes('owner');
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('u').that.is.an('object');
                (0, chai_1.expect)(res.body.roles[1].u).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[1].u).to.have.a.property('username').that.is.a('string');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.moderators', () => {
        let testGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `group.roles.test.${Date.now()}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                testGroup = res.body.group;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: testGroup.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('/groups.invite', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('/groups.addModerator', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.addModerator'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of moderators with rocket.cat as a moderator', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.moderators'))
                .set(api_data_1.credentials)
                .query({
                roomId: testGroup._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('moderators').that.is.an('array').that.has.lengthOf(1);
                (0, chai_1.expect)(res.body.moderators[0].username).to.be.equal('rocket.cat');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/groups.setEncrypted', () => {
        let testGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({
                name: `group.encrypted.test.${Date.now()}`,
            })
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('group._id');
                testGroup = res.body.group;
            });
            yield (0, permissions_helper_1.updateSetting)('E2E_Enable', true);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('E2E_Enable', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: testGroup.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.it)('should return an error when passing no boolean param', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setEncrypted'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                encrypted: 'no-boolean',
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'The bodyParam "encrypted" is required');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set group as encrypted correctly and return the new data', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setEncrypted'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                encrypted: true,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('group');
                (0, chai_1.expect)(res.body.group).to.have.property('_id', testGroup._id);
                (0, chai_1.expect)(res.body.group).to.have.property('encrypted', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the updated room encrypted', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = yield getRoomInfo(testGroup._id);
            (0, chai_1.expect)(roomInfo).to.have.a.property('success', true);
            (0, chai_1.expect)(roomInfo.group).to.have.a.property('_id', testGroup._id);
            (0, chai_1.expect)(roomInfo.group).to.have.a.property('encrypted', true);
        }));
        (0, mocha_1.it)('should set group as unencrypted correctly and return the new data', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.setEncrypted'))
                .set(api_data_1.credentials)
                .send({
                roomId: testGroup._id,
                encrypted: false,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('group');
                (0, chai_1.expect)(res.body.group).to.have.property('_id', testGroup._id);
                (0, chai_1.expect)(res.body.group).to.have.property('encrypted', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the updated room unencrypted', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = yield getRoomInfo(testGroup._id);
            (0, chai_1.expect)(roomInfo).to.have.a.property('success', true);
            (0, chai_1.expect)(roomInfo.group).to.have.a.property('_id', testGroup._id);
            (0, chai_1.expect)(roomInfo.group).to.have.a.property('encrypted', false);
        }));
    });
    (0, mocha_1.describe)('/groups.convertToTeam', () => {
        let newGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({ name: `group-${Date.now()}` })
                .expect(200)
                .expect((response) => {
                newGroup = response.body.group;
            });
        }));
        (0, mocha_1.after)(() => {
            chai_1.assert.isDefined(newGroup.name);
            return Promise.all([(0, teams_helper_1.deleteTeam)(api_data_1.credentials, newGroup.name), (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user'])]);
        });
        (0, mocha_1.it)('should fail to convert group if lacking edit-room permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('create-team', []).then(() => {
                void (0, permissions_helper_1.updatePermission)('edit-room', ['admin']).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('groups.convertToTeam'))
                        .set(api_data_1.credentials)
                        .send({ roomId: newGroup._id })
                        .expect(403)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should fail to convert group if lacking create-team permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('create-team', ['admin']).then(() => {
                void (0, permissions_helper_1.updatePermission)('edit-room', []).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('groups.convertToTeam'))
                        .set(api_data_1.credentials)
                        .send({ roomId: newGroup._id })
                        .expect(403)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should successfully convert a group to a team', (done) => {
            void (0, permissions_helper_1.updatePermission)('create-team', ['admin']).then(() => {
                void (0, permissions_helper_1.updatePermission)('edit-room', ['admin']).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('groups.convertToTeam'))
                        .set(api_data_1.credentials)
                        .send({ roomId: newGroup._id })
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should fail to convert group without the required parameters', (done) => {
            void api_data_1.request.post((0, api_data_1.api)('groups.convertToTeam')).set(api_data_1.credentials).send({}).expect(400).end(done);
        });
        (0, mocha_1.it)("should fail to convert group if it's already taken", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('groups.convertToTeam'))
                .set(api_data_1.credentials)
                .send({ roomId: newGroup._id })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)("Setting: 'Use Real Name': true", () => {
        let realNameGroup;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', true);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.create'))
                .set(api_data_1.credentials)
                .send({ name: `group-${Date.now()}` })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                realNameGroup = res.body.group;
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid: realNameGroup._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('groups.delete'))
                .set(api_data_1.credentials)
                .send({ roomId: realNameGroup._id })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return the last message user real name', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('groups.info'))
                .query({
                roomId: realNameGroup._id,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const { group } = res.body;
                (0, chai_1.expect)(group._id).to.be.equal(realNameGroup._id);
                (0, chai_1.expect)(group).to.have.nested.property('lastMessage.u.name', 'RocketChat Internal Admin Test');
            })
                .end(done);
        });
    });
});
