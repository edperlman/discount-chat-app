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
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
const testAvatars = (homeChannel, channel, url) => {
    (0, test_1.test)('expect sidebar avatar to have provider prefix', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, test_1.expect)(homeChannel.sidenav.getSidebarItemByName(channel).locator('img').getAttribute('src')).toBe(url);
    }));
    (0, test_1.test)('expect channel header avatar to have provider prefix', () => __awaiter(void 0, void 0, void 0, function* () {
        yield homeChannel.sidenav.openChat(channel);
        (0, test_1.expect)(homeChannel.content.channelHeader.locator('img').getAttribute('src')).toBe(url);
    }));
    (0, test_1.test)('expect channel info avatar to have provider prefix', () => __awaiter(void 0, void 0, void 0, function* () {
        yield homeChannel.sidenav.openChat(channel);
        (0, test_1.expect)(homeChannel.content.channelHeader.locator('img').getAttribute('src')).toBe(url);
    }));
};
test_1.test.describe('avatar-settings', () => {
    let poHomeChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.describe('external avatar provider', () => {
        const providerUrlPrefix = 'https://example.com/avatar/';
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_RoomAvatarExternalUrl', `${providerUrlPrefix}{username}`);
            yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AvatarExternalUrl', `${providerUrlPrefix}{username}`);
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_RoomAvatarExternalUrl', '');
            yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AvatarExternalUrl', '');
        }));
        test_1.test.describe('public channels', () => {
            let channelName = '';
            let avatarUrl = '';
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                channelName = yield (0, utils_1.createTargetChannel)(api);
                avatarUrl = `${providerUrlPrefix}${channelName}`;
            }));
            testAvatars(poHomeChannel, channelName, avatarUrl);
        });
        test_1.test.describe('private channels', () => {
            let channelName = '';
            let avatarUrl = '';
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                channelName = yield (0, utils_1.createTargetPrivateChannel)(api);
                avatarUrl = `${providerUrlPrefix}${channelName}`;
            }));
            testAvatars(poHomeChannel, channelName, avatarUrl);
        });
        test_1.test.describe('direct messages', () => {
            const channelName = userStates_1.Users.user2.data.username;
            const avatarUrl = `${providerUrlPrefix}${channelName}`;
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield (0, utils_1.createDirectMessage)(api);
                // send a message as user 2
                test_1.test.use({ storageState: userStates_1.Users.user2.state });
                yield poHomeChannel.sidenav.openChat(userStates_1.Users.user1.data.username);
                yield poHomeChannel.content.sendMessage('hello world');
                test_1.test.use({ storageState: userStates_1.Users.user1.state });
            }));
            testAvatars(poHomeChannel, channelName, avatarUrl);
            (0, test_1.test)('expect message avatar to have provider prefix', () => __awaiter(void 0, void 0, void 0, function* () {
                (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('img').getAttribute('src')).toBe(avatarUrl);
            }));
            (0, test_1.test)('expect user card avatar to have provider prefix', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.content.lastUserMessage.locator('.rcx-message-header__name-container').click();
                (0, test_1.expect)(poHomeChannel.content.userCard.locator('img').getAttribute('src')).toBe(avatarUrl);
            }));
        });
    });
});
