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
const faker_1 = require("@faker-js/faker");
const constants_1 = require("./config/constants");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('channel-management', () => {
    let poHomeChannel;
    let targetChannel;
    let discussionName;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('should navigate on toolbar using arrow keys', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.sendMessage('hello composer');
        yield poHomeChannel.roomHeaderFavoriteBtn.focus();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('ArrowRight');
        yield page.keyboard.press('ArrowRight');
        yield (0, test_1.expect)(poHomeChannel.roomHeaderToolbar.getByRole('button', { name: 'Threads', exact: true })).toBeFocused();
    }));
    (0, test_1.test)('should move the focus away from toolbar using tab key', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.roomHeaderFavoriteBtn.focus();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(poHomeChannel.roomHeaderToolbar.getByRole('button', { name: 'Call' })).not.toBeFocused();
    }));
    (0, test_1.test)('should be able to navigate on call popup with keyboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test_1.test.skip(!constants_1.IS_EE, 'Premium Only');
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.roomHeaderFavoriteBtn.focus();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Space');
        yield page.keyboard.press('Space');
        yield poHomeChannel.content.btnStartVideoCall.waitFor();
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(page.getByRole('button', { name: 'Start call' })).toBeFocused();
    }));
    (0, test_1.test)('should add user1 to targetChannel', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.btnTabMembers.click();
        yield poHomeChannel.tabs.members.showAllUsers();
        yield poHomeChannel.tabs.members.addUser('user1');
        yield (0, test_1.expect)(poHomeChannel.tabs.members.memberOption('user1')).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('added user1')).toBeVisible();
    }));
    (0, test_1.test)('should edit topic of targetChannel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield poHomeChannel.tabs.room.btnEdit.click();
        yield poHomeChannel.tabs.room.inputTopic.fill('hello-topic-edited');
        yield poHomeChannel.tabs.room.btnSave.click();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield (0, test_1.expect)(page.getByRole('heading', { name: 'hello-topic-edited' })).toBeVisible();
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Channel info' })).toContainText('hello-topic-edited');
        yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('changed room topic to hello-topic-edited')).toBeVisible();
    }));
    (0, test_1.test)('should edit announcement of targetChannel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield poHomeChannel.tabs.room.btnEdit.click();
        yield poHomeChannel.tabs.room.inputAnnouncement.fill('hello-announcement-edited');
        yield poHomeChannel.tabs.room.btnSave.click();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Channel info' })).toContainText('hello-announcement-edited');
        yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('changed room announcement to: hello-announcement-edited')).toBeVisible();
    }));
    (0, test_1.test)('should edit description of targetChannel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield poHomeChannel.tabs.room.btnEdit.click();
        yield poHomeChannel.tabs.room.inputDescription.fill('hello-description-edited');
        yield poHomeChannel.tabs.room.btnSave.click();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Channel info' })).toContainText('hello-description-edited');
        yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('changed room description to: hello-description-edited')).toBeVisible();
    }));
    (0, test_1.test)('should edit name of targetChannel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield poHomeChannel.tabs.room.btnEdit.click();
        yield poHomeChannel.tabs.room.inputName.fill(`NAME-EDITED-${targetChannel}`);
        yield poHomeChannel.tabs.room.btnSave.click();
        targetChannel = `NAME-EDITED-${targetChannel}`;
        yield (0, test_1.expect)(page.locator(`role=main >> role=heading[name="${targetChannel}"]`)).toBeVisible();
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield (0, test_1.expect)(page).toHaveURL(`/channel/${targetChannel}`);
    }));
    (0, test_1.test)('should truncate the room name for small screens', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const hugeName = faker_1.faker.string.alpha(200);
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield poHomeChannel.tabs.room.btnEdit.click();
        yield poHomeChannel.tabs.room.inputName.fill(hugeName);
        yield poHomeChannel.tabs.room.btnSave.click();
        targetChannel = hugeName;
        yield page.setViewportSize({ width: 640, height: 460 });
        yield (0, test_1.expect)(page.getByRole('heading', { name: hugeName })).toHaveCSS('width', '419px');
    }));
    (0, test_1.test)('should open sidebar clicking on sidebar toggler', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.setViewportSize({ width: 640, height: 460 });
        yield page.getByRole('button', { name: 'Open sidebar' }).click();
        yield (0, test_1.expect)(page.getByRole('navigation')).toBeVisible();
    }));
    (0, test_1.test)('should open room info when clicking on roomName', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.getByRole('button', { name: targetChannel }).first().focus();
        yield page.keyboard.press('Space');
        yield page.getByRole('dialog').waitFor();
        yield (0, test_1.expect)(page.getByRole('dialog')).toBeVisible();
    }));
    (0, test_1.test)('should create a discussion using the message composer', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        discussionName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.btnMenuMoreActions.click();
        yield page.getByRole('menuitem', { name: 'Discussion' }).click();
        yield page.getByRole('textbox', { name: 'Name' }).fill(discussionName);
        yield page.getByRole('button', { name: 'Create' }).click();
        yield (0, test_1.expect)(page.getByRole('heading', { name: discussionName })).toBeVisible();
    }));
    (0, test_1.test)('should access targetTeam through discussion header', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('[data-qa-type="message"]', { hasText: discussionName }).locator('button').first().click();
        yield page.getByRole('button', { name: discussionName }).first().focus();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Space');
        yield (0, test_1.expect)(page).toHaveURL(`/channel/${targetChannel}`);
    }));
    (0, test_1.test)('should edit notification preferences of targetChannel', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield poHomeChannel.tabs.btnNotificationPreferences.click({ force: true });
        yield poHomeChannel.tabs.notificationPreferences.updateAllNotificationPreferences();
        yield poHomeChannel.tabs.notificationPreferences.btnSave.click();
        yield (0, test_1.expect)(poHomeChannel.tabs.notificationPreferences.getPreferenceByDevice('Desktop')).toContainText('Mentions');
        yield (0, test_1.expect)(poHomeChannel.tabs.notificationPreferences.getPreferenceByDevice('Mobile')).toContainText('Mentions');
        yield (0, test_1.expect)(poHomeChannel.tabs.notificationPreferences.getPreferenceByDevice('Email')).toContainText('Mentions');
    }));
    test_1.test.describe.serial('cross user tests', () => {
        let user1Page;
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            user1Page = yield browser.newPage({ storageState: userStates_1.Users.user1.state });
        }));
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user1Page.close();
        }));
        (0, test_1.test)('should mute user1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnTabMembers.click();
            yield poHomeChannel.tabs.members.showAllUsers();
            yield poHomeChannel.tabs.members.muteUser('user1');
            yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('muted user1')).toBeVisible();
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield (0, test_1.expect)(user1Channel.readOnlyFooter).toBeVisible();
        }));
        (0, test_1.test)('should unmuteUser user1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnTabMembers.click();
            yield poHomeChannel.tabs.members.showAllUsers();
            yield poHomeChannel.tabs.members.unmuteUser('user1');
            yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('unmuted user1')).toBeVisible();
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield (0, test_1.expect)(user1Channel.composer).toBeVisible();
        }));
        (0, test_1.test)('should set user1 as moderator', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnTabMembers.click();
            yield poHomeChannel.tabs.members.showAllUsers();
            yield poHomeChannel.tabs.members.setUserAsModerator('user1');
            yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('set user1 as moderator')).toBeVisible();
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield user1Channel.tabs.btnRoomInfo.click();
            yield (0, test_1.expect)(user1Channel.tabs.room.btnEdit).toBeVisible();
        }));
        (0, test_1.test)('should set user1 as owner', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnTabMembers.click();
            yield poHomeChannel.tabs.members.showAllUsers();
            yield poHomeChannel.tabs.members.setUserAsOwner('user1');
            yield (0, test_1.expect)(poHomeChannel.content.getSystemMessageByText('set user1 as owner')).toBeVisible();
            const user1Page = yield browser.newPage({ storageState: userStates_1.Users.user1.state });
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield user1Channel.tabs.btnRoomInfo.click();
            yield user1Channel.tabs.room.btnMore.click();
            yield (0, test_1.expect)(user1Channel.tabs.room.optionDelete).toBeVisible();
            yield user1Page.close();
        }));
        (0, test_1.test)('should ignore user1 messages', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnTabMembers.click();
            yield poHomeChannel.tabs.members.showAllUsers();
            yield poHomeChannel.tabs.members.ignoreUser('user1');
            yield poHomeChannel.tabs.members.openMoreActions();
            yield (0, test_1.expect)(poHomeChannel.tabs.members.getMenuItemAction('Unignore')).toBeVisible();
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield user1Channel.content.sendMessage('message to check ignore');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toContainText('This message was ignored');
        }));
        (0, test_1.test)('should unignore single user1 message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield user1Channel.content.sendMessage('only message to be unignored');
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toContainText('This message was ignored');
            yield poHomeChannel.content.lastIgnoredUserMessage.click();
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toContainText('only message to be unignored');
        }));
        (0, test_1.test)('should unignore user1 messages', () => __awaiter(void 0, void 0, void 0, function* () {
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield user1Channel.content.sendMessage('message before being unignored');
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toContainText('This message was ignored');
            yield poHomeChannel.tabs.btnTabMembers.click();
            yield poHomeChannel.tabs.members.showAllUsers();
            yield poHomeChannel.tabs.members.unignoreUser('user1');
            yield poHomeChannel.tabs.members.openMoreActions();
            yield (0, test_1.expect)(poHomeChannel.tabs.members.getMenuItemAction('Ignore')).toBeVisible();
            yield user1Channel.content.sendMessage('message after being unignored');
            yield (0, test_1.expect)(poHomeChannel.content.nthMessage(-2)).toContainText('message before being unignored');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toContainText('message after being unignored');
        }));
        (0, test_1.test)('should readOnlyChannel show join button', () => __awaiter(void 0, void 0, void 0, function* () {
            const channelName = faker_1.faker.string.uuid();
            yield poHomeChannel.sidenav.openNewByLabel('Channel');
            yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
            yield poHomeChannel.sidenav.checkboxPrivateChannel.click();
            yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
            yield poHomeChannel.sidenav.checkboxReadOnly.click();
            yield poHomeChannel.sidenav.btnCreate.click();
            const channel = new page_objects_1.HomeChannel(user1Page);
            yield user1Page.goto(`/channel/${channelName}`);
            yield channel.content.waitForChannel();
            yield (0, test_1.expect)(user1Page.locator('button >> text="Join"')).toBeVisible();
        }));
    });
});
