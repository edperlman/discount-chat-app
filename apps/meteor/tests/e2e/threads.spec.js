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
test_1.test.describe.serial('Threads', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
        yield poHomeChannel.sidenav.openChat(targetChannel);
    }));
    (0, test_1.test)('expect thread message preview if alsoSendToChannel checkbox is checked', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.sendMessage('this is a message for reply');
        yield page.locator('[data-qa-type="message"]').last().hover();
        yield page.locator('role=button[name="Reply in thread"]').click();
        yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        yield poHomeChannel.content.toggleAlsoSendThreadToChannel(true);
        yield page.getByRole('dialog').locator('[name="msg"]').last().fill('This is a thread message also sent in channel');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText).toContainText('This is a thread message also sent in channel');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('This is a thread message also sent in channel');
    }));
    (0, test_1.test)('expect open threads contextual bar when clicked on thread preview', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.lastThreadMessagePreviewText.click();
        yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText).toContainText('This is a thread message also sent in channel');
    }));
    test_1.test.describe('hideFlexTab Preference enabled for threads', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, test_1.expect)((yield api.post('/users.setPreferences', { userId: 'rocketchat.internal.admin.test', data: { hideFlexTab: true } })).status()).toBe(200);
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, test_1.expect)((yield api.post('/users.setPreferences', { userId: 'rocketchat.internal.admin.test', data: { hideFlexTab: false } })).status()).toBe(200);
        }));
        (0, test_1.test)('expect to close thread contextual bar on clicking outside', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.lastThreadMessagePreviewText.click();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield poHomeChannel.content.lastUserMessageNotThread.click();
            yield (0, test_1.expect)(page).not.toHaveURL(/.*thread/);
        }));
        (0, test_1.test)('expect open threads contextual bar when clicked on thread preview', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.lastThreadMessagePreviewText.click();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText).toContainText('This is a thread message also sent in channel');
        }));
        (0, test_1.test)('expect not to close thread contextual bar when performing some action', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.lastThreadMessagePreviewText.click();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText).toContainText('This is a thread message also sent in channel');
            yield poHomeChannel.content.openLastMessageMenu();
            yield page.locator('role=menuitem[name="Copy text"]').click();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText).toContainText('This is a thread message also sent in channel');
        }));
    });
    (0, test_1.test)('expect upload a file attachment in thread with description', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.lastThreadMessagePreviewText.click();
        yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        yield poHomeChannel.content.dragAndDropTxtFileToThread();
        yield poHomeChannel.content.descriptionInput.fill('any_description');
        yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageFileDescription).toHaveText('any_description');
        yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageFileName).toContainText('any_file1.txt');
    }));
    test_1.test.describe('thread message actions', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            poHomeChannel = new page_objects_1.HomeChannel(page);
            yield page.goto('/home');
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('this is a message for reply');
            yield page.locator('[data-qa-type="message"]').last().hover();
            yield page.locator('role=button[name="Reply in thread"]').click();
        }));
        (0, test_1.test)('expect delete the thread message and close thread if has only one message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.openLastThreadMessageMenu();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield page.locator('role=menuitem[name="Delete"]').click();
            yield page.locator('#modal-root .rcx-button-group--align-end .rcx-button--danger').click();
            yield (0, test_1.expect)(page).not.toHaveURL(/.*thread/);
        }));
        (0, test_1.test)('expect delete the thread message and keep thread open if has more than one message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.locator('.rcx-vertical-bar').locator(`role=textbox[name="Message #${targetChannel}"]`).type('another reply message');
            yield page.keyboard.press('Enter');
            yield poHomeChannel.content.openLastThreadMessageMenu();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield page.locator('role=menuitem[name="Delete"]').click();
            yield page.locator('#modal-root .rcx-button-group--align-end .rcx-button--danger').click();
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        }));
        (0, test_1.test)('expect edit the thread message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.openLastThreadMessageMenu();
            yield page.locator('role=menuitem[name="Edit"]').click();
            yield page.locator('[name="msg"]').last().fill('this message was edited');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('this message was edited');
        }));
        (0, test_1.test)('expect quote the thread message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.getByRole('dialog').locator('[data-qa-type="message"]').last().hover();
            yield page.locator('role=button[name="Quote"]').click();
            yield page.locator('[name="msg"]').last().fill('this is a quote message');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageTextAttachmentEqualsText).toContainText('this is a message for reply');
        }));
        (0, test_1.test)('expect star the thread message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.openLastThreadMessageMenu();
            yield page.locator('role=menuitem[name="Star"]').click();
            yield page.getByRole('button').and(page.getByTitle('Options')).click();
            yield page.locator('[data-key="starred-messages"]').click();
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('this is a message for reply');
        }));
        (0, test_1.test)('expect copy the thread message content to clipboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, context }) {
            yield context.grantPermissions(['clipboard-read', 'clipboard-write']);
            yield poHomeChannel.content.openLastThreadMessageMenu();
            yield page.locator('role=menuitem[name="Copy text"]').click();
            const clipboardText = yield page.evaluate('navigator.clipboard.readText()');
            (0, test_1.expect)(clipboardText).toBe('this is a message for reply');
        }));
        (0, test_1.test)('expect copy the thread message link to clipboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, context }) {
            yield context.grantPermissions(['clipboard-read', 'clipboard-write']);
            yield poHomeChannel.content.openLastThreadMessageMenu();
            yield page.locator('role=menuitem[name="Copy link"]').click();
            const clipboardText = yield page.evaluate('navigator.clipboard.readText()');
            (0, test_1.expect)(clipboardText).toContain('http');
        }));
        (0, test_1.test)('expect close thread if has only one message and user press escape', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield (0, test_1.expect)(page.getByRole('dialog').locator('[data-qa-type="message"]')).toBeVisible();
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toBeFocused();
            yield page.keyboard.press('Escape');
            yield (0, test_1.expect)(page).not.toHaveURL(/.*thread/);
        }));
        (0, test_1.test)('expect reset the thread composer to original message if user presses escape', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield (0, test_1.expect)(page.getByRole('dialog').locator('[data-qa-type="message"]')).toBeVisible();
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toBeFocused();
            yield page.locator('[name="msg"]').last().fill('message to be edited');
            yield page.keyboard.press('Enter');
            yield page.keyboard.press('ArrowUp');
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toHaveValue('message to be edited');
            yield page.locator('[name="msg"]').last().fill('this message was edited');
            yield page.keyboard.press('Escape');
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toHaveValue('message to be edited');
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        }));
        (0, test_1.test)('expect clean composer and keep the thread open if user is editing message and presses escape', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
            yield (0, test_1.expect)(page.getByRole('dialog').locator('[data-qa-type="message"]')).toBeVisible();
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toBeFocused();
            yield page.locator('[name="msg"]').last().fill('message to be edited');
            yield page.keyboard.press('Enter');
            yield page.keyboard.press('ArrowUp');
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toHaveValue('message to be edited');
            yield page.keyboard.press('Escape');
            yield (0, test_1.expect)(page.locator('[name="msg"]').last()).toHaveValue('');
            yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        }));
    });
});
