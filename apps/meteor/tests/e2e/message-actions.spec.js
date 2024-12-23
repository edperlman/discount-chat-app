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
const constants_1 = require("./config/constants");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const setUserPreferences_1 = require("./utils/setUserPreferences");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('message-actions', () => {
    let poHomeChannel;
    let poHomeDiscussion;
    let targetChannel;
    let forwardChannel;
    let forwardTeam;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
        forwardChannel = yield (0, utils_1.createTargetChannel)(api);
        forwardTeam = yield (0, utils_1.createTargetTeam)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        poHomeDiscussion = new page_objects_1.HomeDiscussion(page);
        yield page.goto('/home');
        yield poHomeChannel.sidenav.openChat(targetChannel);
    }));
    (0, test_1.test)('expect reply the message in direct', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.sendMessage('this is a message for reply in direct');
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Reply in direct message"]').click();
        yield (0, test_1.expect)(page).toHaveURL(/.*reply/);
    }));
    (0, test_1.test)('expect reply the message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.sendMessage('this is a message for reply');
        yield page.locator('[data-qa-type="message"]').last().hover();
        yield page.locator('role=button[name="Reply in thread"]').click();
        yield page.locator('.rcx-vertical-bar').locator(`role=textbox[name="Message #${targetChannel}"]`).type('this is a reply message');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.tabs.flexTabViewThreadMessage).toHaveText('this is a reply message');
    }));
    // with thread open we listen to the subscription and update the collection from there
    (0, test_1.test)('expect follow/unfollow message with thread open', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('start thread', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.content.sendMessage('this is a message for reply');
            yield page.locator('[data-qa-type="message"]').last().hover();
            yield page.locator('role=button[name="Reply in thread"]').click();
            yield page.getByRole('dialog').locator(`role=textbox[name="Message #${targetChannel}"]`).fill('this is a reply message');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.tabs.flexTabViewThreadMessage).toHaveText('this is a reply message');
        }));
        yield test_1.test.step('unfollow thread', () => __awaiter(void 0, void 0, void 0, function* () {
            const unFollowButton = page
                .locator('[data-qa-type="message"]', { has: page.getByRole('button', { name: 'Following' }) })
                .last()
                .getByRole('button', { name: 'Following' });
            yield (0, test_1.expect)(unFollowButton).toBeVisible();
            yield unFollowButton.click();
        }));
        yield test_1.test.step('follow thread', () => __awaiter(void 0, void 0, void 0, function* () {
            const followButton = page
                .locator('[data-qa-type="message"]', { has: page.getByRole('button', { name: 'Not following' }) })
                .last()
                .getByRole('button', { name: 'Not following' });
            yield (0, test_1.expect)(followButton).toBeVisible();
            yield followButton.click();
            yield (0, test_1.expect)(page
                .locator('[data-qa-type="message"]', { has: page.getByRole('button', { name: 'Following' }) })
                .last()
                .getByRole('button', { name: 'Following' })).toBeVisible();
        }));
    }));
    // with thread closed we depend on message changed updates
    (0, test_1.test)('expect follow/unfollow message with thread closed', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('start thread', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.content.sendMessage('this is a message for reply');
            yield page.locator('[data-qa-type="message"]').last().hover();
            yield page.locator('role=button[name="Reply in thread"]').click();
            yield page.locator('.rcx-vertical-bar').locator(`role=textbox[name="Message #${targetChannel}"]`).fill('this is a reply message');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.tabs.flexTabViewThreadMessage).toHaveText('this is a reply message');
        }));
        // close thread before testing because the behavior changes
        yield page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
        yield test_1.test.step('unfollow thread', () => __awaiter(void 0, void 0, void 0, function* () {
            const unFollowButton = page.locator('[data-qa-type="message"]').last().getByTitle('Following');
            yield (0, test_1.expect)(unFollowButton).toBeVisible();
            yield unFollowButton.click();
        }));
        yield test_1.test.step('follow thread', () => __awaiter(void 0, void 0, void 0, function* () {
            const followButton = page.locator('[data-qa-type="message"]').last().getByTitle('Not following');
            yield (0, test_1.expect)(followButton).toBeVisible();
            yield followButton.click();
            yield (0, test_1.expect)(page.locator('[data-qa-type="message"]').last().getByTitle('Following')).toBeVisible();
        }));
    }));
    (0, test_1.test)('expect edit the message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.sendMessage('This is a message to edit');
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Edit"]').click();
        yield page.locator('[name="msg"]').fill('this message was edited');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('this message was edited');
    }));
    (0, test_1.test)('expect message is deleted', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.sendMessage('Message to delete');
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Delete"]').click();
        yield page.locator('#modal-root .rcx-button-group--align-end .rcx-button--danger').click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('[data-qa-type="message-body"]:has-text("Message to delete")')).toHaveCount(0);
    }));
    (0, test_1.test)('expect quote the message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const message = `Message for quote - ${Date.now()}`;
        yield poHomeChannel.content.sendMessage(message);
        yield page.locator('[data-qa-type="message"]').last().hover();
        yield page.locator('role=button[name="Quote"]').click();
        yield page.locator('[name="msg"]').fill('this is a quote message');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.content.lastMessageTextAttachmentEqualsText).toHaveText(message);
    }));
    (0, test_1.test)('expect create a discussion from message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const message = `Message for discussion - ${Date.now()}`;
        const discussionName = `Discussion Name - ${Date.now()}`;
        yield poHomeChannel.content.sendMessage(message);
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Start a Discussion"]').click();
        const createButton = poHomeDiscussion.btnCreate;
        // Name should be prefilled thus making the create button enabled
        yield (0, test_1.expect)(createButton).not.toBeDisabled();
        yield poHomeDiscussion.inputName.fill(discussionName);
        yield createButton.click();
        yield (0, test_1.expect)(page.locator('header h1')).toHaveText(discussionName);
        yield poHomeChannel.sidenav.openChat(targetChannel);
        // Should fail if more than one discussion has been created
        yield (0, test_1.expect)(poHomeChannel.content.getMessageByText(discussionName)).toHaveCount(1);
    }));
    (0, test_1.test)('expect star the message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.sendMessage('Message to star');
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Star"]').click();
        yield poHomeChannel.dismissToast();
        yield page.locator('role=button[name="Options"]').click();
        yield page.locator('[data-key="starred-messages"]').click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('Message to star');
    }));
    (0, test_1.test)('expect copy the message content to clipboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, context }) {
        yield context.grantPermissions(['clipboard-read', 'clipboard-write']);
        yield poHomeChannel.content.sendMessage('Message to copy');
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Copy text"]').click();
        const clipboardText = yield page.evaluate('navigator.clipboard.readText()');
        (0, test_1.expect)(clipboardText).toBe('Message to copy');
    }));
    (0, test_1.test)('expect copy the message link to clipboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, context }) {
        yield context.grantPermissions(['clipboard-read', 'clipboard-write']);
        yield poHomeChannel.content.sendMessage('Message to permalink');
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Copy link"]').click();
        const clipboardText = yield page.evaluate('navigator.clipboard.readText()');
        (0, test_1.expect)(clipboardText).toContain('http');
    }));
    test_1.test.describe('Preference Hide Contextual Bar by clicking outside of it Enabled', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, setUserPreferences_1.setUserPreferences)(api, { hideFlexTab: true });
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, setUserPreferences_1.setUserPreferences)(api, { hideFlexTab: false });
        }));
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            poHomeChannel = new page_objects_1.HomeChannel(page);
            yield page.goto('/home');
            yield poHomeChannel.sidenav.openChat(targetChannel);
        }));
        (0, test_1.test)('expect reply the message in direct', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.content.sendMessage('this is a message for reply in direct');
            yield poHomeChannel.content.openLastMessageMenu();
            yield page.locator('role=menuitem[name="Reply in direct message"]').click();
            yield (0, test_1.expect)(page).toHaveURL(/.*reply/);
        }));
    });
    (0, test_1.test)('expect forward message to channel', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'this is a message to forward to channel';
        yield poHomeChannel.content.sendMessage(message);
        yield poHomeChannel.content.forwardMessage(forwardChannel);
        yield poHomeChannel.sidenav.openChat(forwardChannel);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(message);
    }));
    (0, test_1.test)('expect forward message to team', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'this is a message to forward to team';
        yield poHomeChannel.content.sendMessage(message);
        yield poHomeChannel.content.forwardMessage(forwardTeam);
        yield poHomeChannel.sidenav.openChat(forwardTeam);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(message);
    }));
    (0, test_1.test)('expect forward message to direct message', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = 'this is a message to forward to direct message';
        const direct = 'RocketChat Internal Admin Test';
        // todo: Forward modal is using name as display and the sidebar is using username
        yield poHomeChannel.content.sendMessage(message);
        yield poHomeChannel.content.forwardMessage(direct);
        yield poHomeChannel.sidenav.openChat(constants_1.ADMIN_CREDENTIALS.username);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(message);
    }));
    (0, test_1.test)('expect forward text file to channel', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = 'any_file.txt';
        yield poHomeChannel.content.sendFileMessage(filename);
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
        yield poHomeChannel.content.forwardMessage(forwardChannel);
        yield poHomeChannel.sidenav.openChat(forwardChannel);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
    }));
    (0, test_1.test)('expect forward image file to channel', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = 'test-image.jpeg';
        yield poHomeChannel.content.sendFileMessage(filename);
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
        yield poHomeChannel.content.forwardMessage(forwardChannel);
        yield poHomeChannel.sidenav.openChat(forwardChannel);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
    }));
    (0, test_1.test)('expect forward pdf file to channel', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = 'test_pdf_file.pdf';
        yield poHomeChannel.content.sendFileMessage(filename);
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
        yield poHomeChannel.content.forwardMessage(forwardChannel);
        yield poHomeChannel.sidenav.openChat(forwardChannel);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
    }));
    (0, test_1.test)('expect forward audio message to channel', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = 'sample-audio.mp3';
        yield poHomeChannel.content.sendFileMessage(filename);
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
        yield poHomeChannel.content.forwardMessage(forwardChannel);
        yield poHomeChannel.sidenav.openChat(forwardChannel);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
    }));
    (0, test_1.test)('expect forward video message to channel', () => __awaiter(void 0, void 0, void 0, function* () {
        const filename = 'test_video.mp4';
        yield poHomeChannel.content.sendFileMessage(filename);
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
        yield poHomeChannel.content.forwardMessage(forwardChannel);
        yield poHomeChannel.sidenav.openChat(forwardChannel);
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(filename);
    }));
});
