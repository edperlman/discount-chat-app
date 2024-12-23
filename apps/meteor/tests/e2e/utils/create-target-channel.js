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
exports.createTargetChannel = createTargetChannel;
exports.deleteChannel = deleteChannel;
exports.createTargetPrivateChannel = createTargetPrivateChannel;
exports.createTargetTeam = createTargetTeam;
exports.deleteTeam = deleteTeam;
exports.createDirectMessage = createDirectMessage;
exports.createTargetDiscussion = createTargetDiscussion;
const faker_1 = require("@faker-js/faker");
/**
 * createTargetChannel:
 *  - Usefull to create a target channel for message related tests
 */
function createTargetChannel(api, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = faker_1.faker.string.uuid();
        yield api.post('/channels.create', Object.assign({ name }, options));
        return name;
    });
}
function deleteChannel(api, roomName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api.post('/channels.delete', { roomName });
    });
}
function createTargetPrivateChannel(api, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = faker_1.faker.string.uuid();
        yield api.post('/groups.create', Object.assign({ name }, options));
        return name;
    });
}
function createTargetTeam(api, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = faker_1.faker.string.uuid();
        yield api.post('/teams.create', Object.assign({ name, type: 1, members: ['user2', 'user1'] }, options));
        return name;
    });
}
function deleteTeam(api, teamName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api.post('/teams.delete', { teamName });
    });
}
function createDirectMessage(api) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api.post('/dm.create', {
            usernames: 'user1,user2',
        });
    });
}
function createTargetDiscussion(api) {
    return __awaiter(this, void 0, void 0, function* () {
        const channelName = faker_1.faker.string.uuid();
        const discussionName = faker_1.faker.string.uuid();
        const response = yield api.post('/channels.create', { name: channelName });
        const { channel } = yield response.json();
        yield api.post('/rooms.createDiscussion', { t_name: discussionName, prid: channel._id });
        return discussionName;
    });
}
