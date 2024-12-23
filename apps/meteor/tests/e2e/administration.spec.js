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
test_1.test.describe.parallel('administration', () => {
    let poAdmin;
    let poUtils;
    let targetChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAdmin = new page_objects_1.Admin(page);
        poUtils = new page_objects_1.Utils(page);
    }));
    test_1.test.describe('Workspace', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/info');
        }));
        (0, test_1.test)('expect download info as JSON', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const [download] = yield Promise.all([page.waitForEvent('download'), page.locator('button:has-text("Download info")').click()]);
            yield (0, test_1.expect)(download.suggestedFilename()).toBe('statistics.json');
        }));
    });
    test_1.test.describe('Engagement dashboard', () => {
        (0, test_1.test)('Should show upsell modal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            test_1.test.skip(constants_1.IS_EE);
            yield page.goto('/admin/engagement/users');
            yield (0, test_1.expect)(page.locator('role=dialog[name="Engagement dashboard"]')).toBeVisible();
        }));
        (0, test_1.test)('Should show engagement dashboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            test_1.test.skip(!constants_1.IS_EE);
            yield page.goto('/admin/engagement/users');
            yield (0, test_1.expect)(page.locator('h1 >> text="Engagement"')).toBeVisible();
        }));
    });
    test_1.test.describe('Device management', () => {
        (0, test_1.test)('Should show upsell modal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            test_1.test.skip(constants_1.IS_EE);
            yield page.goto('/admin/device-management');
            yield (0, test_1.expect)(page.locator('role=dialog[name="Device management"]')).toBeVisible();
        }));
        (0, test_1.test)('Should show device management page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            test_1.test.skip(!constants_1.IS_EE);
            yield page.goto('/admin/device-management');
            yield (0, test_1.expect)(page.locator('h1 >> text="Device management"')).toBeVisible();
        }));
    });
    test_1.test.describe('Users', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/users');
        }));
        (0, test_1.test)('expect find "user1" user', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poAdmin.inputSearchUsers.type('user1');
            yield (0, test_1.expect)(page.locator('table tr[qa-user-id="user1"]')).toBeVisible();
        }));
        (0, test_1.test)('expect create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.tabs.users.btnNewUser.click();
            yield poAdmin.tabs.users.inputEmail.type(faker_1.faker.internet.email());
            yield poAdmin.tabs.users.inputName.type(faker_1.faker.person.firstName());
            yield poAdmin.tabs.users.inputUserName.type(faker_1.faker.internet.userName());
            yield poAdmin.tabs.users.inputSetManually.click();
            yield poAdmin.tabs.users.inputPassword.type('any_password');
            yield poAdmin.tabs.users.inputConfirmPassword.type('any_password');
            yield (0, test_1.expect)(poAdmin.tabs.users.userRole).toBeVisible();
            yield poAdmin.tabs.users.btnSave.click();
        }));
        (0, test_1.test)('expect SMTP setup warning and routing to email settings', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poAdmin.tabs.users.btnInvite.click();
            yield poAdmin.tabs.users.setupSmtpLink.click();
            yield (0, test_1.expect)(page).toHaveURL('/admin/settings/Email');
        }));
        (0, test_1.test)('expect to show join default channels option only when creating new users, not when editing users', () => __awaiter(void 0, void 0, void 0, function* () {
            const username = faker_1.faker.internet.userName();
            yield poAdmin.tabs.users.btnNewUser.click();
            yield poAdmin.tabs.users.inputName.type(faker_1.faker.person.firstName());
            yield poAdmin.tabs.users.inputUserName.type(username);
            yield poAdmin.tabs.users.inputEmail.type(faker_1.faker.internet.email());
            yield poAdmin.tabs.users.inputSetManually.click();
            yield poAdmin.tabs.users.inputPassword.type('any_password');
            yield poAdmin.tabs.users.inputConfirmPassword.type('any_password');
            yield (0, test_1.expect)(poAdmin.tabs.users.userRole).toBeVisible();
            yield (0, test_1.expect)(poAdmin.tabs.users.joinDefaultChannels).toBeVisible();
            yield poAdmin.tabs.users.btnSave.click();
            yield poAdmin.inputSearchUsers.fill(username);
            yield poAdmin.getUserRow(username).click();
            yield poAdmin.btnEdit.click();
            yield (0, test_1.expect)(poAdmin.tabs.users.inputUserName).toHaveValue(username);
            yield (0, test_1.expect)(poAdmin.tabs.users.joinDefaultChannels).not.toBeVisible();
        }));
    });
    test_1.test.describe('Rooms', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            targetChannel = yield (0, utils_1.createTargetChannel)(api);
        }));
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/rooms');
        }));
        (0, test_1.test)('should find "general" channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poAdmin.inputSearchRooms.type('general');
            yield page.waitForSelector('[qa-room-id="GENERAL"]');
        }));
        (0, test_1.test)('should edit target channel name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.inputSearchRooms.fill(targetChannel);
            yield poAdmin.getRoomRow(targetChannel).click();
            yield poAdmin.roomNameInput.fill(`${targetChannel}-edited`);
            yield poAdmin.btnSave.click();
            yield (0, test_1.expect)(poAdmin.getRoomRow(targetChannel)).toContainText(`${targetChannel}-edited`);
            targetChannel = `${targetChannel}-edited`;
        }));
        (0, test_1.test)('should edit target channel type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.inputSearchRooms.type(targetChannel);
            yield poAdmin.getRoomRow(targetChannel).click();
            yield poAdmin.privateLabel.click();
            yield poAdmin.btnSave.click();
            yield (0, test_1.expect)(poAdmin.getRoomRow(targetChannel)).toContainText('Private Channel');
        }));
        (0, test_1.test)('should archive target channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.inputSearchRooms.type(targetChannel);
            yield poAdmin.getRoomRow(targetChannel).click();
            yield poAdmin.archivedLabel.click();
            yield poAdmin.btnSave.click();
            yield poAdmin.getRoomRow(targetChannel).click();
            yield (0, test_1.expect)(poAdmin.archivedInput).toBeChecked();
        }));
        test_1.test.describe.serial('Default rooms', () => {
            (0, test_1.test)('expect target channel to be default', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAdmin.inputSearchRooms.type(targetChannel);
                yield poAdmin.getRoomRow(targetChannel).click();
                yield poAdmin.defaultLabel.click();
                yield test_1.test.step('should close contextualbar after saving', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poAdmin.btnSave.click();
                    yield (0, test_1.expect)(poAdmin.page).toHaveURL(new RegExp('/admin/rooms$'));
                }));
                yield poAdmin.getRoomRow(targetChannel).click();
                yield (0, test_1.expect)(poAdmin.defaultInput).toBeChecked();
            }));
            (0, test_1.test)('should mark target default channel as "favorite by default"', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAdmin.inputSearchRooms.type(targetChannel);
                yield poAdmin.getRoomRow(targetChannel).click();
                yield poAdmin.favoriteLabel.click();
                yield poAdmin.btnSave.click();
                yield (0, test_1.expect)(poAdmin.btnSave).not.toBeVisible();
                yield poAdmin.getRoomRow(targetChannel).click();
                yield (0, test_1.expect)(poAdmin.favoriteInput).toBeChecked();
            }));
            (0, test_1.test)('should see favorite switch disabled when default is not true', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAdmin.inputSearchRooms.type(targetChannel);
                yield poAdmin.getRoomRow(targetChannel).click();
                yield poAdmin.defaultLabel.click();
                yield (0, test_1.expect)(poAdmin.favoriteInput).toBeDisabled();
            }));
            (0, test_1.test)('should see favorite switch enabled when default is true', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAdmin.inputSearchRooms.type(targetChannel);
                yield poAdmin.getRoomRow(targetChannel).click();
                yield (0, test_1.expect)(poAdmin.favoriteInput).toBeEnabled();
            }));
        });
    });
    test_1.test.describe('Permissions', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/permissions');
        }));
        (0, test_1.test)('expect open upsell modal if not enterprise', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            test_1.test.skip(constants_1.IS_EE);
            yield poAdmin.btnCreateRole.click();
            yield (0, test_1.expect)(page.getByRole('dialog', { name: 'Custom roles' })).toBeVisible();
        }));
        test_1.test.describe('Users in role', () => {
            const channelName = faker_1.faker.string.uuid();
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                // TODO: refactor createChannel utility in order to get channel data when creating
                const response = yield api.post('/channels.create', { name: channelName, members: ['user1'] });
                const { channel } = yield response.json();
                yield api.post('/channels.addOwner', { roomId: channel._id, userId: userStates_1.Users.user1.data._id });
                yield api.post('/channels.removeOwner', { roomId: channel._id, userId: userStates_1.Users.admin.data._id });
            }));
            (0, test_1.test)('admin should be able to get the owners of a room that wasnt created by him', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield poAdmin.openRoleByName('Owner').click();
                yield poAdmin.btnUsersInRole.click();
                yield poAdmin.inputRoom.fill(channelName);
                yield page.getByRole('option', { name: channelName }).click();
                yield (0, test_1.expect)(poAdmin.getUserRowByUsername('user1')).toBeVisible();
            }));
            (0, test_1.test)('should add user1 as moderator of target channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield poAdmin.openRoleByName('Moderator').click();
                yield poAdmin.btnUsersInRole.click();
                yield poAdmin.inputRoom.fill(channelName);
                yield page.getByRole('option', { name: channelName }).click();
                yield poAdmin.inputUsers.fill('user1');
                yield page.getByRole('option', { name: 'user1' }).click();
                yield poAdmin.btnAdd.click();
                yield (0, test_1.expect)(poAdmin.getUserRowByUsername('user1')).toBeVisible();
            }));
            (0, test_1.test)('should remove user1 as moderator of target channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield poAdmin.openRoleByName('Moderator').click();
                yield poAdmin.btnUsersInRole.click();
                yield poAdmin.inputRoom.fill(channelName);
                yield page.getByRole('option', { name: channelName }).click();
                yield poAdmin.getUserRowByUsername('user1').getByRole('button', { name: 'Remove' }).click();
                yield poUtils.btnModalConfirmDelete.click();
                yield (0, test_1.expect)(page.locator('h3 >> text="No results found"')).toBeVisible();
            }));
            (0, test_1.test)('should back to the permissions page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield poAdmin.openRoleByName('Moderator').click();
                yield poAdmin.btnUsersInRole.click();
                yield poAdmin.btnBack.click();
                yield (0, test_1.expect)(page.locator('h1 >> text="Permissions"')).toBeVisible();
            }));
        });
    });
    test_1.test.describe('Mailer', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/mailer');
        }));
        (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ makeAxeBuilder }) {
            const results = yield makeAxeBuilder().analyze();
            (0, test_1.expect)(results.violations).toEqual([]);
        }));
    });
    test_1.test.describe('Integrations', () => {
        const messageCodeHighlightDefault = 'javascript,css,markdown,dockerfile,json,go,rust,clean,bash,plaintext,powershell,scss,shell,yaml,vim';
        const incomingIntegrationName = faker_1.faker.string.uuid();
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'Message_Code_highlight', '');
        }));
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/integrations');
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'Message_Code_highlight', messageCodeHighlightDefault);
        }));
        (0, test_1.test)('should display the example payload correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.btnNew.click();
            yield poAdmin.btnInstructions.click();
            yield (0, test_1.expect)(poAdmin.codeExamplePayload('Loading')).not.toBeVisible();
        }));
        (0, test_1.test)('should be able to create new incoming integration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.btnNew.click();
            yield poAdmin.inputName.fill(incomingIntegrationName);
            yield poAdmin.inputPostToChannel.fill('#general');
            yield poAdmin.inputPostAs.fill(userStates_1.Users.admin.data.username);
            yield poAdmin.btnSave.click();
            yield (0, test_1.expect)(poAdmin.inputWebhookUrl).not.toHaveValue('Will be available here after saving.');
            yield poAdmin.btnBack.click();
            yield (0, test_1.expect)(poAdmin.getIntegrationByName(incomingIntegrationName)).toBeVisible();
        }));
        (0, test_1.test)('should be able to delete an incoming integration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.getIntegrationByName(incomingIntegrationName).click();
            yield poAdmin.btnDelete.click();
            yield poUtils.btnModalConfirmDelete.click();
            yield (0, test_1.expect)(poAdmin.getIntegrationByName(incomingIntegrationName)).not.toBeVisible();
        }));
    });
});
