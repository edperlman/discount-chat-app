"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const faker_1 = require("@faker-js/faker");
const constants = __importStar(require("../../config/constants"));
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - Channel Creation', () => {
    let poFederationChannelServer1;
    let userFromServer2UsernameOnly;
    let userFromServer1UsernameOnly;
    let createdChannelName;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer1UsernameOnly = yield (0, register_user_1.registerUser)(apiServer1);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const page = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        createdChannelName = yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
            page,
            poFederationChannelServer: poFederationChannelServer1,
            fullUsernameFromServer: fullUsernameFromServer2,
            server: constants.RC_SERVER_1,
        });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2 }) {
        yield (0, test_1.tearDownTesting)(apiServer1);
        yield (0, test_1.tearDownTesting)(apiServer2);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, auth_1.doLogin)({
            page,
            server: {
                url: constants.RC_SERVER_1.url,
                username: constants.RC_SERVER_1.username,
                password: constants.RC_SERVER_1.password,
            },
        });
        yield page.addInitScript(() => {
            window.localStorage.setItem('fuselage-localStorage-members-list-type', JSON.stringify('online'));
        });
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poFederationChannelServer1.sidenav.logout();
        yield page.close();
    }));
    test_1.test.describe('Channel (Public)', () => {
        test_1.test.describe('Inviting users using the creation modal', () => {
            (0, test_1.test)('expect to create a channel inviting an user from the Server B who does not exist in Server A yet', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                const usernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: usernameFromServer2,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield poFederationChannelServer1.tabs.members.showAllUsers();
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect to create a channel inviting an user from the Server B who already exist in Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield poFederationChannelServer1.tabs.members.showAllUsers();
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            test_1.test.describe('With multiple users (when the remote user does not exists in the server A yet)', () => {
                const createdChannel = faker_1.faker.string.uuid();
                let createdUsernameFromServer2;
                (0, test_1.test)('expect to create a channel inviting an user from the Server B who does not exist in Server A yet + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
                    const pageForServer2 = yield browser.newPage();
                    const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                    createdUsernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                    yield (0, auth_1.doLogin)({
                        page: pageForServer2,
                        server: {
                            url: constants.RC_SERVER_2.url,
                            username: createdUsernameFromServer2,
                            password: constants.RC_SERVER_2.password,
                        },
                        storeState: false,
                    });
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    const adminUsernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                    const userCreatedWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer1UsernameOnly, constants.RC_SERVER_1.matrixServerName);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, [
                        fullUsernameFromServer2,
                        userFromServer1UsernameOnly,
                    ]);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.tabs.btnTabMembers.click();
                    yield poFederationChannelServer2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(createdUsernameFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userCreatedWithDomainFromServer1)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(adminUsernameWithDomainFromServer1)).toBeVisible();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                    const page2 = yield browser.newPage();
                    const poFederationChannel1ForUser2 = new channel_1.FederationChannel(page2);
                    yield (0, auth_1.doLogin)({
                        page: page2,
                        server: {
                            url: constants.RC_SERVER_1.url,
                            username: userFromServer1UsernameOnly,
                            password: constants.RC_SERVER_1.password,
                        },
                        storeState: false,
                    });
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
            test_1.test.describe('With multiple users (when the user from Server B already exists in Server A)', () => {
                const createdChannel = faker_1.faker.string.uuid();
                (0, test_1.test)('expect to create a channel inviting an user from the Server B who already exist in Server A + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
                    const pageForServer2 = yield browser.newPage();
                    const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                    yield (0, auth_1.doLogin)({
                        page: pageForServer2,
                        server: {
                            url: constants.RC_SERVER_2.url,
                            username: userFromServer2UsernameOnly,
                            password: constants.RC_SERVER_2.password,
                        },
                        storeState: false,
                    });
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                    const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                    const usernameOriginalFromServer1OnlyWithDomain = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer1UsernameOnly, constants.RC_SERVER_1.matrixServerName);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, [
                        userFromServer2UsernameOnly,
                        userFromServer1UsernameOnly,
                    ]);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.tabs.btnTabMembers.click();
                    yield poFederationChannelServer2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameOriginalFromServer1OnlyWithDomain)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                    const page2 = yield browser.newPage();
                    const poFederationChannel1ForUser2 = new channel_1.FederationChannel(page2);
                    yield (0, auth_1.doLogin)({
                        page: page2,
                        server: {
                            url: constants.RC_SERVER_1.url,
                            username: userFromServer1UsernameOnly,
                            password: constants.RC_SERVER_1.password,
                        },
                        storeState: false,
                    });
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
            test_1.test.describe('With local users only', () => {
                const createdChannel = faker_1.faker.string.uuid();
                (0, test_1.test)('Create a channel inviting an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, [
                        userFromServer1UsernameOnly,
                    ]);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                    const page2 = yield browser.newPage();
                    const poFederationChannel1ForUser2 = new channel_1.FederationChannel(page2);
                    yield (0, auth_1.doLogin)({
                        page: page2,
                        server: {
                            url: constants.RC_SERVER_1.url,
                            username: userFromServer1UsernameOnly,
                            password: constants.RC_SERVER_1.password,
                        },
                        storeState: false,
                    });
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
        });
        test_1.test.describe('Inviting users using the Add Members button', () => {
            (0, test_1.test)('expect to create an empty channel, and invite an user from the Server B who does not exist in Server A yet', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer2, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                const usernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: usernameFromServer2,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, []);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield poFederationChannelServer1.tabs.members.showAllUsers();
                yield poFederationChannelServer1.tabs.members.addMultipleUsers([fullUsernameFromServer2]);
                yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess).toBeVisible();
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect to create an empty channel, and invite an user from the Server B who already exist in Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, []);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield poFederationChannelServer1.tabs.members.showAllUsers();
                yield poFederationChannelServer1.tabs.members.addMultipleUsers([userFromServer2UsernameOnly]);
                yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess).toBeVisible();
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            test_1.test.describe('With multiple users (when the remote user does not exists in the server A yet)', () => {
                const createdChannel = faker_1.faker.string.uuid();
                let createdUsernameFromServer2;
                (0, test_1.test)('expect to create an empty channel, and invite an user from the Server B who does not exist in Server A yet + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
                    const pageForServer2 = yield browser.newPage();
                    const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                    createdUsernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                    yield (0, auth_1.doLogin)({
                        page: pageForServer2,
                        server: {
                            url: constants.RC_SERVER_2.url,
                            username: createdUsernameFromServer2,
                            password: constants.RC_SERVER_2.password,
                        },
                        storeState: false,
                    });
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                    const userCreatedWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer1UsernameOnly, constants.RC_SERVER_1.matrixServerName);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, []);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer1.tabs.members.addMultipleUsers([fullUsernameFromServer2, userFromServer1UsernameOnly]);
                    yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess).toBeVisible();
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.tabs.btnTabMembers.click();
                    yield poFederationChannelServer2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(createdUsernameFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userCreatedWithDomainFromServer1)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                    const page2 = yield browser.newPage();
                    const poFederationChannel1ForUser2 = new channel_1.FederationChannel(page2);
                    yield (0, auth_1.doLogin)({
                        page: page2,
                        server: {
                            url: constants.RC_SERVER_1.url,
                            username: userFromServer1UsernameOnly,
                            password: constants.RC_SERVER_1.password,
                        },
                        storeState: false,
                    });
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
            test_1.test.describe('With multiple users (when the user from Server B already exists in Server A)', () => {
                const createdChannel = faker_1.faker.string.uuid();
                (0, test_1.test)('expect to create an empty channel, and invite an user from the Server B who already exist in Server A + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
                    const pageForServer2 = yield browser.newPage();
                    const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                    yield (0, auth_1.doLogin)({
                        page: pageForServer2,
                        server: {
                            url: constants.RC_SERVER_2.url,
                            username: userFromServer2UsernameOnly,
                            password: constants.RC_SERVER_2.password,
                        },
                        storeState: false,
                    });
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                    const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                    const usernameOriginalFromServer1OnlyWithDomain = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer1UsernameOnly, constants.RC_SERVER_1.matrixServerName);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, []);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer1.tabs.members.addMultipleUsers([userFromServer1UsernameOnly, userFromServer2UsernameOnly]);
                    yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess).toBeVisible();
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.tabs.btnTabMembers.click();
                    yield poFederationChannelServer2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameOriginalFromServer1OnlyWithDomain)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                    const page2 = yield browser.newPage();
                    const poFederationChannel1ForUser2 = new channel_1.FederationChannel(page2);
                    yield (0, auth_1.doLogin)({
                        page: page2,
                        server: {
                            url: constants.RC_SERVER_1.url,
                            username: userFromServer1UsernameOnly,
                            password: constants.RC_SERVER_1.password,
                        },
                        storeState: false,
                    });
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
            test_1.test.describe('With local users only', () => {
                const createdChannel = faker_1.faker.string.uuid();
                (0, test_1.test)('Create an empty channel, and invite an an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, []);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer1.tabs.members.addMultipleUsers([userFromServer1UsernameOnly]);
                    yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                    const page2 = yield browser.newPage();
                    const poFederationChannel1ForUser2 = new channel_1.FederationChannel(page2);
                    yield (0, auth_1.doLogin)({
                        page: page2,
                        server: {
                            url: constants.RC_SERVER_1.url,
                            username: userFromServer1UsernameOnly,
                            password: constants.RC_SERVER_1.password,
                        },
                        storeState: false,
                    });
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
        });
        test_1.test.describe('Creating rooms with the same name in different servers, and invite users for those rooms', () => {
            const channelName = faker_1.faker.string.uuid();
            let usernameFromServer2;
            (0, test_1.test)('expect to create a group and invite users from a server which already have a group with the exact same name', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                usernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                yield (0, channel_2.createChannelUsingAPI)(apiServer2, channelName);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: usernameFromServer2,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield poFederationChannelServer1.tabs.members.showAllUsers();
                yield (0, test_1.expect)(yield poFederationChannelServer2.sidenav.countRoomsByNameOnSearch(channelName)).toBe(2);
                yield pageForServer2.reload();
                yield poFederationChannelServer2.sidenav.openChatWhenHaveMultipleWithTheSameName(channelName, 1);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield (0, test_1.expect)(yield poFederationChannelServer2.getFederationServerName()).toBe(constants.RC_SERVER_1.matrixServerName);
                yield pageForServer2.close();
            }));
            // TODO: skipping this test until we have an extra server ready to test this.
            test_1.test.skip('expect to create a group in the extra server inviting the same user from the same server as the previous one', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
                const pageForServer2 = yield browser.newPage();
                const pageForServerExtra = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const poFederationChannelServerExtra = new channel_1.FederationChannel(pageForServerExtra);
                yield (0, channel_2.createChannelUsingAPI)(apiServer2, channelName);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: usernameFromServer2,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield (0, auth_1.doLogin)({
                    page: pageForServerExtra,
                    server: {
                        url: constants.RC_EXTRA_SERVER.url,
                        username: constants.RC_EXTRA_SERVER.username,
                        password: constants.RC_EXTRA_SERVER.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield pageForServerExtra.goto(`${constants.RC_EXTRA_SERVER.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(usernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServerExtra = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_EXTRA_SERVER.username, constants.RC_EXTRA_SERVER.matrixServerName);
                yield poFederationChannelServerExtra.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_EXTRA_SERVER.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServerExtra)).toBeVisible();
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Visual Elements', () => {
            (0, test_1.test)('expect the calls button to be disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannelName}`);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnCall).toBeDisabled();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnCall).toBeDisabled();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect the discussion button to be disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannelName}`);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnDiscussion).toBeDisabled();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnDiscussion).toBeDisabled();
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Owner rights', () => {
            (0, test_1.test)('expect only the room owner being able to add users through the UI', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannelName}`);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnTabMembers).toBeVisible();
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.addUsersButton).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnTabMembers).toBeVisible();
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.addUsersButton).not.toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect only the room owner being able remove users from the room (kebab menu)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannelName}`);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnTabMembers).toBeVisible();
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield (yield poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).hover();
                yield (yield poFederationChannelServer1.tabs.members.getKebabMenuForUser(usernameWithDomainFromServer2)).click();
                yield (0, test_1.expect)(yield poFederationChannelServer1.tabs.members.getOptionFromKebabMenuForUser('removeUser')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnTabMembers).toBeVisible();
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield (yield poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).hover();
                yield (yield poFederationChannelServer2.tabs.members.getKebabMenuForUser(usernameWithDomainFromServer1)).click();
                yield (0, test_1.expect)(yield poFederationChannelServer2.tabs.members.getOptionFromKebabMenuForUser('removeUser')).not.toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect only the room owner being able remove users from the room (user info page)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannelName}`);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnTabMembers).toBeVisible();
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield (yield poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).click();
                yield poFederationChannelServer1.tabs.members.btnMenuUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.btnRemoveUserFromRoom).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnTabMembers).toBeVisible();
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield (yield poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.btnMenuUserInfo).not.toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.btnRemoveUserFromRoom).not.toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect only the room owner being able to edit the channel name AND the channel topic', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannelName}`);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnRoomInfo).toBeVisible();
                yield poFederationChannelServer1.tabs.btnRoomInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.room.btnEdit).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnRoomInfo).toBeVisible();
                yield poFederationChannelServer2.tabs.btnRoomInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.room.btnEdit).not.toBeVisible();
                yield poFederationChannelServer1.tabs.room.btnEdit.click();
                yield poFederationChannelServer1.tabs.room.inputName.fill(`NAME-EDITED-${createdChannelName}`);
                yield poFederationChannelServer1.tabs.room.btnSave.click();
                yield poFederationChannelServer1.tabs.btnRoomInfo.click();
                // waiting for the toast dismiss
                yield page.waitForTimeout(3000);
                const nameChangedSystemMessageServer1 = yield poFederationChannelServer1.content.getSystemMessageByText(`changed room name to NAME-EDITED-${createdChannelName}`);
                yield (0, test_1.expect)(nameChangedSystemMessageServer1).toBeVisible();
                const nameChangedSystemMessageServer2 = yield poFederationChannelServer2.content.getSystemMessageByText(`changed room name to NAME-EDITED-${createdChannelName}`);
                yield (0, test_1.expect)(nameChangedSystemMessageServer2).toBeVisible();
                yield poFederationChannelServer1.tabs.btnRoomInfo.click();
                yield poFederationChannelServer1.tabs.room.btnEdit.click();
                yield poFederationChannelServer1.tabs.room.inputTopic.fill('hello-topic-edited');
                yield poFederationChannelServer1.tabs.room.btnSave.click();
                const topicChangedSystemMessageServer1 = yield poFederationChannelServer1.content.getSystemMessageByText('changed room topic to hello-topic-edited');
                yield (0, test_1.expect)(topicChangedSystemMessageServer1).toBeVisible();
                const topicChangedSystemMessageServer2 = yield poFederationChannelServer2.content.getSystemMessageByText('changed room topic to hello-topic-edited');
                yield (0, test_1.expect)(topicChangedSystemMessageServer2).toBeVisible();
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Removing users from room', () => {
            (0, test_1.test)('expect to remove the invitee from the room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer1.tabs.btnTabMembers.click();
                yield poFederationChannelServer1.tabs.members.showAllUsers();
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield poFederationChannelServer2.content.sendMessage('hello world');
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.tabs.members.removeUserFromRoom(usernameWithDomainFromServer2);
                const removedSystemMessageServer1 = yield poFederationChannelServer1.content.getSystemMessageByText(`removed ${usernameWithDomainFromServer2}`);
                yield (0, test_1.expect)(removedSystemMessageServer1).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).not.toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastSystemMessageName()).textContent()).toBe(constants.RC_SERVER_1.username);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                const removedSystemMessageServer2 = yield poFederationChannelServer2.content.getSystemMessageByText(`removed ${userFromServer2UsernameOnly}`);
                yield (0, test_1.expect)(removedSystemMessageServer2).toBeVisible();
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).not.toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastSystemMessageName()).textContent()).toBe(usernameWithDomainFromServer1);
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Leaving the room', () => {
            (0, test_1.test)('expect the invitee to be able to leave the room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${channelName}`);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessage('hello world');
                yield poFederationChannelServer2.tabs.btnRoomInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.room.btnLeave).toBeVisible();
                yield poFederationChannelServer2.tabs.room.btnLeave.click();
                yield poFederationChannelServer2.tabs.room.btnModalConfirm.click();
                const leftChannelSystemMessageServer1 = yield poFederationChannelServer1.content.getSystemMessageByText('left the channel');
                yield (0, test_1.expect)(leftChannelSystemMessageServer1).toBeVisible();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastSystemMessageName()).textContent()).toBe(usernameWithDomainFromServer2);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                const leftChannelSystemMessageServer2 = yield poFederationChannelServer1.content.getSystemMessageByText('left the channel');
                yield (0, test_1.expect)(leftChannelSystemMessageServer2).toBeVisible();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastSystemMessageName()).textContent()).toBe(userFromServer2UsernameOnly);
                yield poFederationChannelServer2.tabs.btnTabMembers.click();
                yield poFederationChannelServer2.tabs.members.showAllUsers();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(userFromServer2UsernameOnly)).not.toBeVisible();
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Discussions', () => {
            (0, test_1.test)('expect the federated channels not to be shown as parent channels in discussion creation', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, browser }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield poFederationChannelServer1.createDiscussionSearchingForChannel(channelName);
                yield (0, test_1.expect)(page.locator('div.rcx-option__content', { hasText: 'Empty' })).toBeVisible();
                yield poFederationChannelServer2.createDiscussionSearchingForChannel(channelName);
                yield (0, test_1.expect)(pageForServer2.locator('div.rcx-option__content', { hasText: 'Empty' })).toBeVisible();
                yield page.reload();
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Teams', () => {
            (0, test_1.test)('expect the federated channels not to be shown as parent channels in the input to add rooms to the team on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, }) {
                const channelName = faker_1.faker.string.uuid();
                const teamName = faker_1.faker.string.uuid();
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield poFederationChannelServer1.createTeam(teamName);
                yield poFederationChannelServer1.tabs.btnTeam.click();
                yield poFederationChannelServer1.tabs.btnAddExistingChannelToTeam.click();
                yield poFederationChannelServer1.tabs.searchForChannelOnAddChannelToTeam(channelName);
                yield (0, test_1.expect)(page.locator('div.rcx-option__content', { hasText: 'Empty' })).toBeVisible();
                yield page.reload();
            }));
            (0, test_1.test)('expect the federated channels not to be shown as parent channels in the input to add rooms to the team on Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, browser, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                const teamName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield poFederationChannelServer2.createTeam(teamName);
                yield poFederationChannelServer2.tabs.btnTeam.click();
                yield poFederationChannelServer2.tabs.btnAddExistingChannelToTeam.click();
                yield poFederationChannelServer2.tabs.searchForChannelOnAddChannelToTeam(channelName);
                yield (0, test_1.expect)(pageForServer2.locator('div.rcx-option__content', { hasText: 'Empty' })).toBeVisible();
                yield page.reload();
                yield pageForServer2.close();
            }));
        });
        test_1.test.describe('Directory', () => {
            (0, test_1.test)('expect the created channels to be shown in Server B correctly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer2, browser }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const channelName = faker_1.faker.string.uuid();
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: userFromServer2UsernameOnly,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                yield (0, channel_2.createChannelUsingAPI)(apiServer2, channelName);
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
                yield (0, test_1.expect)(yield poFederationChannelServer2.sidenav.countFilteredChannelsOnDirectory(channelName)).toBe(2);
                yield pageForServer2.close();
            }));
        });
    });
});
