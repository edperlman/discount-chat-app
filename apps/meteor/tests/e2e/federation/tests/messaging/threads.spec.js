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
test_1.test.describe.only('Federation - Threads', () => {
    let poFederationChannelServer1;
    let poFederationChannelServer2;
    let userFromServer2UsernameOnly;
    let createdGroupName;
    let usernameWithDomainFromServer2;
    const adminUsernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
    let pageForServer2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const page = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        createdGroupName = yield (0, channel_2.createGroupAndInviteRemoteUserToCreateLocalUser)({
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
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, browser }) {
        pageForServer2 = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, auth_1.doLogin)({
            page,
            server: {
                url: constants.RC_SERVER_1.url,
                username: constants.RC_SERVER_1.username,
                password: constants.RC_SERVER_1.password,
            },
        });
        poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
        yield (0, auth_1.doLogin)({
            page: pageForServer2,
            server: {
                url: constants.RC_SERVER_2.url,
                username: userFromServer2UsernameOnly,
                password: constants.RC_SERVER_2.password,
            },
            storeState: false,
        });
        yield page.addInitScript(() => {
            window.localStorage.setItem('fuselage-localStorage-members-list-type', JSON.stringify('online'));
        });
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.close();
        yield pageForServer2.close();
    }));
    test_1.test.describe('Messaging - Threads', () => {
        test_1.test.describe('Create thread message', () => {
            (0, test_1.test)('expect to send a thread message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer1.content.sendMessage('hello world from server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(pageForServer2).toHaveURL(/.*thread/);
                yield (0, test_1.expect)(poFederationChannelServer2.content.threadSendToChannelAlso()).not.toBeVisible();
                yield poFederationChannelServer2.content.sendThreadMessage('This is a thread message sent from server B');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastThreadMessageText).toContainText('This is a thread message sent from server B');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessage).toContainText('This is a thread message sent from server B');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastThreadMessageText).toContainText('This is a thread message sent from server B');
            }));
            (0, test_1.test)('expect to send a thread message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
                yield (0, test_1.expect)(poFederationChannelServer1.content.threadSendToChannelAlso()).not.toBeVisible();
                yield poFederationChannelServer1.content.sendThreadMessage('This is a thread message sent from server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastThreadMessageText).toContainText('This is a thread message sent from server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessage).toContainText('This is a thread message sent from server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(pageForServer2).toHaveURL(/.*thread/);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastThreadMessageText).toContainText('This is a thread message sent from server A');
            }));
        });
        test_1.test.describe('Send "Special" messages', () => {
            (0, test_1.test)('expect to send a thread message with emojis from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer1.content.sendMessage('hello world from server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer2.content.sendThreadMessage('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastThreadMessageText).toContainText('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessage).toContainText('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastThreadMessageText).toContainText('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
            }));
            (0, test_1.test)('expect to send a thread message with emojis from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer1.content.sendThreadMessage('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastThreadMessageText).toContainText('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessage).toContainText('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastThreadMessageText).toContainText('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
            }));
            (0, test_1.test)('expect to send an audio message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer1.content.sendMessage('hello world from server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer2.content.sendAudioRecordedInThreadMessage();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileThreadMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileThreadMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
            }));
            (0, test_1.test)('expect to send an audio message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer1.content.sendAudioRecordedInThreadMessage();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileThreadMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileThreadMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
            }));
            (0, test_1.test)('expect to send a thread message mentioning an user from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer1.content.sendMessage('hello world from server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer2.content.sendThreadMessage(`hello @${adminUsernameWithDomainFromServer1}, here's @${userFromServer2UsernameOnly} from Server B`);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastThreadMessageText).toContainText(`hello ${adminUsernameWithDomainFromServer1}, here's ${userFromServer2UsernameOnly} from Server B`);
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastThreadMessageText).toContainText(`hello ${constants.RC_SERVER_1.username}, here's ${usernameWithDomainFromServer2} from Server B`);
            }));
            (0, test_1.test)('expect to send a thread message mentioning an user Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer1.content.sendThreadMessage(`hello @${usernameWithDomainFromServer2}, here's @${constants.RC_SERVER_1.username} from Server A`);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastThreadMessageText).toContainText(`hello ${usernameWithDomainFromServer2}, here's ${constants.RC_SERVER_1.username} from Server A`);
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastThreadMessageText).toContainText(`hello ${userFromServer2UsernameOnly}, here's ${adminUsernameWithDomainFromServer1} from Server A`);
            }));
        });
        test_1.test.describe('Message actions', () => {
            (0, test_1.test)('expect to send a thread message quoting a thread message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                const message = `Message for quote - ${Date.now()}`;
                yield poFederationChannelServer1.content.sendMessage('hello world from server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer2.content.sendThreadMessage(message);
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer1.content.quoteMessageInsideThread('this is a quote message');
                yield (0, test_1.expect)(poFederationChannelServer1.content.waitForLastThreadMessageTextAttachmentEqualsText).toContainText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.waitForLastThreadMessageTextAttachmentEqualsText).toContainText(message);
            }));
            (0, test_1.test)('expect to send a thread message quoting a thread message Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                const message = `Message for quote - ${Date.now()}`;
                yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield poFederationChannelServer1.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer1.content.sendThreadMessage(message);
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield poFederationChannelServer2.content.btnOptionReplyInThread.click();
                yield poFederationChannelServer2.content.quoteMessageInsideThread('this is a quote message');
                yield (0, test_1.expect)(poFederationChannelServer1.content.waitForLastThreadMessageTextAttachmentEqualsText).toContainText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.waitForLastThreadMessageTextAttachmentEqualsText).toContainText(message);
            }));
        });
        test_1.test.describe('Visual Elements', () => {
            (0, test_1.test)('expect to see the thread list sent in the group on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdGroupName);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnThread).toBeVisible();
            }));
            (0, test_1.test)('expect to see the thread list sent in the group on Server B', () => __awaiter(void 0, void 0, void 0, function* () {
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(createdGroupName);
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnThread).toBeVisible();
            }));
        });
    });
});
