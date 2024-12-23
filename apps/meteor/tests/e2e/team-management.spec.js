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
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('teams-management', () => {
    let poHomeTeam;
    let targetChannel;
    const targetTeam = faker_1.faker.string.uuid();
    const targetTeamNonPrivate = faker_1.faker.string.uuid();
    const targetTeamReadOnly = faker_1.faker.string.uuid();
    const targetGroupNameInTeam = faker_1.faker.string.uuid();
    const targetChannelNameInTeam = faker_1.faker.string.uuid();
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/permissions.update', {
            permissions: [
                { _id: 'move-room-to-team', roles: ['admin', 'owner', 'moderator'] },
                { _id: 'create-team-channel', roles: ['admin', 'owner', 'moderator'] },
                { _id: 'create-team-group', roles: ['admin', 'owner', 'moderator'] },
                { _id: 'delete-team-channel', roles: ['admin', 'owner', 'moderator'] },
                { _id: 'delete-team-group', roles: ['admin', 'owner', 'moderator'] },
            ],
        });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeTeam = new page_objects_1.HomeTeam(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('should create targetTeam private', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeTeam.sidenav.openNewByLabel('Team');
        yield poHomeTeam.inputTeamName.fill(targetTeam);
        yield poHomeTeam.addMember('user1');
        yield poHomeTeam.btnTeamCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${targetTeam}`);
    }));
    (0, test_1.test)('should create targetTeamNonPrivate non private', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeTeam.sidenav.openNewByLabel('Team');
        yield poHomeTeam.inputTeamName.fill(targetTeamNonPrivate);
        yield poHomeTeam.textPrivate.click();
        yield poHomeTeam.addMember('user1');
        yield poHomeTeam.btnTeamCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/channel/${targetTeamNonPrivate}`);
    }));
    (0, test_1.test)('should create targetTeamReadOnly readonly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeTeam.sidenav.openNewByLabel('Team');
        yield poHomeTeam.inputTeamName.fill(targetTeamReadOnly);
        yield poHomeTeam.sidenav.advancedSettingsAccordion.click();
        yield poHomeTeam.textReadOnly.click();
        yield poHomeTeam.addMember('user1');
        yield poHomeTeam.btnTeamCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${targetTeamReadOnly}`);
    }));
    (0, test_1.test)('should throw validation error if team name already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeTeam.sidenav.openNewByLabel('Team');
        yield poHomeTeam.inputTeamName.fill(targetTeam);
        yield poHomeTeam.btnTeamCreate.click();
        yield (0, test_1.expect)(poHomeTeam.inputTeamName).toHaveAttribute('aria-invalid', 'true');
    }));
    (0, test_1.test)('should send hello in the targetTeam and reply in a thread', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.content.sendMessage('hello');
        yield page.locator('[data-qa-type="message"]').last().hover();
        yield page.locator('role=button[name="Reply in thread"]').click();
        yield page.locator('.rcx-vertical-bar').locator(`role=textbox[name="Message #${targetTeam}"]`).type('any-reply-message');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeTeam.tabs.flexTabViewThreadMessage).toHaveText('any-reply-message');
    }));
    (0, test_1.test)('should set targetTeam as readonly', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnRoomInfo.click();
        yield poHomeTeam.tabs.room.btnEdit.click();
        yield poHomeTeam.tabs.room.advancedSettingsAccordion.click();
        yield poHomeTeam.tabs.room.checkboxReadOnly.click();
        yield poHomeTeam.tabs.room.btnSave.click();
        yield (0, test_1.expect)(poHomeTeam.content.getSystemMessageByText('set room to read only')).toBeVisible();
    }));
    (0, test_1.test)('should not allow moving room to team if move-room-to-team permission has not been granted', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'move-room-to-team', roles: ['moderator'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.btnAddExisting).not.toBeVisible();
    }));
    (0, test_1.test)('should not allow creating a room in a team if both create-team-channel and create-team-group permissions have not been granted', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', {
            permissions: [
                { _id: 'create-team-channel', roles: ['moderator'] },
                { _id: 'create-team-group', roles: ['moderator'] },
            ],
        })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.btnCreateNew).not.toBeVisible();
    }));
    (0, test_1.test)('should allow creating a channel in a team if user has the create-team-channel permission, but not the create-team-group permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', {
            permissions: [
                { _id: 'create-team-channel', roles: ['admin'] },
                { _id: 'create-team-group', roles: ['moderator'] },
            ],
        })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.btnCreateNew).toBeVisible();
        yield poHomeTeam.tabs.channels.btnCreateNew.click();
        yield poHomeTeam.sidenav.inputChannelName.type(targetChannelNameInTeam);
        yield (0, test_1.expect)(poHomeTeam.sidenav.checkboxPrivateChannel).not.toBeChecked();
        yield (0, test_1.expect)(poHomeTeam.sidenav.checkboxPrivateChannel).toBeDisabled();
        yield poHomeTeam.sidenav.btnCreate.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).toContainText(targetChannelNameInTeam);
    }));
    (0, test_1.test)('should allow creating a group in a team if user has the create-team-group permission, but not the create-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', {
            permissions: [
                { _id: 'create-team-group', roles: ['admin'] },
                { _id: 'create-team-channel', roles: ['moderator'] },
            ],
        })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.btnCreateNew).toBeVisible();
        yield poHomeTeam.tabs.channels.btnCreateNew.click();
        yield poHomeTeam.sidenav.inputChannelName.type(targetGroupNameInTeam);
        yield (0, test_1.expect)(poHomeTeam.sidenav.checkboxPrivateChannel).toBeChecked();
        yield (0, test_1.expect)(poHomeTeam.sidenav.checkboxPrivateChannel).toBeDisabled();
        yield poHomeTeam.sidenav.btnCreate.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).toContainText(targetGroupNameInTeam);
    }));
    (0, test_1.test)('should move targetChannel to targetTeam', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'move-room-to-team', roles: ['owner'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.btnAddExisting.click();
        yield poHomeTeam.tabs.channels.inputChannels.fill(targetChannel);
        yield page.locator(`.rcx-option__content:has-text("${targetChannel}")`).click();
        yield poHomeTeam.tabs.channels.btnAdd.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).toContainText(targetChannel);
    }));
    (0, test_1.test)('should access team channel through targetTeam header', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeTeam.sidenav.openChat(targetChannel);
        yield page.getByRole('button', { name: targetChannel }).first().focus();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Space');
        yield (0, test_1.expect)(page).toHaveURL(`/group/${targetTeam}`);
    }));
    (0, test_1.test)('should not allow removing a targetGroup from targetTeam if user does not have the remove-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'remove-team-channel', roles: ['moderator'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetGroupNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' })).not.toBeVisible();
    }));
    (0, test_1.test)('should allow removing a targetGroup from targetTeam if user has the remove-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'remove-team-channel', roles: ['owner'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetGroupNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' })).toBeVisible();
        yield page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' }).click();
        yield poHomeTeam.tabs.channels.confirmRemoveChannel();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).not.toContainText(targetGroupNameInTeam);
    }));
    (0, test_1.test)('should not allow deleting a targetGroup from targetTeam if the group owner does not have the delete-team-group permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', {
            permissions: [
                { _id: 'delete-team-group', roles: ['moderator'] },
                { _id: 'move-room-to-team', roles: ['owner'] },
            ],
        })).status()).toBe(200);
        // re-add channel to team
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.btnAddExisting.click();
        yield poHomeTeam.tabs.channels.inputChannels.fill(targetGroupNameInTeam);
        yield page.locator(`.rcx-option__content:has-text("${targetGroupNameInTeam}")`).click();
        yield poHomeTeam.tabs.channels.btnAdd.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).toContainText(targetGroupNameInTeam);
        // try to delete group in team
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetGroupNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Delete' })).not.toBeVisible();
    }));
    (0, test_1.test)('should allow deleting a targetGroup from targetTeam if the group owner also has the delete-team-group permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'delete-team-group', roles: ['owner'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetGroupNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Delete' })).toBeVisible();
        yield page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Delete' }).click();
        yield poHomeTeam.tabs.channels.confirmDeleteRoom();
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).not.toContainText(targetGroupNameInTeam);
    }));
    (0, test_1.test)('should not allow removing a targetChannel from targetTeam if user does not have the remove-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'remove-team-channel', roles: ['moderator'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetChannelNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' })).not.toBeVisible();
    }));
    (0, test_1.test)('should allow removing a targetChannel from targetTeam if user has the remove-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'remove-team-channel', roles: ['owner'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetChannelNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' })).toBeVisible();
        yield page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' }).click();
        yield poHomeTeam.tabs.channels.confirmRemoveChannel();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).not.toContainText(targetChannelNameInTeam);
    }));
    (0, test_1.test)('should not allow deleting a targetChannel from targetTeam if the channel owner does not have the delete-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', {
            permissions: [
                { _id: 'delete-team-channel', roles: ['moderator'] },
                { _id: 'move-room-to-team', roles: ['owner'] },
            ],
        })).status()).toBe(200);
        // re-add channel to team
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.btnAddExisting.click();
        yield poHomeTeam.tabs.channels.inputChannels.fill(targetChannelNameInTeam);
        yield page.locator(`.rcx-option__content:has-text("${targetChannelNameInTeam}")`).click();
        yield poHomeTeam.tabs.channels.btnAdd.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).toContainText(targetChannelNameInTeam);
        // try to delete channel in team
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetChannelNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Delete' })).not.toBeVisible();
    }));
    (0, test_1.test)('should allow deleting a targetChannel from targetTeam if the channel owner also has the delete-team-channel permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'delete-team-channel', roles: ['owner'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetChannelNameInTeam);
        yield (0, test_1.expect)(page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Delete' })).toBeVisible();
        yield page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Delete' }).click();
        yield poHomeTeam.tabs.channels.confirmDeleteRoom();
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).not.toContainText(targetChannelNameInTeam);
    }));
    (0, test_1.test)('should remove targetChannel from targetTeam', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        (0, test_1.expect)((yield api.post('/permissions.update', { permissions: [{ _id: 'remove-team-channel', roles: ['owner'] }] })).status()).toBe(200);
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnChannels.click();
        yield poHomeTeam.tabs.channels.openChannelOptionMoreActions(targetChannel);
        yield page.getByRole('menu', { exact: true }).getByRole('menuitem', { name: 'Remove from team' }).click();
        yield poHomeTeam.tabs.channels.confirmRemoveChannel();
        yield (0, test_1.expect)(poHomeTeam.tabs.channels.channelsList).not.toBeVisible();
    }));
    (0, test_1.test)('should remove user1 from targetTeamNonPrivate', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeTeam.sidenav.openChat(targetTeamNonPrivate);
        yield poHomeTeam.tabs.kebab.click({ force: true });
        yield poHomeTeam.tabs.btnTeamMembers.click();
        yield poHomeTeam.tabs.members.showAllUsers();
        yield poHomeTeam.tabs.members.openMemberOptionMoreActions('user1');
        yield poHomeTeam.tabs.members.getMenuItemAction('Remove from team').click();
        yield (0, test_1.expect)(poHomeTeam.tabs.members.confirmRemoveUserModal).toBeVisible();
        yield poHomeTeam.tabs.members.confirmRemoveUser();
        yield (0, test_1.expect)(poHomeTeam.tabs.members.memberOption('user1')).not.toBeVisible();
    }));
    (0, test_1.test)('should delete targetTeamNonPrivate', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeTeam.sidenav.openChat(targetTeamNonPrivate);
        yield poHomeTeam.tabs.btnRoomInfo.click();
        yield poHomeTeam.tabs.room.btnDelete.click();
        yield (0, test_1.expect)(poHomeTeam.tabs.room.confirmDeleteTeamModal).toBeVisible();
        yield poHomeTeam.tabs.room.confirmDeleteTeam();
        yield poHomeTeam.sidenav.searchRoom(targetTeamNonPrivate);
        yield (0, test_1.expect)(poHomeTeam.sidenav.getSearchRoomByName(targetTeamNonPrivate)).not.toBeVisible();
    }));
    (0, test_1.test)('should user1 leave from targetTeam', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        const user1Page = yield browser.newPage({ storageState: userStates_1.Users.user1.state });
        const user1Channel = new page_objects_1.HomeTeam(user1Page);
        yield user1Page.goto(`/group/${targetTeam}`);
        yield user1Channel.content.waitForChannel();
        yield user1Channel.tabs.btnRoomInfo.click();
        yield user1Channel.tabs.room.btnLeave.click();
        yield (0, test_1.expect)(user1Channel.tabs.room.confirmLeaveModal).toBeVisible();
        yield user1Channel.tabs.room.confirmLeave();
        yield user1Page.close();
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.kebab.click({ force: true });
        yield poHomeTeam.tabs.btnTeamMembers.click();
        yield poHomeTeam.tabs.members.showAllUsers();
        yield (0, test_1.expect)(poHomeTeam.tabs.members.memberOption('user1')).not.toBeVisible();
    }));
    (0, test_1.test)('should convert team into a channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeTeam.sidenav.openChat(targetTeam);
        yield poHomeTeam.tabs.btnRoomInfo.click();
        yield poHomeTeam.tabs.room.btnMore.click();
        yield page.getByRole('listbox', { exact: true }).getByRole('option', { name: 'Convert to Channel' }).click();
        yield (0, test_1.expect)(poHomeTeam.tabs.room.confirmConvertModal).toBeVisible();
        yield poHomeTeam.tabs.room.confirmConvert();
        // TODO: improve this locator and check the action reactivity
        yield (0, test_1.expect)(poHomeTeam.content.getSystemMessageByText(`converted #${targetTeam} to channel`)).toBeVisible();
    }));
});
