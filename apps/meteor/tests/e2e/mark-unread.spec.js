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
const createAuxContext_1 = require("./fixtures/createAuxContext");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('mark-unread', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        targetChannel = yield (0, utils_1.createTargetChannel)(api, { members: ['user2'] });
        yield page.emulateMedia({ reducedMotion: 'reduce' });
        yield page.goto('/home');
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/channels.delete', { roomName: targetChannel });
    }));
    test_1.test.describe('Mark Unread - Sidebar Action', () => {
        (0, test_1.test)('should not mark empty room as unread', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.selectMarkAsUnread(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.sidenav.getRoomBadge(targetChannel)).not.toBeVisible();
        }));
        (0, test_1.test)('should mark a populated room as unread', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('this is a message for reply');
            yield poHomeChannel.sidenav.selectMarkAsUnread(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.sidenav.getRoomBadge(targetChannel)).toBeVisible();
        }));
        (0, test_1.test)('should mark a populated room as unread - search', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('this is a message for reply');
            yield poHomeChannel.sidenav.selectMarkAsUnread(targetChannel);
            yield poHomeChannel.sidenav.searchRoom(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.sidenav.getSearchChannelBadge(targetChannel)).toBeVisible();
        }));
    });
    test_1.test.describe('Mark Unread - Message Action', () => {
        let poHomeChannelUser2;
        (0, test_1.test)('should mark a populated room as unread', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            const { page: user2Page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2);
            poHomeChannelUser2 = new page_objects_1.HomeChannel(user2Page);
            yield poHomeChannelUser2.sidenav.openChat(targetChannel);
            yield poHomeChannelUser2.content.sendMessage('this is a message for reply');
            yield user2Page.close();
            yield poHomeChannel.sidenav.openChat(targetChannel);
            // wait for the sidebar item to be read
            yield poHomeChannel.sidenav.getSidebarItemByName(targetChannel, true).waitFor();
            yield poHomeChannel.content.openLastMessageMenu();
            yield poHomeChannel.markUnread.click();
            yield (0, test_1.expect)(poHomeChannel.sidenav.getRoomBadge(targetChannel)).toBeVisible();
        }));
    });
});
