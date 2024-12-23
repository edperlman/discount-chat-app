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
const constants = __importStar(require("../../config/constants"));
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - Direct Messages', () => {
    let poFederationChannelServer1;
    let userFromServer2UsernameOnly;
    let userFromServer1UsernameOnly;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer1UsernameOnly = yield (0, register_user_1.registerUser)(apiServer1);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const page = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
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
    test_1.test.describe('Direct Messages (DMs)', () => {
        test_1.test.describe('Inviting users using the creation modal', () => {
            (0, test_1.test)('expect to create a DM inviting an user from the Server B who does not exist in Server A yet', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
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
                yield poFederationChannelServer1.createDirectMessagesUsingModal([fullUsernameFromServer2]);
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield poFederationChannelServer1.tabs.btnUserInfo.click();
                yield poFederationChannelServer1.content.sendMessage('hello world');
                yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                yield poFederationChannelServer2.tabs.btnUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect to create a DM inviting an user from the Server B who already exist in Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
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
                yield poFederationChannelServer1.createDirectMessagesUsingModal([userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield poFederationChannelServer1.tabs.btnUserInfo.click();
                yield poFederationChannelServer1.content.sendMessage('hello world');
                yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                yield poFederationChannelServer2.tabs.btnUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            test_1.test.describe('With multiple users (when the remote user does not exists in the server A yet)', () => {
                let createdUsernameFromServer2;
                (0, test_1.test)('expect to create a DM inviting an user from the Server B who does not exist in Server A yet + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
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
                    yield poFederationChannelServer1.createDirectMessagesUsingModal([fullUsernameFromServer2, userFromServer1UsernameOnly]);
                    yield poFederationChannelServer1.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer2.sidenav.openDMMultipleChat(userCreatedWithDomainFromServer1);
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
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created group', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
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
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
            test_1.test.describe('With multiple users (when the user from Server B already exists in Server A)', () => {
                (0, test_1.test)('expect to create a DM inviting an user from the Server B who already exist in Server A + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
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
                    yield poFederationChannelServer1.createDirectMessagesUsingModal([userFromServer2UsernameOnly, userFromServer1UsernameOnly]);
                    yield poFederationChannelServer1.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer2.sidenav.openDMMultipleChat(usernameOriginalFromServer1OnlyWithDomain);
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
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
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
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                    yield page2.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield poFederationChannel1ForUser2.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
        });
        test_1.test.describe('Using Slash commands', () => {
            (0, test_1.test)('expect to create a DM inviting an user from the Server B who does not exist in Server A yet', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer2, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
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
                yield poFederationChannelServer1.sidenav.openChat('general');
                yield poFederationChannelServer1.content.dispatchSlashCommand(`/federation dm ${fullUsernameFromServer2}`);
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield poFederationChannelServer1.tabs.btnUserInfo.click();
                yield poFederationChannelServer1.content.sendMessage('hello world');
                yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                yield poFederationChannelServer2.tabs.btnUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect to create a DM inviting an user from the Server B who already exist in Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer2, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const createdUsernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: createdUsernameFromServer2,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer1.sidenav.logout();
                yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
                    page,
                    poFederationChannelServer: poFederationChannelServer1,
                    fullUsernameFromServer: fullUsernameFromServer2,
                    server: constants.RC_SERVER_1,
                    closePageAfterCreation: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const adminUsernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer1.sidenav.openChat('general');
                yield poFederationChannelServer1.content.dispatchSlashCommand(`/federation dm @${usernameWithDomainFromServer2}`);
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield poFederationChannelServer1.tabs.btnUserInfo.click();
                yield poFederationChannelServer1.content.sendMessage('hello world');
                yield poFederationChannelServer2.sidenav.openChat(adminUsernameWithDomainFromServer1);
                yield poFederationChannelServer2.tabs.btnUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer2)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.dmUserMember.getUserInfoUsername(adminUsernameWithDomainFromServer1)).toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect to create a DM inviting an user from the Server A who does not exist in Server B yet', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer1, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const createdUsernameFromServer1 = yield (0, register_user_1.registerUser)(apiServer1);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: constants.RC_SERVER_2.username,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const fullUsernameFromServer1 = (0, format_1.formatIntoFullMatrixUsername)(createdUsernameFromServer1, constants.RC_SERVER_1.matrixServerName);
                const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer1, constants.RC_SERVER_1.matrixServerName);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_2.username, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer2.sidenav.openChat('general');
                yield poFederationChannelServer2.content.dispatchSlashCommand(`/federation dm ${fullUsernameFromServer1}`);
                yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                yield poFederationChannelServer2.tabs.btnUserInfo.click();
                yield poFederationChannelServer2.content.sendMessage('hello world');
                yield poFederationChannelServer1.sidenav.logout();
                yield (0, auth_1.doLogin)({
                    page,
                    server: {
                        url: constants.RC_SERVER_1.url,
                        username: createdUsernameFromServer1,
                        password: constants.RC_SERVER_1.password,
                    },
                    storeState: false,
                });
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield poFederationChannelServer1.tabs.btnUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer1)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer2)).toBeVisible();
                yield pageForServer2.close();
            }));
            (0, test_1.test)('expect to create a DM inviting an user from the Server A who already exist in Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer2, }) {
                const pageForServer2 = yield browser.newPage();
                const poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
                const createdUsernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                yield (0, auth_1.doLogin)({
                    page: pageForServer2,
                    server: {
                        url: constants.RC_SERVER_2.url,
                        username: createdUsernameFromServer2,
                        password: constants.RC_SERVER_2.password,
                    },
                    storeState: false,
                });
                const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                yield poFederationChannelServer1.sidenav.logout();
                yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
                    page,
                    poFederationChannelServer: poFederationChannelServer1,
                    fullUsernameFromServer: fullUsernameFromServer2,
                    server: constants.RC_SERVER_1,
                    closePageAfterCreation: false,
                });
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                const adminUsernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
                yield poFederationChannelServer2.sidenav.openChat('general');
                yield poFederationChannelServer2.content.dispatchSlashCommand(`/federation dm @${adminUsernameWithDomainFromServer1}`);
                yield page.waitForTimeout(2000);
                yield poFederationChannelServer2.sidenav.openChat(adminUsernameWithDomainFromServer1);
                yield poFederationChannelServer2.tabs.btnUserInfo.click();
                yield poFederationChannelServer2.content.sendMessage('hello world');
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield poFederationChannelServer1.tabs.btnUserInfo.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.dmUserMember.getUserInfoUsername(adminUsernameWithDomainFromServer1)).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.dmUserMember.getUserInfoUsername(usernameWithDomainFromServer2)).toBeVisible();
                yield pageForServer2.close();
            }));
            test_1.test.describe('With multiple users (when the remote user does not exists in the server A yet)', () => {
                let createdUsernameFromServer2;
                (0, test_1.test)('expect to create a DM, and invite an user from the Server B who does not exist in Server A yet + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2, page, }) {
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
                    const usernameOriginalFromServer1OnlyWithDomain = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer1UsernameOnly, constants.RC_SERVER_1.matrixServerName);
                    yield poFederationChannelServer1.sidenav.openChat('general');
                    yield poFederationChannelServer1.content.dispatchSlashCommand(`/federation dm ${fullUsernameFromServer2} @${userFromServer1UsernameOnly}`);
                    yield poFederationChannelServer1.sidenav.openDMMultipleChat(userFromServer1UsernameOnly);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer2.sidenav.openDMMultipleChat(usernameOriginalFromServer1OnlyWithDomain);
                    yield poFederationChannelServer2.tabs.btnTabMembers.click();
                    yield poFederationChannelServer2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(createdUsernameFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameOriginalFromServer1OnlyWithDomain)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(usernameWithDomainFromServer1)).toBeVisible();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created group', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
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
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                    yield poFederationChannel1ForUser2.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
            test_1.test.describe('With multiple users (when the user from Server B already exists in Server A)', () => {
                (0, test_1.test)('expect to create a DM, and invite an user from the Server B who already exist in Server A + an user from Server A only (locally)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
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
                    yield poFederationChannelServer1.sidenav.openChat('general');
                    yield poFederationChannelServer1.content.dispatchSlashCommand(`/federation dm @${usernameWithDomainFromServer2} @${userFromServer1UsernameOnly}`);
                    yield poFederationChannelServer1.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield poFederationChannelServer1.tabs.btnTabMembers.click();
                    yield poFederationChannelServer1.tabs.members.showAllUsers();
                    yield poFederationChannelServer2.sidenav.openDMMultipleChat(usernameOriginalFromServer1OnlyWithDomain);
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
                (0, test_1.test)('expect the user from Server A (locally) is able to access the previous created group', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
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
                    const usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                    yield poFederationChannel1ForUser2.sidenav.openDMMultipleChat(usernameWithDomainFromServer2);
                    yield poFederationChannel1ForUser2.tabs.btnTabMembers.click();
                    yield poFederationChannel1ForUser2.tabs.members.showAllUsers();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(usernameWithDomainFromServer2)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(userFromServer1UsernameOnly)).toBeVisible();
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.tabs.members.getUserInList(constants.RC_SERVER_1.username)).toBeVisible();
                    yield page2.close();
                }));
            });
        });
        test_1.test.describe('DMs', () => {
            let createdUsernameFromServer2;
            let usernameWithDomainFromServer2;
            let fullUsernameFromServer2;
            const usernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, apiServer2 }) {
                createdUsernameFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
                const page = yield browser.newPage();
                const poDmFederationServer1 = new channel_1.FederationChannel(page);
                yield (0, auth_1.doLogin)({
                    page,
                    server: {
                        url: constants.RC_SERVER_1.url,
                        username: constants.RC_SERVER_1.username,
                        password: constants.RC_SERVER_1.password,
                    },
                });
                fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(createdUsernameFromServer2, constants.RC_SERVER_2.matrixServerName);
                usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
                yield poDmFederationServer1.createDirectMessagesUsingModal([fullUsernameFromServer2]);
                yield page.close();
            }));
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
                    yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnCall).toBeDisabled();
                    yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
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
                    yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnDiscussion).toBeDisabled();
                    yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnDiscussion).toBeDisabled();
                    yield pageForServer2.close();
                }));
            });
            test_1.test.describe('Owner rights', () => {
                (0, test_1.test)('expect neither the owner nor the invitee to be able to edit the channel info (the channel info button should not be visible)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
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
                    yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnRoomInfo).not.toBeVisible();
                    yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnRoomInfo).not.toBeVisible();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect the owner nor the invitee to be able to add users to DMs (the button to add users should not be visible)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, }) {
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
                    yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                    yield poFederationChannelServer1.content.sendMessage('hello world');
                    yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnTabMembers).not.toBeVisible();
                    yield poFederationChannelServer2.sidenav.openChat(usernameWithDomainFromServer1);
                    yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnTabMembers).not.toBeVisible();
                    yield pageForServer2.close();
                }));
            });
        });
    });
});
