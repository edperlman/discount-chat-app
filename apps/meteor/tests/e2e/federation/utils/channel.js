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
exports.createChannelUsingAPI = exports.createGroupUsingAPI = exports.createGroupAndInviteRemoteUserToCreateLocalUser = exports.createChannelAndInviteRemoteUserToCreateLocalUser = void 0;
const faker_1 = require("@faker-js/faker");
const auth_1 = require("./auth");
const doLoginAndGoToHome = (page, server) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.doLogin)({
        page,
        server,
    });
    yield page.goto(`${server.url}/home`);
});
const createChannelAndInviteRemoteUserToCreateLocalUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, poFederationChannelServer, fullUsernameFromServer, server, closePageAfterCreation = true, }) {
    const channelName = faker_1.faker.string.uuid();
    yield doLoginAndGoToHome(page, server);
    yield poFederationChannelServer.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer]);
    if (closePageAfterCreation) {
        yield page.close();
    }
    return channelName;
});
exports.createChannelAndInviteRemoteUserToCreateLocalUser = createChannelAndInviteRemoteUserToCreateLocalUser;
const createGroupAndInviteRemoteUserToCreateLocalUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, poFederationChannelServer, fullUsernameFromServer, server, }) {
    const groupName = faker_1.faker.string.uuid();
    yield doLoginAndGoToHome(page, server);
    yield poFederationChannelServer.createPrivateGroupAndInviteUsersUsingCreationModal(groupName, [fullUsernameFromServer]);
    yield page.close();
    return groupName;
});
exports.createGroupAndInviteRemoteUserToCreateLocalUser = createGroupAndInviteRemoteUserToCreateLocalUser;
const createGroupUsingAPI = (api, name) => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post('/groups.create', { name });
});
exports.createGroupUsingAPI = createGroupUsingAPI;
const createChannelUsingAPI = (api, name) => __awaiter(void 0, void 0, void 0, function* () {
    yield api.post('/channels.create', { name });
});
exports.createChannelUsingAPI = createChannelUsingAPI;
