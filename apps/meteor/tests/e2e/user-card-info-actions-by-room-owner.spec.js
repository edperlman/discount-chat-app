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
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.parallel('Mention User Card [To Room Owner]', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api, { members: [userStates_1.Users.user1.data.username] });
        yield api.post(`/chat.postMessage`, {
            text: `Hello @${userStates_1.Users.user1.data.username} @${userStates_1.Users.user2.data.username}`,
            channel: targetChannel,
        });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.afterAll(({ api }) => (0, utils_1.deleteChannel)(api, targetChannel));
    (0, test_1.test)('should show correct userinfo actions for a member of the room to the room owner', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        const mentionSpan = page.locator(`span[title="Mentions user"][data-uid="${userStates_1.Users.user1.data.username}"]`);
        yield mentionSpan.click();
        yield (0, test_1.expect)(page.locator('div[aria-label="User card actions"]')).toBeVisible();
        const moreButton = yield page.locator('div[aria-label="User card actions"] button[title="More"]');
        if (yield moreButton.isVisible()) {
            yield moreButton.click();
        }
        const isAddToRoomVisible = (yield page.locator('button[title="Add to room"]').isVisible()) || (yield page.locator('label[data-key="Add to room"]').isVisible());
        yield (0, test_1.expect)(isAddToRoomVisible).toBeFalsy();
        const isRemoveFromRoomVisible = (yield page.locator('button[title="Remove from room"]').isVisible()) ||
            (yield page.locator('label[data-key="Remove from room"]').isVisible());
        yield (0, test_1.expect)(isRemoveFromRoomVisible).toBeTruthy();
        const isSetAsLeaderVisible = (yield page.locator('button[title="Set as leader"]').isVisible()) ||
            (yield page.locator('label[data-key="Set as leader"]').isVisible());
        yield (0, test_1.expect)(isSetAsLeaderVisible).toBeTruthy();
        const isSetAsModeratorVisible = (yield page.locator('button[title="Set as moderator"]').isVisible()) ||
            (yield page.locator('label[data-key="Set as moderator"]').isVisible());
        yield (0, test_1.expect)(isSetAsModeratorVisible).toBeTruthy();
    }));
    (0, test_1.test)('should show correct userinfo actions for a non-member of the room to the room owner', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        const mentionSpan = page.locator(`span[title="Mentions user"][data-uid="${userStates_1.Users.user2.data.username}"]`);
        yield mentionSpan.click();
        yield (0, test_1.expect)(page.locator('div[aria-label="User card actions"]')).toBeVisible();
        const moreButton = yield page.locator('div[aria-label="User card actions"] button[title="More"]');
        if (yield moreButton.isVisible()) {
            yield moreButton.click();
        }
        const isAddToRoomVisible = (yield page.locator('button[title="Add to room"]').isVisible()) || (yield page.locator('label[data-key="Add to room"]').isVisible());
        yield (0, test_1.expect)(isAddToRoomVisible).toBeTruthy();
        const isRemoveFromRoomVisible = (yield page.locator('button[title="Remove from room"]').isVisible()) ||
            (yield page.locator('label[data-key="Remove from room"]').isVisible());
        yield (0, test_1.expect)(isRemoveFromRoomVisible).toBeFalsy();
        const isSetAsLeaderVisible = (yield page.locator('button[title="Set as leader"]').isVisible()) ||
            (yield page.locator('label[data-key="Set as leader"]').isVisible());
        yield (0, test_1.expect)(isSetAsLeaderVisible).toBeFalsy();
        const isSetAsModeratorVisible = (yield page.locator('button[title="Set as moderator"]').isVisible()) ||
            (yield page.locator('label[data-key="Set as moderator"]').isVisible());
        yield (0, test_1.expect)(isSetAsModeratorVisible).toBeFalsy();
    }));
});
