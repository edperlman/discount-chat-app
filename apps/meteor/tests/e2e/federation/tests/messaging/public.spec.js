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
/* eslint no-await-in-loop: 0 */
const faker_1 = require("@faker-js/faker");
const constants = __importStar(require("../../config/constants"));
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - Channel Messaging', () => {
    let poFederationChannelServer1;
    let poFederationChannelServer2;
    let userFromServer2UsernameOnly;
    let userFromServer1UsernameOnly;
    let createdChannelName;
    let usernameWithDomainFromServer2;
    const adminUsernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
    let pageForServer2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer1UsernameOnly = yield (0, register_user_1.registerUser)(apiServer1);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
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
    test_1.test.describe('Messaging - Channel (Public)', () => {
        test_1.test.describe('Send message', () => {
            (0, test_1.test)('expect to send a message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendMessage('hello world from server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('hello world from server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('hello world from server A');
            }));
            (0, test_1.test)('expect to send a message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('hello world from server B');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('hello world from server B');
            }));
            test_1.test.describe('With multiple users', () => {
                const createdChannel = faker_1.faker.string.uuid();
                (0, test_1.test)('expect to send a message from Server A (creator) to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
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
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(createdChannel, [
                        userFromServer2UsernameOnly,
                        userFromServer1UsernameOnly,
                    ]);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer1.content.sendMessage('hello world from server A (creator)');
                    yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('hello world from server A (creator)');
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.content.lastUserMessageBody).toHaveText('hello world from server A (creator)');
                    yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('hello world from server A (creator)');
                    yield pageForServer2.close();
                    yield page2.close();
                }));
                (0, test_1.test)('expect to send a message from Server A (user 2) to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
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
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.content.sendMessage('hello world from server A (user 2)');
                    yield poFederationChannel1ForUser2.content.sendMessage('hello world from server A (user 2) message 2');
                    yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('hello world from server A (user 2) message 2');
                    yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('hello world from server A (user 2) message 2');
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.content.lastUserMessageBody).toHaveText('hello world from server A (user 2) message 2');
                    yield page2.close();
                    yield pageForServer2.close();
                }));
                (0, test_1.test)('expect to send a message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
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
                    yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                    yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                    yield poFederationChannelServer1.sidenav.openChat(createdChannel);
                    yield poFederationChannelServer2.sidenav.openChat(createdChannel);
                    yield poFederationChannel1ForUser2.sidenav.openChat(createdChannel);
                    yield (0, test_1.expect)(page).toHaveURL(`${constants.RC_SERVER_1.url}/channel/${createdChannel}`);
                    yield poFederationChannelServer2.content.sendMessage('hello world from server B');
                    yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('hello world from server B');
                    yield (0, test_1.expect)(poFederationChannel1ForUser2.content.lastUserMessageBody).toHaveText('hello world from server B');
                    yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('hello world from server B');
                    yield pageForServer2.close();
                    yield page2.close();
                }));
            });
        });
        test_1.test.describe('Send "Special" messages', () => {
            (0, test_1.test)('expect to send a message with emojis from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendMessage('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('😀 😀 hello world 🌎 from server A with emojis 😀 😀');
            }));
            (0, test_1.test)('expect to send a message with emojis from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendMessage('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('😀 😀 hello world 🌎 from server B with emojis 😀 😀');
            }));
            (0, test_1.test)('expect to send an audio message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendAudioRecordedMessage();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastFileMessage.locator('audio')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastFileMessage.locator('audio')).toBeVisible();
            }));
            (0, test_1.test)('expect to send an audio message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendAudioRecordedMessage();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileMessageByFileName('Audio record.mp3')).innerText()).toEqual('Audio record.mp3');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastFileMessage.locator('audio')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastFileMessage.locator('audio')).toBeVisible();
            }));
            (0, test_1.test)('expect to send a video message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendVideoRecordedMessage();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileMessageByFileName('Video record.webm')).innerText()).toEqual('Video record.webm');
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileMessageByFileName('Video record.webm')).innerText()).toEqual('Video record.webm');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastFileMessage.locator('video')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastFileMessage.locator('video')).toBeVisible();
            }));
            (0, test_1.test)('expect to send a video message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendVideoRecordedMessage();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileMessageByFileName('Video record.webm')).innerText()).toEqual('Video record.webm');
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileMessageByFileName('Video record.webm')).innerText()).toEqual('Video record.webm');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastFileMessage.locator('video')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastFileMessage.locator('video')).toBeVisible();
            }));
            (0, test_1.test)('expect to send a file message (image) from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendFileMessage('test_image.jpeg');
                yield poFederationChannelServer1.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastMessageFileName).toContainText('test_image.jpeg');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastMessageFileName).toContainText('test_image.jpeg');
            }));
            (0, test_1.test)('expect to send a file message (image) from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendFileMessage('test_image.jpeg');
                yield poFederationChannelServer2.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastMessageFileName).toContainText('test_image.jpeg');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastMessageFileName).toContainText('test_image.jpeg');
            }));
            (0, test_1.test)('expect to send a file message (video) from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendFileMessage('test_video.mp4');
                yield poFederationChannelServer1.content.btnModalConfirm.click();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileMessageByFileName('test_video.mp4')).innerText()).toEqual('test_video.mp4');
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileMessageByFileName('test_video.mp4')).innerText()).toEqual('test_video.mp4');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastFileMessage.locator('video')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastFileMessage.locator('video')).toBeVisible();
            }));
            (0, test_1.test)('expect to send a file message (video) from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendFileMessage('test_video.mp4');
                yield poFederationChannelServer2.content.btnModalConfirm.click();
                yield (0, test_1.expect)(yield (yield poFederationChannelServer2.content.getLastFileMessageByFileName('test_video.mp4')).innerText()).toEqual('test_video.mp4');
                yield (0, test_1.expect)(yield (yield poFederationChannelServer1.content.getLastFileMessageByFileName('test_video.mp4')).innerText()).toEqual('test_video.mp4');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastFileMessage.locator('video')).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastFileMessage.locator('video')).toBeVisible();
            }));
            (0, test_1.test)('expect to send a file message (pdf) from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendFileMessage('test_pdf_file.pdf');
                yield poFederationChannelServer1.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastMessageFileName).toContainText('test_pdf_file.pdf');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastMessageFileName).toContainText('test_pdf_file.pdf');
            }));
            (0, test_1.test)('expect to send a file message (pdf) from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.sendFileMessage('test_pdf_file.pdf');
                yield poFederationChannelServer2.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastMessageFileName).toContainText('test_pdf_file.pdf');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastMessageFileName).toContainText('test_pdf_file.pdf');
            }));
            (0, test_1.test)('expect to send a message mentioning an user from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.inputMessage.type(`@${userFromServer2UsernameOnly}`, { delay: 100 });
                yield poFederationChannelServer1.content.messagePopUpItems
                    .locator(`role=listitem >> text="${usernameWithDomainFromServer2}"`)
                    .waitFor();
                yield (0, test_1.expect)(poFederationChannelServer1.content.messagePopUpItems.locator(`role=listitem >> text="${usernameWithDomainFromServer2}"`)).toBeVisible();
                yield poFederationChannelServer2.content.inputMessage.type(`@${constants.RC_SERVER_1.username}`, { delay: 100 });
                yield poFederationChannelServer2.content.messagePopUpItems
                    .locator(`role=listitem >> text="${adminUsernameWithDomainFromServer1}"`)
                    .waitFor();
                yield (0, test_1.expect)(poFederationChannelServer2.content.messagePopUpItems.locator(`role=listitem >> text="${adminUsernameWithDomainFromServer1}"`)).toBeVisible();
                yield poFederationChannelServer1.content.inputMessage.fill('');
                yield poFederationChannelServer2.content.inputMessage.fill('');
                yield poFederationChannelServer1.content.sendMessage(`hello @${usernameWithDomainFromServer2}, here's @${constants.RC_SERVER_1.username} from Server A`);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText(`hello ${usernameWithDomainFromServer2}, here's ${constants.RC_SERVER_1.username} from Server A`);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText(`hello ${userFromServer2UsernameOnly}, here's ${adminUsernameWithDomainFromServer1} from Server A`);
            }));
            (0, test_1.test)('expect to send a message mentioning an user Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.content.inputMessage.type(`@${constants.RC_SERVER_1.username}`, { delay: 100 });
                yield poFederationChannelServer2.content.messagePopUpItems
                    .locator(`role=listitem >> text="${adminUsernameWithDomainFromServer1}"`)
                    .waitFor();
                yield (0, test_1.expect)(poFederationChannelServer2.content.messagePopUpItems.locator(`role=listitem >> text="${adminUsernameWithDomainFromServer1}"`)).toBeVisible();
                yield poFederationChannelServer1.content.inputMessage.type(`@${userFromServer2UsernameOnly}`, { delay: 100 });
                yield poFederationChannelServer1.content.messagePopUpItems
                    .locator(`role=listitem >> text="${usernameWithDomainFromServer2}"`)
                    .waitFor();
                yield (0, test_1.expect)(poFederationChannelServer1.content.messagePopUpItems.locator(`role=listitem >> text="${usernameWithDomainFromServer2}"`)).toBeVisible();
                yield poFederationChannelServer1.content.inputMessage.fill('');
                yield poFederationChannelServer2.content.inputMessage.fill('');
                yield poFederationChannelServer2.content.sendMessage(`hello @${adminUsernameWithDomainFromServer1}, here's @${userFromServer2UsernameOnly} from Server B`);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText(`hello ${constants.RC_SERVER_1.username}, here's ${usernameWithDomainFromServer2} from Server B`);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText(`hello ${adminUsernameWithDomainFromServer1}, here's ${userFromServer2UsernameOnly} from Server B`);
            }));
            (0, test_1.test)('expect to send a message with multiple mentions, including @all from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.content.sendMessage(`hello @${usernameWithDomainFromServer2}, here's @${constants.RC_SERVER_1.username} from Server A, @all, @${usernameWithDomainFromServer2}`);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText(`hello ${usernameWithDomainFromServer2}, here's ${constants.RC_SERVER_1.username} from Server A, all, ${usernameWithDomainFromServer2}`);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText(`hello ${userFromServer2UsernameOnly}, here's ${adminUsernameWithDomainFromServer1} from Server A, all, ${userFromServer2UsernameOnly}`);
            }));
        });
        test_1.test.describe('Message actions', () => {
            (0, test_1.test)('expect to send a message quoting a message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                const message = `Message for quote - ${Date.now()}`;
                yield poFederationChannelServer2.content.sendMessage(message);
                yield poFederationChannelServer1.content.quoteMessage('this is a quote message');
                yield (0, test_1.expect)(poFederationChannelServer1.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
            }));
            (0, test_1.test)('expect to send a message quoting a message Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                const message = `Message for quote - ${Date.now()}`;
                yield poFederationChannelServer1.content.sendMessage(message);
                yield poFederationChannelServer2.content.quoteMessage('this is a quote message');
                yield (0, test_1.expect)(poFederationChannelServer2.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
                yield (0, test_1.expect)(poFederationChannelServer1.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
            }));
            (0, test_1.test)('expect to react a message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield poFederationChannelServer1.content.reactToMessage('slight_smile');
                const reactionsServer1 = yield poFederationChannelServer1.content.getAllReactions();
                const reactionListExcludingTheActionServer1 = (yield reactionsServer1.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer1; i++) {
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText('🙂');
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('div.rcx-message-reactions__counter')).toContainText('1');
                }
                const reactionsServer2 = yield poFederationChannelServer2.content.getAllReactions();
                const reactionListExcludingTheActionServer2 = (yield reactionsServer2.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer2; i++) {
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText('🙂');
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('div.rcx-message-reactions__counter')).toContainText('1');
                }
            }));
            (0, test_1.test)('expect to react a message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield poFederationChannelServer2.content.reactToMessage('slight_smile');
                const reactionsServer1 = yield poFederationChannelServer1.content.getAllReactions();
                const reactionListExcludingTheActionServer1 = (yield reactionsServer1.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer1; i++) {
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText('🙂');
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('div.rcx-message-reactions__counter')).toContainText('1');
                }
                const reactionsServer2 = yield poFederationChannelServer2.content.getAllReactions();
                const reactionListExcludingTheActionServer2 = (yield reactionsServer2.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer2; i++) {
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText('🙂');
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('div.rcx-message-reactions__counter')).toContainText('1');
                }
            }));
            (0, test_1.test)('expect to unreact a message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield poFederationChannelServer1.content.reactToMessage('slight_smile');
                yield poFederationChannelServer1.content.reactToMessage('grin');
                let reactionsServer1 = yield poFederationChannelServer1.content.getAllReactions();
                let reactionListExcludingTheActionServer1 = (yield reactionsServer1.count()) - 1;
                const reactionsMap = {
                    0: {
                        emoji: '🙂',
                        count: '1',
                    },
                    1: {
                        emoji: '😁',
                        count: '1',
                    },
                };
                for (let i = 0; i < reactionListExcludingTheActionServer1; i++) {
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMap[i].emoji);
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMap[i].count);
                }
                let reactionsServer2 = yield poFederationChannelServer2.content.getAllReactions();
                let reactionListExcludingTheActionServer2 = (yield reactionsServer2.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer2; i++) {
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMap[i].emoji);
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMap[i].count);
                }
                yield poFederationChannelServer1.content.unreactLastMessage();
                yield pageForServer2.reload();
                reactionsServer1 = yield poFederationChannelServer1.content.getAllReactions();
                reactionListExcludingTheActionServer1 = (yield reactionsServer1.count()) - 1;
                const reactionsMapAfterUnreaction = {
                    0: {
                        emoji: '🙂',
                        count: '1',
                    },
                };
                for (let i = 0; i < reactionListExcludingTheActionServer1; i++) {
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMapAfterUnreaction[i].emoji);
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMapAfterUnreaction[i].count);
                }
                reactionsServer2 = yield poFederationChannelServer2.content.getAllReactions();
                reactionListExcludingTheActionServer2 = (yield reactionsServer2.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer2; i++) {
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMapAfterUnreaction[i].emoji);
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMapAfterUnreaction[i].count);
                }
            }));
            (0, test_1.test)('expect to unreact a message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server A');
                yield poFederationChannelServer2.content.reactToMessage('slight_smile');
                yield poFederationChannelServer2.content.reactToMessage('grin');
                let reactionsServer2 = yield poFederationChannelServer2.content.getAllReactions();
                let reactionListExcludingTheActionServer2 = (yield reactionsServer2.count()) - 1;
                const reactionsMap = {
                    0: {
                        emoji: '🙂',
                        count: '1',
                    },
                    1: {
                        emoji: '😁',
                        count: '1',
                    },
                };
                for (let i = 0; i < reactionListExcludingTheActionServer2; i++) {
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMap[i].emoji);
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMap[i].count);
                }
                let reactionsServer1 = yield poFederationChannelServer1.content.getAllReactions();
                let reactionListExcludingTheActionServer1 = (yield reactionsServer1.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer1; i++) {
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMap[i].emoji);
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMap[i].count);
                }
                yield poFederationChannelServer2.content.unreactLastMessage();
                yield pageForServer2.reload();
                reactionsServer2 = yield poFederationChannelServer2.content.getAllReactions();
                reactionListExcludingTheActionServer2 = (yield reactionsServer2.count()) - 1;
                const reactionsMapAfterUnreaction = {
                    0: {
                        emoji: '🙂',
                        count: '1',
                    },
                };
                for (let i = 0; i < reactionListExcludingTheActionServer2; i++) {
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMapAfterUnreaction[i].emoji);
                    yield (0, test_1.expect)(reactionsServer2.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMapAfterUnreaction[i].count);
                }
                reactionsServer1 = yield poFederationChannelServer1.content.getAllReactions();
                reactionListExcludingTheActionServer1 = (yield reactionsServer1.count()) - 1;
                for (let i = 0; i < reactionListExcludingTheActionServer1; i++) {
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('span.rcx-message-reactions__emoji.emojione')).toContainText(reactionsMapAfterUnreaction[i].emoji);
                    yield (0, test_1.expect)(reactionsServer1.nth(i).locator('div.rcx-message-reactions__counter')).toContainText(reactionsMapAfterUnreaction[i].count);
                }
            }));
            (0, test_1.test)('expect to edit a message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer1.content.editLastMessage('message from Server A - Edited');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A - Edited');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A - Edited');
            }));
            (0, test_1.test)('expect to edit a message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server B');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server B');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server B');
                yield poFederationChannelServer2.content.editLastMessage('message from Server B - Edited');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server B - Edited');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server B - Edited');
            }));
            (0, test_1.test)('expect to delete a message from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer1.content.deleteLastMessage();
                yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessage).not.toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessage).not.toBeVisible();
            }));
            (0, test_1.test)('expect to delete a message from Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer2.content.deleteLastMessage();
                yield (0, test_1.expect)(poFederationChannelServer2.toastSuccess).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessage).not.toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessage).not.toBeVisible();
            }));
            (0, test_1.test)('expect to reply a message in DM from Server A to Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                const message = 'message from Server B';
                yield poFederationChannelServer2.content.sendMessageUsingEnter(message);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText(message);
                yield poFederationChannelServer1.content.replyInDm('reply directly in DM from server A');
                yield poFederationChannelServer2.sidenav.openChat(adminUsernameWithDomainFromServer1);
                yield (0, test_1.expect)(poFederationChannelServer1.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
            }));
            (0, test_1.test)('expect to reply a message in DM Server B to Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                const message = 'message from Server A';
                yield poFederationChannelServer1.content.sendMessageUsingEnter(message);
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText(message);
                yield poFederationChannelServer2.content.replyInDm('reply directly in DM from server B');
                yield poFederationChannelServer1.sidenav.openChat(usernameWithDomainFromServer2);
                yield (0, test_1.expect)(poFederationChannelServer1.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
                yield (0, test_1.expect)(poFederationChannelServer2.content.waitForLastMessageTextAttachmentEqualsText).toHaveText(message);
            }));
            (0, test_1.test)('expect to star a message on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer1.content.starLastMessage();
                yield (0, test_1.expect)(poFederationChannelServer1.toastSuccess.locator('div.rcx-toastbar-content', { hasText: 'Message has been starred' })).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessage.locator('.rcx-icon--name-star-filled')).toBeVisible();
            }));
            (0, test_1.test)('expect to star a message on Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer2.content.starLastMessage();
                yield (0, test_1.expect)(poFederationChannelServer2.toastSuccess.locator('div.rcx-toastbar-content', { hasText: 'Message has been starred' })).toBeVisible();
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessage.locator('.rcx-icon--name-star-filled')).toBeVisible();
            }));
            (0, test_1.test)('expect to not be able to start a discussion from a message in Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer1.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield (0, test_1.expect)(poFederationChannelServer1.content.btnOptionStartDiscussion).not.toBeVisible();
            }));
            (0, test_1.test)('expect to not be able to start a discussion from a message in Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield (0, test_1.expect)(poFederationChannelServer2.content.btnOptionStartDiscussion).not.toBeVisible();
            }));
            (0, test_1.test)('expect to not be able to pin a message in Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer1.content.openLastMessageMenu();
                yield (0, test_1.expect)(poFederationChannelServer1.content.btnOptionPinMessage).not.toBeVisible();
            }));
            (0, test_1.test)('expect to not be able to pin a message in Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                const channelName = faker_1.faker.string.uuid();
                yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [userFromServer2UsernameOnly]);
                yield poFederationChannelServer1.sidenav.openChat(channelName);
                yield poFederationChannelServer2.sidenav.openChat(channelName);
                yield poFederationChannelServer2.content.sendMessageUsingEnter('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer1.content.lastUserMessageBody).toHaveText('message from Server A');
                yield (0, test_1.expect)(poFederationChannelServer2.content.lastUserMessageBody).toHaveText('message from Server A');
                yield poFederationChannelServer2.content.openLastMessageMenu();
                yield (0, test_1.expect)(poFederationChannelServer2.content.btnOptionPinMessage).not.toBeVisible();
            }));
        });
        test_1.test.describe('Visual Elements', () => {
            (0, test_1.test)('expect to see the file list sent in the channel on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnFileList).toBeVisible();
            }));
            (0, test_1.test)('expect to see the file list sent in the channel on Server B', () => __awaiter(void 0, void 0, void 0, function* () {
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnFileList).toBeVisible();
            }));
            (0, test_1.test)('expect to see all the mentions sent in the channel on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnMentionedMessagesList).toBeVisible();
            }));
            (0, test_1.test)('expect to see all the mentions sent in the channel on Server B', () => __awaiter(void 0, void 0, void 0, function* () {
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnMentionedMessagesList).toBeVisible();
            }));
            (0, test_1.test)('expect to see all the starred messages sent in the channel on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnStarredMessagesList).toBeVisible();
            }));
            (0, test_1.test)('expect to see all the starred messages sent in the channel on Server B', () => __awaiter(void 0, void 0, void 0, function* () {
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnStarredMessagesList).toBeVisible();
            }));
            (0, test_1.test)('expect to not to see the pinned messages sent in the channel on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnPinnedMessagesList).not.toBeVisible();
            }));
            (0, test_1.test)('expect to not to see the pinned messages sent in the channel on Server B', () => __awaiter(void 0, void 0, void 0, function* () {
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnPinnedMessagesList).not.toBeVisible();
            }));
            (0, test_1.test)('expect to not be able to prune messages sent in the channel on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto(`${constants.RC_SERVER_1.url}/home`);
                yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer1.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer1.tabs.btnPruneMessages).not.toBeVisible();
            }));
            (0, test_1.test)('expect to not be able to prune messages sent in the channel on Server B', () => __awaiter(void 0, void 0, void 0, function* () {
                yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
                yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
                yield poFederationChannelServer2.tabs.kebab.click();
                yield (0, test_1.expect)(poFederationChannelServer2.tabs.btnPruneMessages).not.toBeVisible();
            }));
        });
    });
});
