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
            .get((0, api_data_1.api)('channels.info'))
            .set(api_data_1.credentials)
            .query({
            roomId,
        })
            .end((_err, req) => {
            resolve(req.body);
        });
    });
}
(0, mocha_1.describe)('[Channels]', () => {
    let channel;
    const apiPublicChannelName = `api-channel-test-${Date.now()}`;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)('Creating channel', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.create'))
            .set(api_data_1.credentials)
            .send({
            name: apiPublicChannelName,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', apiPublicChannelName);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', 0);
            channel = {
                _id: res.body.channel._id,
                name: res.body.channel.name,
            };
        })
            .end(done);
    });
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channel._id });
    }));
    (0, mocha_1.it)('/channels.invite', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        return api_data_1.request
            .post((0, api_data_1.api)('channels.invite'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', apiPublicChannelName);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
        });
    }));
    (0, mocha_1.it)('/channels.addModerator', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addModerator'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.addModerator should fail with missing room Id', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addModerator'))
            .set(api_data_1.credentials)
            .send({
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.addModerator should fail with missing user Id', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addModerator'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.removeModerator', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.removeModerator'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.removeModerator should fail on invalid room id', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.removeModerator'))
            .set(api_data_1.credentials)
            .send({
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.removeModerator should fail on invalid user id', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.removeModerator'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.addOwner', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addOwner'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.removeOwner', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.removeOwner'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.kick', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        return api_data_1.request
            .post((0, api_data_1.api)('channels.kick'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', apiPublicChannelName);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
        });
    }));
    (0, mocha_1.it)('/channels.invite', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        return api_data_1.request
            .post((0, api_data_1.api)('channels.invite'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', apiPublicChannelName);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
        });
    }));
    (0, mocha_1.it)('/channels.addOwner', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addOwner'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.archive', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.archive'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.unarchive', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.unarchive'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.close', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.close'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.close', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.close'))
            .set(api_data_1.credentials)
            .send({
            roomName: apiPublicChannelName,
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', `The channel, ${apiPublicChannelName}, is already closed to the sender`);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.open', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.open'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.describe)('/channels.list', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']);
            yield (0, permissions_helper_1.updatePermission)('view-joined-room', ['guest', 'bot', 'app', 'anonymous']);
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channels.messages.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']);
            yield (0, permissions_helper_1.updatePermission)('view-joined-room', ['guest', 'bot', 'app', 'anonymous']);
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('should succesfully return a list of channels', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('channels').that.is.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
        (0, mocha_1.it)('should correctly filter channel by id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.list'))
                .set(api_data_1.credentials)
                .query({
                _id: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('channels').that.is.an('array').of.length(1);
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
        (0, mocha_1.it)('should not be succesful when user does NOT have the permission to view channels or joined rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', []);
            yield (0, permissions_helper_1.updatePermission)('view-joined-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should be succesful when user does NOT have the permission to view channels, but can view joined rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', []);
            yield (0, permissions_helper_1.updatePermission)('view-joined-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('channels').that.is.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
        (0, mocha_1.it)('should be succesful when user does NOT have the permission to view joined rooms, but can view channels', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('view-joined-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('channels').that.is.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
    });
    (0, mocha_1.it)('/channels.list.joined', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('channels.list.joined'))
            .set(api_data_1.credentials)
            .query({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('count');
            (0, chai_1.expect)(res.body).to.have.property('total');
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.counters', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('channels.counters'))
            .set(api_data_1.credentials)
            .query({
            roomId: channel._id,
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
    (0, mocha_1.it)('/channels.rename', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        function failRenameChannel(name) {
            (0, mocha_1.it)(`should not rename a channel to the reserved name ${name}`, (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('channels.rename'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: channel._id,
                    name,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', `${name} is already in use :( [error-field-unavailable]`);
                })
                    .end(done);
            });
        }
        api_data_1.reservedWords.forEach((name) => {
            failRenameChannel(name);
        });
        return api_data_1.request
            .post((0, api_data_1.api)('channels.rename'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            name: `EDITED${apiPublicChannelName}`,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', `EDITED${apiPublicChannelName}`);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
        });
    }));
    (0, mocha_1.it)('/channels.addAll', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addAll'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', `EDITED${apiPublicChannelName}`);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.addLeader', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.addLeader'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.a.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.removeLeader', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.removeLeader'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            userId: 'rocket.cat',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .end(done);
    });
    (0, mocha_1.it)('/channels.setJoinCode', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        return api_data_1.request
            .post((0, api_data_1.api)('channels.setJoinCode'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            joinCode: '123',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', `EDITED${apiPublicChannelName}`);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs);
        });
    }));
    (0, mocha_1.it)('/channels.setReadOnly', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        return api_data_1.request
            .post((0, api_data_1.api)('channels.setReadOnly'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
            readOnly: true,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', `EDITED${apiPublicChannelName}`);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
        });
    }));
    (0, mocha_1.it)('/channels.leave', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = yield getRoomInfo(channel._id);
        return api_data_1.request
            .post((0, api_data_1.api)('channels.leave'))
            .set(api_data_1.credentials)
            .send({
            roomId: channel._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', `EDITED${apiPublicChannelName}`);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
        });
    }));
    (0, mocha_1.describe)('[/channels.create]', () => {
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
            yield (0, permissions_helper_1.updatePermission)('create-team-channel', ['owner']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(guestUser);
            yield (0, users_helper_1.deleteUser)(invitedUser);
            yield (0, permissions_helper_1.updatePermission)('create-team-channel', ['admin', 'owner', 'moderator']);
        }));
        (0, mocha_1.it)(`should fail when trying to use an existing room's name`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
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
                const channelIds = (yield Promise.all(promises)).map((r) => r.body.channel).map((channel) => channel._id);
                void api_data_1.request
                    .post((0, api_data_1.api)('channels.create'))
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
                        (0, chai_1.expect)(res.body.members).to.have.lengthOf(1);
                    });
                });
                yield Promise.all(channelIds.map((id) => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: id })));
            });
        });
        (0, mocha_1.it)('should successfully create a channel in a team', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: `team-channel-${Date.now()}`,
                extraData: { teamId },
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('channel');
                (0, chai_1.expect)(res.body.channel).to.have.property('teamId', teamId);
            });
        }));
        (0, mocha_1.it)('should fail creating a channel in a team when member does not have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(invitedUserCredentials)
                .send({
                name: `team-channel-${Date.now()}`,
                extraData: { teamId },
            })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'unauthorized');
            });
        }));
    });
    (0, mocha_1.describe)('[/channels.info]', () => {
        const testChannelName = `api-channel-test-${Date.now()}`;
        let testChannel;
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('creating new channel...', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: testChannelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                testChannel = res.body.channel;
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail to create the same channel twice', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: testChannelName,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.contain('error-duplicate-channel-name');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return channel basic structure', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', testChannelName);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', 0);
            })
                .end(done);
        });
        let channelMessage;
        (0, mocha_1.it)('sending a message...', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid: testChannel._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                channelMessage = res.body.message;
            })
                .end(done);
        });
        (0, mocha_1.it)('REACTing with last message', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('chat.react'))
                .set(api_data_1.credentials)
                .send({
                emoji: ':squid:',
                messageId: channelMessage._id,
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
                messageId: channelMessage._id,
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
                messageId: channelMessage._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return channel structure with "lastMessage" object including pin, reactions and star(should be an array) infos', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('channel').and.to.be.an('object');
                const { channel } = res.body;
                (0, chai_1.expect)(channel).to.have.property('lastMessage').and.to.be.an('object');
                (0, chai_1.expect)(channel.lastMessage).to.have.property('reactions').and.to.be.an('object');
                (0, chai_1.expect)(channel.lastMessage).to.have.property('pinned').and.to.be.a('boolean');
                (0, chai_1.expect)(channel.lastMessage).to.have.property('pinnedAt').and.to.be.a('string');
                (0, chai_1.expect)(channel.lastMessage).to.have.property('pinnedBy').and.to.be.an('object');
                (0, chai_1.expect)(channel.lastMessage).to.have.property('starred').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all channels messages where the last message of array should have the "star" array with USERS star ONLY', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                var _a;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array');
                const messages = res.body.messages;
                const lastMessage = messages.filter((message) => message._id === channelMessage._id)[0];
                (0, chai_1.expect)(lastMessage).to.have.property('starred').and.to.be.an('array');
                (0, chai_1.expect)((_a = lastMessage.starred) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(user_1.adminUsername);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return all channels messages where the last message of array should have the "star" array with USERS star ONLY even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
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
                const lastMessage = messages.filter((message) => message._id === channelMessage._id)[0];
                (0, chai_1.expect)(lastMessage).to.have.property('starred').and.to.be.an('array');
                (0, chai_1.expect)((_a = lastMessage.starred) === null || _a === void 0 ? void 0 : _a[0]._id).to.be.equal(user_1.adminUsername);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/channels.online]', () => {
        const createdChannels = [];
        const createdUsers = [];
        const createUserAndChannel = () => __awaiter(void 0, void 0, void 0, function* () {
            const testUser = yield (0, users_helper_1.createUser)();
            const testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            createdUsers.push(testUser);
            yield api_data_1.request.post((0, api_data_1.api)('users.setStatus')).set(testUserCredentials).send({
                message: '',
                status: 'online',
            });
            const roomName = `group-test-${Date.now()}`;
            const roomResponse = yield (0, rooms_helper_1.createRoom)({
                name: roomName,
                type: 'c',
                members: [testUser.username],
            });
            createdChannels.push(roomResponse.body.channel);
            return {
                testUser,
                testUserCredentials,
                room: roomResponse.body.channel,
            };
        });
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                createdUsers.map((user) => (0, users_helper_1.deleteUser)(user)),
                createdChannels.map((channel) => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channel._id })),
            ]);
        }));
        (0, mocha_1.it)('should return an error if no query', () => void api_data_1.request
            .get((0, api_data_1.api)('channels.online'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid query');
        }));
        (0, mocha_1.it)('should return an error if passing an empty query', () => void api_data_1.request
            .get((0, api_data_1.api)('channels.online'))
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
            return api_data_1.request
                .get((0, api_data_1.api)('channels.online'))
                .set(testUserCredentials)
                .query({ _id: room._id })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('online');
                const expected = {
                    _id: testUser._id,
                    username: testUser.username,
                };
                (0, chai_1.expect)(res.body.online).to.deep.include(expected);
            });
        }));
        (0, mocha_1.it)('should return an empty array if requesting user is not in channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const outsider = yield (0, users_helper_1.createUser)();
            const outsiderCredentials = yield (0, users_helper_1.login)(outsider.username, user_1.password);
            const { testUser, room } = yield createUserAndChannel();
            return api_data_1.request
                .get((0, api_data_1.api)('channels.online'))
                .set(outsiderCredentials)
                .query({ _id: room._id })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('online');
                const expected = {
                    _id: testUser._id,
                    username: testUser.username,
                };
                (0, chai_1.expect)(res.body.online).to.deep.include(expected);
            });
        }));
    });
    (0, mocha_1.describe)('[/channels.files]', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, uploads_helper_1.testFileUploads)('channels.files', 'c');
    }));
    (0, mocha_1.describe)('[/channels.join]', () => {
        let testChannelNoCode;
        let testChannelWithCode;
        let testUser;
        let testUserCredentials;
        (0, mocha_1.before)('Create test user', () => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            testChannelNoCode = (yield (0, rooms_helper_1.createRoom)({ type: 'c', credentials: testUserCredentials, name: `${apiPublicChannelName}-nojoincode` }))
                .body.channel;
            testChannelWithCode = (yield (0, rooms_helper_1.createRoom)({ type: 'c', credentials: testUserCredentials, name: `${apiPublicChannelName}-withjoincode` })).body.channel;
            yield (0, permissions_helper_1.updatePermission)('edit-room', ['admin', 'owner', 'moderator']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannelNoCode._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannelWithCode._id }),
                (0, users_helper_1.deleteUser)(testUser),
                (0, permissions_helper_1.updatePermission)('edit-room', ['admin', 'owner', 'moderator']),
                (0, permissions_helper_1.updatePermission)('join-without-join-code', ['admin', 'bot', 'app']),
            ]);
        }));
        (0, mocha_1.before)('Set code for channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setJoinCode'))
                .set(testUserCredentials)
                .send({
                roomId: testChannelWithCode._id,
                joinCode: '123',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if invalid channel', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.join'))
                .set(api_data_1.credentials)
                .send({
                roomId: 'invalid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-room-not-found');
            })
                .end(done);
        });
        (0, mocha_1.describe)('code-free channel', () => {
            (0, mocha_1.it)('should succeed when joining code-free channel without join code', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('channels.join'))
                    .set(api_data_1.credentials)
                    .send({
                    roomId: testChannelNoCode._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('channel._id', testChannelNoCode._id);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('code-needed channel', () => {
            (0, mocha_1.describe)('without join-without-join-code permission', () => {
                (0, mocha_1.before)('set join-without-join-code permission to false', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updatePermission)('join-without-join-code', []);
                }));
                (0, mocha_1.it)('should fail when joining code-needed channel without join code and no join-without-join-code permission', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('channels.join'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannelWithCode._id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.nested.property('errorType', 'error-code-required');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should fail when joining code-needed channel with incorrect join code and no join-without-join-code permission', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('channels.join'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannelWithCode._id,
                        joinCode: 'WRONG_CODE',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body).to.have.nested.property('errorType', 'error-code-invalid');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should succeed when joining code-needed channel with join code', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('channels.join'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannelWithCode._id,
                        joinCode: '123',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.nested.property('channel._id', testChannelWithCode._id);
                    })
                        .end(done);
                });
            });
            (0, mocha_1.describe)('with join-without-join-code permission', () => {
                (0, mocha_1.before)('set join-without-join-code permission to true', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, permissions_helper_1.updatePermission)('join-without-join-code', ['admin']);
                }));
                (0, mocha_1.before)('leave channel', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('channels.leave'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannelWithCode._id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should succeed when joining code-needed channel without join code and with join-without-join-code permission', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('channels.join'))
                        .set(api_data_1.credentials)
                        .send({
                        roomId: testChannelWithCode._id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.nested.property('channel._id', testChannelWithCode._id);
                    })
                        .end(done);
                });
            });
        });
    });
    (0, mocha_1.describe)('/channels.setDescription', () => {
        (0, mocha_1.it)('should set the description of the channel with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setDescription'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
        (0, mocha_1.it)('should set the description of the channel with an empty string(remove the description)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setDescription'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
    (0, mocha_1.describe)('/channels.setTopic', () => {
        (0, mocha_1.it)('should set the topic of the channel with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setTopic'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
        (0, mocha_1.it)('should set the topic of the channel with an empty string(remove the topic)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setTopic'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
    (0, mocha_1.describe)('/channels.setAnnouncement', () => {
        (0, mocha_1.it)('should set the announcement of the channel with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setAnnouncement'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
                announcement: 'this is an announcement of a channel for api tests',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('announcement', 'this is an announcement of a channel for api tests');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set the announcement of the channel with an empty string(remove the announcement)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setAnnouncement'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
    (0, mocha_1.describe)('/channels.setPurpose', () => {
        (0, mocha_1.it)('should set the purpose of the channel with a string', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setPurpose'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
        (0, mocha_1.it)('should set the announcement of channel with an empty string(remove the purpose)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setPurpose'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
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
    (0, mocha_1.describe)('/channels.history', () => {
        (0, mocha_1.it)('should return an array of members by channel', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.history'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of members by channel even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.history'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
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
    (0, mocha_1.describe)('/channels.members', () => {
        let testUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            yield (0, permissions_helper_1.updateSetting)('Accounts_SearchFields', 'username, name, bio, nickname');
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
                userId: testUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([(0, permissions_helper_1.updateSetting)('Accounts_SearchFields', 'username, name, bio, nickname'), (0, users_helper_1.deleteUser)(testUser)]);
        }));
        (0, mocha_1.it)('should return an array of members by channel', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of members by channel even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an filtered array of members by channel', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.members'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
                filter: testUser.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('members').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count', 1);
                (0, chai_1.expect)(res.body.members[0]._id).to.be.equal(testUser._id);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('offset');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/channels.getIntegrations', () => {
        let integrationCreatedByAnUser;
        let userCredentials;
        let createdChannel;
        let user;
        (0, mocha_1.before)((done) => {
            void (0, rooms_helper_1.createRoom)({ name: `test-integration-channel-${Date.now()}`, type: 'c' }).end((_err, res) => {
                createdChannel = res.body.channel;
                void (0, users_helper_1.createUser)().then((createdUser) => {
                    user = createdUser;
                    void (0, users_helper_1.login)(user.username, user_1.password).then((credentials) => {
                        userCredentials = credentials;
                        void (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['user']).then(() => {
                            void (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['user']).then(() => {
                                void (0, integration_helper_1.createIntegration)({
                                    type: 'webhook-incoming',
                                    name: 'Incoming test',
                                    enabled: true,
                                    alias: 'test',
                                    username: 'rocket.cat',
                                    scriptEnabled: false,
                                    overrideDestinationChannelEnabled: true,
                                    channel: `#${createdChannel.name}`,
                                }, userCredentials).then((integration) => {
                                    integrationCreatedByAnUser = integration;
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: createdChannel._id }),
                (0, integration_helper_1.removeIntegration)(integrationCreatedByAnUser._id, 'incoming'),
                (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']),
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']),
                (0, users_helper_1.deleteUser)(user),
            ]);
        }));
        (0, mocha_1.it)('should return the list of integrations of created channel and it should contain the integration created by user when the admin DOES have the permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.getIntegrations'))
                .set(api_data_1.credentials)
                .query({
                roomId: createdChannel._id,
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
            yield (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('manage-incoming-integrations', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.getIntegrations'))
                .set(api_data_1.credentials)
                .query({
                roomId: createdChannel._id,
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
                (0, permissions_helper_1.updatePermission)('manage-own-incoming-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-outgoing-integrations', []),
                (0, permissions_helper_1.updatePermission)('manage-own-outgoing-integrations', []),
            ]);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.getIntegrations'))
                .set(api_data_1.credentials)
                .query({
                roomId: createdChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('/channels.setCustomFields:', () => {
        let withCFChannel;
        let withoutCFChannel;
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: withCFChannel._id });
        }));
        (0, mocha_1.it)('create channel with customFields', (done) => {
            const customFields = { field0: 'value0' };
            void api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: `channel.cf.${Date.now()}`,
                customFields,
            })
                .end((_err, res) => {
                withCFChannel = res.body.channel;
                done();
            });
        });
        (0, mocha_1.it)('get customFields using channels.info', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: withCFChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field0', 'value0');
            })
                .end(done);
        });
        (0, mocha_1.it)('change customFields', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field9: 'value9' };
            return api_data_1.request
                .post((0, api_data_1.api)('channels.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomId: withCFChannel._id,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', withCFChannel.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field9', 'value9');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('channel.customFields.field0', 'value0');
            });
        }));
        (0, mocha_1.it)('get customFields using channels.info', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: withCFChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field9', 'value9');
            })
                .end(done);
        });
        (0, mocha_1.it)('delete channels with customFields', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: withCFChannel.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('create channel without customFields', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: `channel.cf.${Date.now()}`,
            })
                .end((_err, res) => {
                withoutCFChannel = res.body.channel;
                done();
            });
        });
        (0, mocha_1.it)('set customFields with one nested field', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field1: 'value1' };
            return api_data_1.request
                .post((0, api_data_1.api)('channels.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomId: withoutCFChannel._id,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', withoutCFChannel.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field1', 'value1');
            });
        }));
        (0, mocha_1.it)('set customFields with multiple nested fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const customFields = { field2: 'value2', field3: 'value3', field4: 'value4' };
            return api_data_1.request
                .post((0, api_data_1.api)('channels.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomName: withoutCFChannel.name,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', withoutCFChannel.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field2', 'value2');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field3', 'value3');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.customFields.field4', 'value4');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('channel.customFields.field1', 'value1');
            });
        }));
        (0, mocha_1.it)('set customFields to empty object', (done) => {
            const customFields = {};
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomName: withoutCFChannel.name,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', withoutCFChannel.name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('channel.customFields.field2', 'value2');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('channel.customFields.field3', 'value3');
                (0, chai_1.expect)(res.body).to.have.not.nested.property('channel.customFields.field4', 'value4');
            })
                .end(done);
        });
        (0, mocha_1.it)('set customFields as a string -> should return 400', (done) => {
            const customFields = '';
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setCustomFields'))
                .set(api_data_1.credentials)
                .send({
                roomName: withoutCFChannel.name,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('delete channel with empty customFields', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: withoutCFChannel.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/channels.setDefault', () => {
        let testChannel;
        const name = `setDefault-${Date.now()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('should set channel as default', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = yield getRoomInfo(testChannel._id);
            return api_data_1.request
                .post((0, api_data_1.api)('channels.setDefault'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                default: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.default', true);
            });
        }));
        (0, mocha_1.it)('should unset channel as default', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = yield getRoomInfo(testChannel._id);
            return api_data_1.request
                .post((0, api_data_1.api)('channels.setDefault'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                default: false,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.default', false);
            });
        }));
    });
    (0, mocha_1.describe)('/channels.setType', () => {
        let testChannel;
        const name = `setType-${Date.now()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('should change the type public channel to private', () => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = yield getRoomInfo(testChannel._id);
            void api_data_1.request
                .post((0, api_data_1.api)('channels.setType'))
                .set(api_data_1.credentials)
                .send({
                roomId: channel._id,
                type: 'p',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'p');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', roomInfo.channel.msgs + 1);
            });
        }));
    });
    (0, mocha_1.describe)('/channels.delete', () => {
        let testChannel;
        let testTeamChannel;
        let testModeratorTeamChannel;
        let invitedUser;
        let moderatorUser;
        let invitedUserCredentials;
        let moderatorUserCredentials;
        let teamId;
        let teamMainRoomId;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ name: `channel.test.${Date.now()}`, type: 'c' })).body.channel;
            invitedUser = yield (0, users_helper_1.createUser)();
            moderatorUser = yield (0, users_helper_1.createUser)();
            invitedUserCredentials = yield (0, users_helper_1.login)(invitedUser.username, user_1.password);
            moderatorUserCredentials = yield (0, users_helper_1.login)(moderatorUser.username, user_1.password);
            yield (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']);
            const teamCreateRes = yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `team-${Date.now()}`,
                type: 0,
                members: [invitedUser.username, moderatorUser.username],
            });
            teamId = teamCreateRes.body.team._id;
            teamMainRoomId = teamCreateRes.body.team.roomId;
            yield (0, permissions_helper_1.updatePermission)('delete-team-channel', ['owner', 'moderator']);
            yield (0, permissions_helper_1.updatePermission)('create-team-channel', ['admin', 'owner', 'moderator', 'user']);
            const teamChannelResponse = yield (0, rooms_helper_1.createRoom)({
                name: `channel.test.${Date.now()}`,
                type: 'c',
                extraData: { teamId },
                credentials: invitedUserCredentials,
            });
            testTeamChannel = teamChannelResponse.body.channel;
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.addModerator'))
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
            const teamModeratorChannelResponse = yield (0, rooms_helper_1.createRoom)({
                name: `channel.test.moderator.${Date.now()}`,
                type: 'c',
                extraData: { teamId },
                credentials: moderatorUserCredentials,
            });
            testModeratorTeamChannel = teamModeratorChannelResponse.body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(invitedUser);
            yield (0, users_helper_1.deleteUser)(moderatorUser);
            yield (0, permissions_helper_1.updatePermission)('create-team-channel', ['admin', 'owner', 'moderator']);
            yield (0, permissions_helper_1.updatePermission)('delete-team-channel', ['admin', 'owner', 'moderator']);
        }));
        (0, mocha_1.it)('should succesfully delete a channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(api_data_1.credentials)
                .send({
                roomName: testChannel.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)(`should fail retrieving a channel's info after it's been deleted`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-room-not-found');
            });
        }));
        (0, mocha_1.it)(`should fail deleting a team's channel when member does not have the necessary permission in the team`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(invitedUserCredentials)
                .send({
                roomName: testTeamChannel.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.a.property('error');
                (0, chai_1.expect)(res.body).to.have.a.property('errorType');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-not-allowed');
            });
        }));
        (0, mocha_1.it)(`should fail deleting a team's channel when member has the necessary permission in the team, but not in the deleted room`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(moderatorUserCredentials)
                .send({
                roomName: testTeamChannel.name,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.a.property('error');
                (0, chai_1.expect)(res.body).to.have.a.property('errorType');
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-not-allowed');
            });
        }));
        (0, mocha_1.it)(`should successfully delete a team's channel when member has both team and channel permissions`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.delete'))
                .set(moderatorUserCredentials)
                .send({
                roomId: testModeratorTeamChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
    });
    (0, mocha_1.describe)('/channels.getAllUserMentionsByChannel', () => {
        (0, mocha_1.it)('should return an array of mentions by channel', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.getAllUserMentionsByChannel'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('mentions').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of mentions by channel even requested with count and offset params', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.getAllUserMentionsByChannel'))
                .set(api_data_1.credentials)
                .query({
                roomId: channel._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('mentions').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/channels.roles', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.roles.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('/channels.invite', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('/channels.addModerator', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.addModerator'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('/channels.addLeader', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.addLeader'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of role <-> user relationships in a channel', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.roles'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                (0, chai_1.expect)(res.body).to.have.a.property('roles').that.is.an('array').that.has.lengthOf(2);
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('rid').that.is.equal(testChannel._id);
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('roles').that.is.an('array').that.includes('moderator', 'leader');
                (0, chai_1.expect)(res.body.roles[0]).to.have.a.property('u').that.is.an('object');
                (0, chai_1.expect)(res.body.roles[0].u).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[0].u).to.have.a.property('username').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('rid').that.is.equal(testChannel._id);
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('roles').that.is.an('array').that.includes('owner');
                (0, chai_1.expect)(res.body.roles[1]).to.have.a.property('u').that.is.an('object');
                (0, chai_1.expect)(res.body.roles[1].u).to.have.a.property('_id').that.is.a('string');
                (0, chai_1.expect)(res.body.roles[1].u).to.have.a.property('username').that.is.a('string');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('/channels.moderators', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.moderators.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('/channels.invite', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.invite'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('/channels.addModerator', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.addModerator'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
                userId: 'rocket.cat',
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array of moderators with rocket.cat as a moderator', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.moderators'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
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
    (0, mocha_1.describe)('/channels.anonymousread', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.anonymousread.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([(0, permissions_helper_1.updateSetting)('Accounts_AllowAnonymousRead', false), (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id })]);
        }));
        (0, mocha_1.it)('should return an error when the setting "Accounts_AllowAnonymousRead" is disabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_AllowAnonymousRead', false).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('channels.anonymousread'))
                    .query({
                    roomId: testChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.a.property('error');
                    (0, chai_1.expect)(res.body).to.have.a.property('errorType');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-not-allowed');
                    (0, chai_1.expect)(res.body.error).to.be.equal('Enable "Allow Anonymous Read" [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return the messages list when the setting "Accounts_AllowAnonymousRead" is enabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_AllowAnonymousRead', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('channels.anonymousread'))
                    .query({
                    roomId: testChannel._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('messages').that.is.an('array');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return the messages list when the setting "Accounts_AllowAnonymousRead" is enabled even requested with count and offset params', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_AllowAnonymousRead', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('channels.anonymousread'))
                    .query({
                    roomId: testChannel._id,
                    count: 5,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.a.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.a.property('messages').that.is.an('array');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('/channels.convertToTeam', () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.convertToTeam.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            chai_1.assert.isDefined(testChannel.name);
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']),
                (0, permissions_helper_1.updatePermission)('edit-room', ['admin', 'owner', 'moderator']),
                (0, teams_helper_1.deleteTeam)(api_data_1.credentials, testChannel.name),
            ]);
        }));
        (0, mocha_1.it)('should fail to convert channel if lacking create-team permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('create-team', []);
            yield (0, permissions_helper_1.updatePermission)('edit-room', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.convertToTeam'))
                .set(api_data_1.credentials)
                .send({ channelId: testChannel._id })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', false);
            });
        }));
        (0, mocha_1.it)('should fail to convert channel if lacking edit-room permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('create-team', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('edit-room', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.convertToTeam'))
                .set(api_data_1.credentials)
                .send({ channelId: testChannel._id })
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', false);
            });
        }));
        (0, mocha_1.it)(`should return an error when the channel's name and id are sent as parameter`, (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.convertToTeam'))
                .set(api_data_1.credentials)
                .send({
                channelName: testChannel.name,
                channelId: testChannel._id,
            })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').include(`must match exactly one schema in oneOf`);
            })
                .end(done);
        });
        (0, mocha_1.it)(`should successfully convert a channel to a team when the channel's id is sent as parameter`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('create-team', ['admin']);
            yield (0, permissions_helper_1.updatePermission)('edit-room', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.convertToTeam'))
                .set(api_data_1.credentials)
                .send({ channelId: testChannel._id })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            });
        }));
        (0, mocha_1.it)(`should successfully convert a channel to a team when the channel's name is sent as parameter`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.convertToChannel'))
                .set(api_data_1.credentials)
                .send({ teamName: testChannel.name })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.convertToTeam'))
                .set(api_data_1.credentials)
                .send({ channelName: testChannel.name })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', true);
            });
        }));
        (0, mocha_1.it)('should fail to convert channel without the required parameters', (done) => {
            void api_data_1.request.post((0, api_data_1.api)('channels.convertToTeam')).set(api_data_1.credentials).send({}).expect(400).end(done);
        });
        (0, mocha_1.it)("should fail to convert channel if it's already taken", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.convertToTeam'))
                .set(api_data_1.credentials)
                .send({ channelId: testChannel._id })
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.a.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)("Setting: 'Use Real Name': true", () => {
        let testChannel;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.anonymousread.test.${Date.now()}` })).body.channel;
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', true);
            yield api_data_1.request
                .post((0, api_data_1.api)('channels.join'))
                .set(api_data_1.credentials)
                .send({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id', testChannel._id);
            });
            yield api_data_1.request
                .post((0, api_data_1.api)('chat.sendMessage'))
                .set(api_data_1.credentials)
                .send({
                message: {
                    text: 'Sample message',
                    rid: testChannel._id,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, permissions_helper_1.updateSetting)('Accounts_AllowAnonymousRead', false),
                (0, permissions_helper_1.updateSetting)('UI_Use_Real_Name', false),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
            ]);
        }));
        (0, mocha_1.it)('should return the last message user real name', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .query({
                roomId: testChannel._id,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                const { channel } = res.body;
                (0, chai_1.expect)(channel._id).to.be.equal(testChannel._id);
                (0, chai_1.expect)(channel).to.have.nested.property('lastMessage.u.name', 'RocketChat Internal Admin Test');
            })
                .end(done);
        });
        (0, mocha_1.it)('/channels.list.joined', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.list.joined'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('channels').and.to.be.an('array');
                const retChannel = res.body.channels.find(({ _id }) => _id === testChannel._id);
                (0, chai_1.expect)(retChannel).to.have.nested.property('lastMessage.u.name', 'RocketChat Internal Admin Test');
            })
                .end(done);
        });
        (0, mocha_1.it)('/channels.list.join should return empty list when member of no group', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            const newCreds = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.list.joined'))
                .set(newCreds)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count').that.is.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('total').that.is.equal(0);
                (0, chai_1.expect)(res.body).to.have.property('channels').and.to.be.an('array').and.that.has.lengthOf(0);
            });
        }));
    });
    (0, mocha_1.describe)('[/channels.messages]', () => {
        let testChannel;
        let emptyChannel;
        let firstUser;
        let secondUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']);
            emptyChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channels.messages.empty.test.${Date.now()}` })).body.channel;
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channels.messages.test.${Date.now()}` })).body.channel;
            firstUser = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            secondUser = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            const messages = [
                {
                    rid: testChannel._id,
                    msg: `@${firstUser.username} youre being mentioned`,
                    mentions: [{ username: firstUser.username, _id: firstUser._id, name: firstUser.name }],
                },
                {
                    rid: testChannel._id,
                    msg: `@${secondUser.username} youre being mentioned`,
                    mentions: [{ username: secondUser.username, _id: secondUser._id, name: secondUser.name }],
                },
                {
                    rid: testChannel._id,
                    msg: `A simple message`,
                },
                {
                    rid: testChannel._id,
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
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']);
            yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id });
        }));
        (0, mocha_1.it)('should return an empty array of messages when inspecting a new room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: emptyChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array').that.is.empty;
                (0, chai_1.expect)(res.body).to.have.property('count', 0);
                (0, chai_1.expect)(res.body).to.have.property('total', 0);
            });
        }));
        (0, mocha_1.it)('should return an array of messages when inspecting a room with messages', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('messages').and.to.be.an('array').that.has.lengthOf(5);
                (0, chai_1.expect)(res.body).to.have.property('count', 5);
                (0, chai_1.expect)(res.body).to.have.property('total', 5);
                const pinnedMessage = res.body.messages.find((message) => message.t === 'message_pinned');
                (0, chai_1.expect)(pinnedMessage).to.not.be.undefined;
            });
        }));
        (0, mocha_1.it)('should not return message when the user does NOT have the necessary permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-c-room', []);
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
            yield (0, permissions_helper_1.updatePermission)('view-c-room', ['admin', 'user', 'bot', 'app', 'anonymous']);
        }));
        (0, mocha_1.it)('should return messages that mention a single user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
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
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
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
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
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
        // Return messages that are pinned
        (0, mocha_1.it)('should return messages that are pinned', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.messages'))
                .set(api_data_1.credentials)
                .query({
                roomId: testChannel._id,
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
});
