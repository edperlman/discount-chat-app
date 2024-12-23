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
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('Messaging', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('should navigate on messages using keyboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.sendMessage('msg1');
        yield poHomeChannel.content.sendMessage('msg2');
        // move focus to the second message
        yield page.keyboard.press('Shift+Tab');
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]').last()).toBeFocused();
        // move focus to the first system message
        yield page.keyboard.press('ArrowUp');
        yield page.keyboard.press('ArrowUp');
        yield (0, test_1.expect)(page.locator('[data-qa="system-message"]').first()).toBeFocused();
        // move focus to the first typed message
        yield page.keyboard.press('ArrowDown');
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]:has-text("msg1")')).toBeFocused();
        // move focus to the room title
        yield page.keyboard.press('Shift+Tab');
        yield (0, test_1.expect)(page.getByRole('button', { name: targetChannel }).first()).toBeFocused();
        // refocus on the first typed message
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]:has-text("msg1")')).toBeFocused();
        // move focus to the message toolbar
        yield page
            .locator('[data-qa-type="message"]:has-text("msg1")')
            .locator('[role=toolbar][aria-label="Message actions"]')
            .getByRole('button', { name: 'Add reaction' })
            .waitFor();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(page
            .locator('[data-qa-type="message"]:has-text("msg1")')
            .locator('[role=toolbar][aria-label="Message actions"]')
            .getByRole('button', { name: 'Add reaction' })).toBeFocused();
        // move focus to the composer
        yield page.keyboard.press('Tab');
        yield page
            .locator('[data-qa-type="message"]:has-text("msg2")')
            .locator('[role=toolbar][aria-label="Message actions"]')
            .getByRole('button', { name: 'Add reaction' })
            .waitFor();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(poHomeChannel.composer).toBeFocused();
    }));
    (0, test_1.test)('should navigate properly on the user card', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        // open UserCard
        yield page.keyboard.press('Shift+Tab');
        yield page.keyboard.press('ArrowUp');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Space');
        yield (0, test_1.expect)(poHomeChannel.userCardToolbar).toBeVisible();
        // close UserCard with Esc
        yield page.keyboard.press('Escape');
        yield (0, test_1.expect)(poHomeChannel.userCardToolbar).not.toBeVisible();
        // with focus restored reopen toolbar
        yield page.keyboard.press('Space');
        yield (0, test_1.expect)(poHomeChannel.userCardToolbar).toBeVisible();
        // close UserCard with button
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Space');
        yield (0, test_1.expect)(poHomeChannel.userCardToolbar).not.toBeVisible();
    }));
    (0, test_1.test)('should not restore focus on the last focused if it was triggered by click', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('[data-qa-type="message"]:has-text("msg1")').click();
        yield poHomeChannel.composer.click();
        yield page.keyboard.press('Shift+Tab');
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]:has-text("msg2")')).toBeFocused();
    }));
    (0, test_1.test)('should not focus on the last message when focusing by click', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('[data-qa-type="message"]:has-text("msg1")').click();
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]').last()).not.toBeFocused();
    }));
    (0, test_1.test)('should focus the latest message when moving the focus on the list and theres no previous focus', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.getByRole('button', { name: targetChannel }).first().focus();
        // move focus to the list
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]').last()).toBeFocused();
        yield page.getByRole('button', { name: targetChannel }).first().focus();
        // move focus to the list again
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(page.locator('[data-qa-type="message"]').last()).toBeFocused();
    }));
    test_1.test.describe('Both contexts', () => {
        let auxContext;
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2);
            auxContext = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
        }));
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield auxContext.page.close();
        }));
        (0, test_1.test)('expect show "hello word" in both contexts (targetChannel)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield auxContext.poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('hello world');
            yield (0, test_1.expect)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(auxContext.poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
                yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
            })).toPass();
        }));
        (0, test_1.test)('expect show "hello word" in both contexts (direct)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat('user2');
            yield auxContext.poHomeChannel.sidenav.openChat('user1');
            yield poHomeChannel.content.sendMessage('hello world');
            yield (0, test_1.expect)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
                yield (0, test_1.expect)(auxContext.poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
            })).toPass();
        }));
    });
});
