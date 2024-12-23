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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const constants_1 = require("./config/constants");
const createAuxContext_1 = require("./fixtures/createAuxContext");
const inject_initial_data_1 = __importDefault(require("./fixtures/inject-initial-data"));
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('e2e-encryption initial setup', () => {
    let poAccountProfile;
    let poHomeChannel;
    let password;
    const newPassword = 'new password';
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAccountProfile = new page_objects_1.AccountProfile(page);
        poHomeChannel = new page_objects_1.HomeChannel(page);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: true });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: true });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: false });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.recreateContext();
    }));
    (0, test_1.test)("expect reset user's e2e encryption key", (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/account/security');
        // Reset key to start the flow from the beginning
        // It will execute a logout
        yield poAccountProfile.securityE2EEncryptionSection.click();
        yield poAccountProfile.securityE2EEncryptionResetKeyButton.click();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        // Login again, check the banner to save the generated password and test it
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin);
        yield page.locator('role=banner >> text="Save your encryption password"').click();
        password = (yield page.evaluate(() => localStorage.getItem('e2e.randomPassword'))) || 'undefined';
        yield (0, test_1.expect)(page.locator('#modal-root')).toContainText(password);
        yield page.locator('#modal-root .rcx-button-group--align-end .rcx-button--primary').click();
        yield (0, test_1.expect)(page.locator('role=banner >> text="Save your encryption password"')).not.toBeVisible();
        yield poHomeChannel.sidenav.logout();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin);
        yield page.locator('role=banner >> text="Enter your E2E password"').click();
        yield page.locator('#modal-root input').fill(password);
        yield page.locator('#modal-root .rcx-button--primary').click();
        yield (0, test_1.expect)(page.locator('role=banner >> text="Enter your E2E password"')).not.toBeVisible();
        yield (0, userStates_1.storeState)(page, userStates_1.Users.admin);
    }));
    (0, test_1.test)('expect change the e2ee password', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/account/security');
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin);
        yield poAccountProfile.securityE2EEncryptionSection.click();
        yield poAccountProfile.securityE2EEncryptionPassword.click();
        yield poAccountProfile.securityE2EEncryptionPassword.fill(newPassword);
        yield poAccountProfile.securityE2EEncryptionPasswordConfirmation.fill(newPassword);
        yield poAccountProfile.securityE2EEncryptionSavePasswordButton.click();
        yield poAccountProfile.btnClose.click();
        yield poHomeChannel.sidenav.logout();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin, { except: ['public_key', 'private_key'] });
        yield page.locator('role=banner >> text="Enter your E2E password"').click();
        yield page.locator('#modal-root input').fill(password);
        yield page.locator('#modal-root .rcx-button--primary').click();
        yield page.locator('role=banner >> text="Wasn\'t possible to decode your encryption key to be imported."').click();
        yield page.locator('#modal-root input').fill(newPassword);
        yield page.locator('#modal-root .rcx-button--primary').click();
        yield (0, test_1.expect)(page.locator('role=banner >> text="Wasn\'t possible to decode your encryption key to be imported."')).not.toBeVisible();
        yield (0, test_1.expect)(page.locator('role=banner >> text="Enter your E2E password"')).not.toBeVisible();
    }));
    (0, test_1.test)('expect placeholder text in place of encrypted message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/home');
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('This is an encrypted message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This is an encrypted message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        // Logout and login
        yield poHomeChannel.sidenav.logout();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin, { except: ['private_key', 'public_key'] });
        yield poHomeChannel.sidenav.openChat(channelName);
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('This message is end-to-end encrypted. To view it, you must enter your encryption key in your account settings.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield poHomeChannel.content.lastUserMessage.hover();
        yield (0, test_1.expect)(page.locator('[role=toolbar][aria-label="Message actions"]')).not.toBeVisible();
    }));
    (0, test_1.test)('expect placeholder text in place of encrypted file description, when non-encrypted files upload in disabled e2ee room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, }) {
        yield page.goto('/home');
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield poHomeChannel.sidenav.openChat(channelName);
        yield poHomeChannel.content.dragAndDropTxtFile();
        yield poHomeChannel.content.descriptionInput.fill('any_description');
        yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('any_description');
        yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file1.txt');
        yield test_1.test.step('disable E2EE in the room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.tabs.kebab.click();
            yield (0, test_1.expect)(poHomeChannel.tabs.btnDisableE2E).toBeVisible();
            yield poHomeChannel.tabs.btnDisableE2E.click();
            yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Disable encryption' })).toBeVisible();
            yield page.getByRole('button', { name: 'Disable encryption' }).click();
            yield poHomeChannel.dismissToast();
            // will wait till the key icon in header goes away
            yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toHaveCount(0);
        }));
        yield page.reload();
        yield test_1.test.step('upload the file in disabled E2EE room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).not.toBeVisible();
            yield poHomeChannel.content.dragAndDropTxtFile();
            yield poHomeChannel.content.descriptionInput.fill('any_description');
            yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
            yield poHomeChannel.content.btnModalConfirm.click();
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).not.toBeVisible();
            yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('any_description');
            yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file1.txt');
        }));
        yield test_1.test.step('Enable E2EE in the room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.tabs.kebab.click();
            yield (0, test_1.expect)(poHomeChannel.tabs.btnEnableE2E).toBeVisible();
            yield poHomeChannel.tabs.btnEnableE2E.click();
            yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Enable encryption' })).toBeVisible();
            yield page.getByRole('button', { name: 'Enable encryption' }).click();
            yield poHomeChannel.dismissToast();
            // will wait till the key icon in header appears
            yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toHaveCount(1);
        }));
        // Logout to remove e2ee keys
        yield poHomeChannel.sidenav.logout();
        // Login again
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin, { except: ['private_key', 'public_key'] });
        yield poHomeChannel.sidenav.openChat(channelName);
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.nthMessage(0)).toContainText('This message is end-to-end encrypted. To view it, you must enter your encryption key in your account settings.');
        yield (0, test_1.expect)(poHomeChannel.content.nthMessage(0).locator('.rcx-icon--name-key')).toBeVisible();
    }));
});
test_1.test.describe.serial('e2e-encryption', () => {
    let poHomeChannel;
    test_1.test.use({ storageState: userStates_1.Users.userE2EE.state });
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield api.post('/settings/E2E_Enable', { value: true });
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: true });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: false });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
    }));
    (0, test_1.test)('expect create a private channel encrypted and send an encrypted message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield (0, test_1.expect)(poHomeChannel.tabs.btnDisableE2E).toBeVisible();
        yield poHomeChannel.tabs.btnDisableE2E.click({ force: true });
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Disable encryption' })).toBeVisible();
        yield page.getByRole('button', { name: 'Disable encryption' }).click();
        yield poHomeChannel.dismissToast();
        yield page.waitForTimeout(1000);
        yield poHomeChannel.content.sendMessage('hello world not encrypted');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world not encrypted');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).not.toBeVisible();
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield (0, test_1.expect)(poHomeChannel.tabs.btnEnableE2E).toBeVisible();
        yield poHomeChannel.tabs.btnEnableE2E.click({ force: true });
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Enable encryption' })).toBeVisible();
        yield page.getByRole('button', { name: 'Enable encryption' }).click();
        yield poHomeChannel.dismissToast();
        yield page.waitForTimeout(1000);
        yield poHomeChannel.content.sendMessage('hello world encrypted again');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world encrypted again');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
    }));
    (0, test_1.test)('expect create a private encrypted channel and send a encrypted thread message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('This is the thread main message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This is the thread main message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield page.locator('[data-qa-type="message"]').last().hover();
        yield page.locator('role=button[name="Reply in thread"]').click();
        yield (0, test_1.expect)(page).toHaveURL(/.*thread/);
        yield (0, test_1.expect)(poHomeChannel.content.mainThreadMessageText).toContainText('This is the thread main message.');
        yield (0, test_1.expect)(poHomeChannel.content.mainThreadMessageText.locator('.rcx-icon--name-key')).toBeVisible();
        yield poHomeChannel.content.toggleAlsoSendThreadToChannel(true);
        yield page.getByRole('dialog').locator('[name="msg"]').last().fill('This is an encrypted thread message also sent in channel');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText).toContainText('This is an encrypted thread message also sent in channel');
        yield (0, test_1.expect)(poHomeChannel.content.lastThreadMessageText.locator('.rcx-icon--name-key')).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('This is an encrypted thread message also sent in channel');
        yield (0, test_1.expect)(poHomeChannel.content.mainThreadMessageText).toContainText('This is the thread main message.');
        yield (0, test_1.expect)(poHomeChannel.content.mainThreadMessageText.locator('.rcx-icon--name-key')).toBeVisible();
    }));
    (0, test_1.test)('expect create a private encrypted channel and check disabled message menu actions on an encrypted message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('This is an encrypted message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This is an encrypted message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield page.locator('[data-qa-type="message"]').last().hover();
        yield (0, test_1.expect)(page.locator('role=button[name="Forward message not available on encrypted content"]')).toBeDisabled();
        yield poHomeChannel.content.openLastMessageMenu();
        yield (0, test_1.expect)(page.locator('role=menuitem[name="Reply in direct message"]')).toHaveClass(/disabled/);
        yield (0, test_1.expect)(page.locator('role=menuitem[name="Copy link"]')).toHaveClass(/disabled/);
    }));
    (0, test_1.test)('expect create a private channel, encrypt it and send an encrypted message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield (0, test_1.expect)(poHomeChannel.toastSuccess).toBeVisible();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield (0, test_1.expect)(poHomeChannel.tabs.btnEnableE2E).toBeVisible();
        yield poHomeChannel.tabs.btnEnableE2E.click({ force: true });
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Enable encryption' })).toBeVisible();
        yield page.getByRole('button', { name: 'Enable encryption' }).click();
        yield page.waitForTimeout(1000);
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
    }));
    (0, test_1.test)('expect create a encrypted private channel and mention user', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('hello @user1');
        const userMention = yield page.getByRole('button', {
            name: 'user1',
        });
        yield (0, test_1.expect)(userMention).toBeVisible();
    }));
    (0, test_1.test)('expect create a encrypted private channel, mention a channel and navigate to it', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('Are you in the #general channel?');
        const channelMention = yield page.getByRole('button', {
            name: 'general',
        });
        yield (0, test_1.expect)(channelMention).toBeVisible();
        yield channelMention.click();
        yield (0, test_1.expect)(page).toHaveURL(`/channel/general`);
    }));
    (0, test_1.test)('expect create a encrypted private channel, mention a channel and user', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('Are you in the #general channel, @user1 ?');
        const channelMention = yield page.getByRole('button', {
            name: 'general',
        });
        const userMention = yield page.getByRole('button', {
            name: 'user1',
        });
        yield (0, test_1.expect)(userMention).toBeVisible();
        yield (0, test_1.expect)(channelMention).toBeVisible();
    }));
    (0, test_1.test)('should encrypted field be available on edit room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield (0, test_1.expect)(poHomeChannel.toastSuccess).toBeVisible();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.tabs.btnRoomInfo.click();
        yield poHomeChannel.tabs.room.btnEdit.click();
        yield poHomeChannel.tabs.room.advancedSettingsAccordion.click();
        yield (0, test_1.expect)(poHomeChannel.tabs.room.checkboxEncrypted).toBeVisible();
    }));
    (0, test_1.test)('expect create a Direct message, encrypt it and attempt to enable OTR', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openNewByLabel('Direct message');
        yield poHomeChannel.sidenav.inputDirectUsername.click();
        yield page.keyboard.type('user2');
        yield page.waitForTimeout(1000);
        yield page.keyboard.press('Enter');
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/direct/user2${userStates_1.Users.userE2EE.data.username}`);
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield (0, test_1.expect)(poHomeChannel.tabs.btnEnableE2E).toBeVisible();
        yield poHomeChannel.tabs.btnEnableE2E.click({ force: true });
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Enable encryption' })).toBeVisible();
        yield page.getByRole('button', { name: 'Enable encryption' }).click();
        yield page.waitForTimeout(1000);
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield (0, test_1.expect)(poHomeChannel.tabs.btnEnableOTR).toBeVisible();
        yield poHomeChannel.tabs.btnEnableOTR.click({ force: true });
        yield (0, test_1.expect)(page.getByText('OTR not available')).toBeVisible();
    }));
    test_1.test.describe('File Encryption', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/FileUpload_MediaTypeWhiteList', { value: '' });
            yield api.post('/settings/FileUpload_MediaTypeBlackList', { value: 'image/svg+xml' });
        }));
        (0, test_1.test)('File and description encryption', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield test_1.test.step('create an encrypted channel', () => __awaiter(void 0, void 0, void 0, function* () {
                const channelName = faker_1.faker.string.uuid();
                yield poHomeChannel.sidenav.openNewByLabel('Channel');
                yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
                yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
                yield poHomeChannel.sidenav.checkboxEncryption.click();
                yield poHomeChannel.sidenav.btnCreate.click();
                yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
                yield poHomeChannel.dismissToast();
                yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
            }));
            yield test_1.test.step('send a file in channel', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.content.dragAndDropTxtFile();
                yield poHomeChannel.content.descriptionInput.fill('any_description');
                yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
                yield poHomeChannel.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
                yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('any_description');
                yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file1.txt');
            }));
        }));
        (0, test_1.test)('File encryption with whitelisted and blacklisted media types', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
            yield test_1.test.step('create an encrypted room', () => __awaiter(void 0, void 0, void 0, function* () {
                const channelName = faker_1.faker.string.uuid();
                yield poHomeChannel.sidenav.openNewByLabel('Channel');
                yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
                yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
                yield poHomeChannel.sidenav.checkboxEncryption.click();
                yield poHomeChannel.sidenav.btnCreate.click();
                yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
                yield poHomeChannel.dismissToast();
                yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
            }));
            yield test_1.test.step('send a text file in channel', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.content.dragAndDropTxtFile();
                yield poHomeChannel.content.descriptionInput.fill('message 1');
                yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
                yield poHomeChannel.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
                yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('message 1');
                yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file1.txt');
            }));
            yield test_1.test.step('set whitelisted media type setting', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api.post('/settings/FileUpload_MediaTypeWhiteList', { value: 'text/plain' });
            }));
            yield test_1.test.step('send text file again with whitelist setting set', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.content.dragAndDropTxtFile();
                yield poHomeChannel.content.descriptionInput.fill('message 2');
                yield poHomeChannel.content.fileNameInput.fill('any_file2.txt');
                yield poHomeChannel.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
                yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('message 2');
                yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file2.txt');
            }));
            yield test_1.test.step('set blacklisted media type setting to not accept application/octet-stream media type', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api.post('/settings/FileUpload_MediaTypeBlackList', { value: 'application/octet-stream' });
            }));
            yield test_1.test.step('send text file again with blacklisted setting set, file upload should fail', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.content.dragAndDropTxtFile();
                yield poHomeChannel.content.descriptionInput.fill('message 3');
                yield poHomeChannel.content.fileNameInput.fill('any_file3.txt');
                yield poHomeChannel.content.btnModalConfirm.click();
                yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
                yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('message 2');
                yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file2.txt');
            }));
        }));
        test_1.test.describe('File encryption setting disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield api.post('/settings/E2E_Enable_Encrypt_Files', { value: false });
                yield api.post('/settings/FileUpload_MediaTypeBlackList', { value: 'application/octet-stream' });
            }));
            test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield api.post('/settings/E2E_Enable_Encrypt_Files', { value: true });
                yield api.post('/settings/FileUpload_MediaTypeBlackList', { value: 'image/svg+xml' });
            }));
            (0, test_1.test)('Upload file without encryption in e2ee room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield test_1.test.step('create an encrypted channel', () => __awaiter(void 0, void 0, void 0, function* () {
                    const channelName = faker_1.faker.string.uuid();
                    yield poHomeChannel.sidenav.openNewByLabel('Channel');
                    yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
                    yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
                    yield poHomeChannel.sidenav.checkboxEncryption.click();
                    yield poHomeChannel.sidenav.btnCreate.click();
                    yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
                    yield poHomeChannel.dismissToast();
                    yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
                }));
                yield test_1.test.step('send a test encrypted message to check e2ee is working', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poHomeChannel.content.sendMessage('This is an encrypted message.');
                    yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This is an encrypted message.');
                    yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
                }));
                yield test_1.test.step('send a text file in channel, file should not be encrypted', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poHomeChannel.content.dragAndDropTxtFile();
                    yield poHomeChannel.content.descriptionInput.fill('any_description');
                    yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
                    yield poHomeChannel.content.btnModalConfirm.click();
                    yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).not.toBeVisible();
                    yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('any_description');
                    yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file1.txt');
                }));
            }));
        }));
    }));
    (0, test_1.test)('expect slash commands to be enabled in an e2ee room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test_1.test.skip(!constants_1.IS_EE, 'Premium Only');
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('This is an encrypted message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This is an encrypted message.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield page.locator('[name="msg"]').type('/');
        yield (0, test_1.expect)(page.locator('#popup-item-contextualbar')).not.toHaveClass(/disabled/);
        yield page.locator('[name="msg"]').clear();
        yield poHomeChannel.content.dispatchSlashCommand('/contextualbar');
        yield (0, test_1.expect)(poHomeChannel.btnContextualbarClose).toBeVisible();
        yield poHomeChannel.btnContextualbarClose.click();
        yield (0, test_1.expect)(poHomeChannel.btnContextualbarClose).toBeHidden();
    }));
    test_1.test.describe('un-encrypted messages not allowed in e2ee rooms', () => {
        test_1.test.skip(!constants_1.IS_EE, 'Premium Only');
        let poHomeChannel;
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            poHomeChannel = new page_objects_1.HomeChannel(page);
            yield page.goto('/home');
        }));
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: true });
        }));
        (0, test_1.test)('expect slash commands to be disabled in an e2ee room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const channelName = faker_1.faker.string.uuid();
            yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
            yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
            yield poHomeChannel.dismissToast();
            yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
            yield poHomeChannel.content.sendMessage('This is an encrypted message.');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This is an encrypted message.');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
            yield page.locator('[name="msg"]').pressSequentially('/');
            yield (0, test_1.expect)(page.locator('#popup-item-contextualbar')).toHaveClass(/disabled/);
        }));
    });
    (0, test_1.test)('expect create a private channel, send unecrypted messages, encrypt the channel and delete the last message and check the last message in the sidebar', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, }) {
        const channelName = faker_1.faker.string.uuid();
        // Enable Sidebar Extended display mode
        yield poHomeChannel.sidenav.setDisplayMode('Extended');
        // Create private channel
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield (0, test_1.expect)(poHomeChannel.toastSuccess).toBeVisible();
        yield poHomeChannel.dismissToast();
        // Send Unencrypted Messages
        yield poHomeChannel.content.sendMessage('first unencrypted message');
        yield poHomeChannel.content.sendMessage('second unencrypted message');
        // Encrypt channel
        yield poHomeChannel.tabs.kebab.click({ force: true });
        yield (0, test_1.expect)(poHomeChannel.tabs.btnEnableE2E).toBeVisible();
        yield poHomeChannel.tabs.btnEnableE2E.click({ force: true });
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Enable encryption' })).toBeVisible();
        yield page.getByRole('button', { name: 'Enable encryption' }).click();
        yield page.waitForTimeout(1000);
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        // Send Encrypted Messages
        const encriptedMessage1 = 'first ENCRYPTED message';
        const encriptedMessage2 = 'second ENCRYPTED message';
        yield poHomeChannel.content.sendMessage(encriptedMessage1);
        yield poHomeChannel.content.sendMessage(encriptedMessage2);
        //  Delete last message
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText(encriptedMessage2);
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Delete"]').click();
        yield page.locator('#modal-root .rcx-button-group--align-end .rcx-button--danger').click();
        // Check last message in the sidebar
        const sidebarChannel = yield poHomeChannel.sidenav.getSidebarItemByName(channelName);
        yield (0, test_1.expect)(sidebarChannel).toBeVisible();
        yield (0, test_1.expect)(sidebarChannel.locator('span')).toContainText(encriptedMessage1);
    }));
    (0, test_1.test)('expect create a private encrypted channel and pin/star an encrypted message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        yield poHomeChannel.content.sendMessage('This message should be pinned and stared.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('This message should be pinned and stared.');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Star"]').click();
        yield (0, test_1.expect)(poHomeChannel.toastSuccess).toBeVisible();
        yield poHomeChannel.dismissToast();
        yield poHomeChannel.content.openLastMessageMenu();
        yield page.locator('role=menuitem[name="Pin"]').click();
        yield page.locator('#modal-root >> button:has-text("Yes, pin message")').click();
        yield poHomeChannel.tabs.kebab.click();
        yield poHomeChannel.tabs.btnPinnedMessagesList.click();
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Pinned Messages' })).toBeVisible();
        const lastPinnedMessage = page.getByRole('dialog', { name: 'Pinned Messages' }).locator('[data-qa-type="message"]').last();
        yield (0, test_1.expect)(lastPinnedMessage).toContainText('This message should be pinned and stared.');
        yield lastPinnedMessage.hover();
        yield lastPinnedMessage.locator('role=button[name="More"]').waitFor();
        yield lastPinnedMessage.locator('role=button[name="More"]').click();
        yield (0, test_1.expect)(page.locator('role=menuitem[name="Copy link"]')).toHaveClass(/disabled/);
        yield poHomeChannel.btnContextualbarClose.click();
        yield poHomeChannel.tabs.kebab.click();
        yield poHomeChannel.tabs.btnStarredMessageList.click();
        const lastStarredMessage = page.getByRole('dialog', { name: 'Starred Messages' }).locator('[data-qa-type="message"]').last();
        yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Starred Messages' })).toBeVisible();
        yield (0, test_1.expect)(lastStarredMessage).toContainText('This message should be pinned and stared.');
        yield lastStarredMessage.hover();
        yield lastStarredMessage.locator('role=button[name="More"]').waitFor();
        yield lastStarredMessage.locator('role=button[name="More"]').click();
        yield (0, test_1.expect)(page.locator('role=menuitem[name="Copy link"]')).toHaveClass(/disabled/);
    }));
    test_1.test.describe('reset keys', () => {
        let anotherClientPage;
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            anotherClientPage = (yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.userE2EE)).page;
        }));
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield anotherClientPage.close();
        }));
        (0, test_1.test)('expect force logout on e2e keys reset', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const poAccountProfile = new page_objects_1.AccountProfile(page);
            yield page.goto('/account/security');
            yield poAccountProfile.securityE2EEncryptionSection.click();
            yield poAccountProfile.securityE2EEncryptionResetKeyButton.click();
            yield (0, test_1.expect)(page.locator('role=button[name="Login"]')).toBeVisible();
            yield (0, test_1.expect)(anotherClientPage.locator('role=button[name="Login"]')).toBeVisible();
        }));
    });
});
test_1.test.describe.serial('e2ee room setup', () => {
    let poAccountProfile;
    let poHomeChannel;
    let e2eePassword;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAccountProfile = new page_objects_1.AccountProfile(page);
        poHomeChannel = new page_objects_1.HomeChannel(page);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: true });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: false });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.recreateContext();
    }));
    (0, test_1.test)('expect save password state on encrypted room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/account/security');
        yield poAccountProfile.securityE2EEncryptionSection.click();
        yield poAccountProfile.securityE2EEncryptionResetKeyButton.click();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin);
        yield page.goto('/home');
        yield (0, test_1.expect)(page.locator('role=banner >> text="Save your encryption password"')).toBeVisible();
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
        yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
        yield poHomeChannel.sidenav.checkboxEncryption.click();
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon.first()).toBeVisible();
        yield (0, test_1.expect)(page.locator('role=button[name="Save E2EE password"]')).toBeVisible();
        yield poHomeChannel.tabs.btnE2EERoomSetupDisableE2E.waitFor();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnE2EERoomSetupDisableE2E).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnTabMembers).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnRoomInfo).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.inputMessage).not.toBeVisible();
        yield page.locator('role=button[name="Save E2EE password"]').click();
        e2eePassword = (yield page.evaluate(() => localStorage.getItem('e2e.randomPassword'))) || 'undefined';
        yield (0, test_1.expect)(page.locator('role=dialog[name="Save your encryption password"]')).toBeVisible();
        yield (0, test_1.expect)(page.locator('#modal-root')).toContainText(e2eePassword);
        yield page.locator('#modal-root >> button:has-text("I saved my password")').click();
        yield poHomeChannel.content.inputMessage.waitFor();
        yield poHomeChannel.content.sendMessage('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
    }));
    (0, test_1.test)('expect enter password state on encrypted room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/home');
        // Logout to remove e2ee keys
        yield poHomeChannel.sidenav.logout();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin, { except: ['private_key', 'public_key'] });
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
        yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
        yield poHomeChannel.sidenav.checkboxEncryption.click();
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon.first()).toBeVisible();
        yield page.locator('role=button[name="Enter your E2E password"]').waitFor();
        yield (0, test_1.expect)(page.locator('role=banner >> text="Enter your E2E password"')).toBeVisible();
        yield poHomeChannel.tabs.btnE2EERoomSetupDisableE2E.waitFor();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnE2EERoomSetupDisableE2E).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnTabMembers).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnRoomInfo).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.content.inputMessage).not.toBeVisible();
        yield page.locator('role=button[name="Enter your E2E password"]').click();
        yield page.locator('#modal-root input').fill(e2eePassword);
        yield page.locator('#modal-root .rcx-button--primary').click();
        yield (0, test_1.expect)(page.locator('role=banner >> text="Enter your E2E password"')).not.toBeVisible();
        yield poHomeChannel.content.inputMessage.waitFor();
        // For E2EE to complete init setup
        yield page.waitForTimeout(300);
        yield poHomeChannel.content.sendMessage('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield (0, userStates_1.storeState)(page, userStates_1.Users.admin);
    }));
    (0, test_1.test)('expect waiting for room keys state', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/home');
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.fill(channelName);
        yield poHomeChannel.sidenav.advancedSettingsAccordion.click();
        yield poHomeChannel.sidenav.checkboxEncryption.click();
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon.first()).toBeVisible();
        yield poHomeChannel.content.sendMessage('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('hello world');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
        yield poHomeChannel.sidenav.userProfileMenu.click();
        yield poHomeChannel.sidenav.accountProfileOption.click();
        yield page.locator('role=navigation >> a:has-text("Security")').click();
        yield poAccountProfile.securityE2EEncryptionSection.click();
        yield poAccountProfile.securityE2EEncryptionResetKeyButton.click();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield page.reload();
        yield page.locator('role=button[name="Login"]').waitFor();
        yield (0, inject_initial_data_1.default)();
        yield (0, userStates_1.restoreState)(page, userStates_1.Users.admin);
        yield page.locator('role=navigation >> role=button[name=Search]').click();
        yield page.locator('role=search >> role=searchbox').fill(channelName);
        yield page.locator(`role=search >> role=listbox >> role=link >> text="${channelName}"`).click();
        yield page.locator('role=button[name="Save E2EE password"]').click();
        yield page.locator('#modal-root >> button:has-text("I saved my password")').click();
        yield (0, test_1.expect)(poHomeChannel.content.inputMessage).not.toBeVisible();
        yield (0, test_1.expect)(page.locator('.rcx-states__title')).toContainText('Check back later');
        yield poHomeChannel.tabs.btnE2EERoomSetupDisableE2E.waitFor();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnE2EERoomSetupDisableE2E).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnTabMembers).toBeVisible();
        yield (0, test_1.expect)(poHomeChannel.tabs.btnRoomInfo).toBeVisible();
    }));
});
test_1.test.describe('e2ee support legacy formats', () => {
    test_1.test.use({ storageState: userStates_1.Users.userE2EE.state });
    let poHomeChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: true });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/E2E_Enable', { value: false });
        yield api.post('/settings/E2E_Allow_Unencrypted_Messages', { value: false });
    }));
    //  ->>>>>>>>>>>Not testing upload since it was not implemented in the legacy format
    (0, test_1.test)('expect create a private channel encrypted and send an encrypted message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, request }) {
        yield page.goto('/home');
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.createEncryptedChannel(channelName);
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
        yield poHomeChannel.dismissToast();
        yield (0, test_1.expect)(poHomeChannel.content.encryptedRoomHeaderIcon).toBeVisible();
        const rid = yield page.locator('[data-qa-rc-room]').getAttribute('data-qa-rc-room');
        // send old format encrypted message via API
        const msg = yield page.evaluate((rid) => __awaiter(void 0, void 0, void 0, function* () {
            // eslint-disable-next-line import/no-unresolved, @typescript-eslint/no-var-requires, import/no-absolute-path
            const { e2e } = require('/app/e2e/client/rocketchat.e2e.ts');
            const e2eRoom = yield e2e.getInstanceByRoomId(rid);
            return e2eRoom.encrypt({ _id: 'id', msg: 'Old format message' });
        }), rid);
        yield request.post(`${constants_1.BASE_API_URL}/chat.sendMessage`, {
            headers: {
                'X-Auth-Token': userStates_1.Users.userE2EE.data.loginToken,
                'X-User-Id': userStates_1.Users.userE2EE.data._id,
            },
            data: {
                message: {
                    rid,
                    msg,
                    t: 'e2e',
                },
            },
        });
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageBody).toHaveText('Old format message');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.locator('.rcx-icon--name-key')).toBeVisible();
    }));
});
