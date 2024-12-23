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
const createAuxContext_1 = require("./fixtures/createAuxContext");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
const convertTimeUnit_1 = require("../../client/lib/convertTimeUnit");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('retention-policy', () => {
    let poHomeChannel;
    const targetChannel = faker_1.faker.string.uuid();
    let targetTeam;
    let targetGroup;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const response = yield api.post('/channels.create', { name: targetChannel, members: ['user1'] });
        const { channel } = yield response.json();
        yield api.post('/channels.addOwner', { roomId: channel._id, userId: userStates_1.Users.user1.data._id });
        targetGroup = yield (0, utils_1.createTargetPrivateChannel)(api);
        targetTeam = yield (0, utils_1.createTargetTeam)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.describe('retention policy disabled', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_Enabled', false);
        }));
        (0, test_1.test)('should not show prune banner in channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).not.toBeVisible();
        }));
        (0, test_1.test)('should not show prune banner in team', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetTeam);
            yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).not.toBeVisible();
        }));
        (0, test_1.test)('should not show prune section on edit channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnRoomInfo.click();
            yield poHomeChannel.tabs.room.btnEdit.click();
            yield (0, test_1.expect)(poHomeChannel.tabs.room.pruneAccordion).not.toBeVisible();
        }));
    });
    test_1.test.describe('retention policy enabled', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_Enabled', true);
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_Enabled', false);
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_AppliesToChannels', false);
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_AppliesToGroups', false);
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_AppliesToDMs', false);
            yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_TTL_Channels', (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, 30));
        }));
        (0, test_1.test)('should not show prune banner even with retention policy setting enabled in any type of room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).not.toBeVisible();
            yield poHomeChannel.sidenav.openChat(targetTeam);
            yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).not.toBeVisible();
            yield poHomeChannel.sidenav.openChat(targetGroup);
            yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).not.toBeVisible();
            yield poHomeChannel.sidenav.openChat('user1');
            yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).not.toBeVisible();
        }));
        (0, test_1.test)('should show prune section in edit channel', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.tabs.btnRoomInfo.click();
            yield poHomeChannel.tabs.room.btnEdit.click();
            yield (0, test_1.expect)(poHomeChannel.tabs.room.pruneAccordion).toBeVisible();
        }));
        test_1.test.describe('edit-room-retention-policy permission', () => __awaiter(void 0, void 0, void 0, function* () {
            let auxContext;
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
                const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
                auxContext = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
                yield auxContext.poHomeChannel.sidenav.openChat(targetChannel);
                yield auxContext.poHomeChannel.tabs.btnRoomInfo.click();
                yield auxContext.poHomeChannel.tabs.room.btnEdit.click();
            }));
            test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield auxContext.page.close();
            }));
            (0, test_1.test)('should not show prune section in edit channel for users without permission', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poHomeChannel.tabs.room.pruneAccordion).not.toBeVisible();
            }));
            (0, test_1.test)('users without permission should be able to edit the channel', () => __awaiter(void 0, void 0, void 0, function* () {
                yield auxContext.poHomeChannel.tabs.room.advancedSettingsAccordion.click();
                yield auxContext.poHomeChannel.tabs.room.checkboxReadOnly.check();
                yield auxContext.poHomeChannel.tabs.room.btnSave.click();
                yield (0, test_1.expect)(auxContext.poHomeChannel.content.getSystemMessageByText('set room to read only')).toBeVisible();
            }));
        }));
        test_1.test.describe('retention policy applies enabled by default', () => {
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_AppliesToChannels', true);
                yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_AppliesToGroups', true);
                yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_AppliesToDMs', true);
            }));
            (0, test_1.test)('should prune old messages checkbox enabled by default in channel and show retention policy banner', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.sidenav.openChat(targetChannel);
                yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).toBeVisible();
                yield poHomeChannel.tabs.btnRoomInfo.click();
                yield poHomeChannel.tabs.room.btnEdit.click();
                yield poHomeChannel.tabs.room.pruneAccordion.click();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.checkboxPruneMessages).toBeChecked();
            }));
            (0, test_1.test)('should prune old messages checkbox enabled by default in team and show retention policy banner', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.sidenav.openChat(targetTeam);
                yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).toBeVisible();
                yield poHomeChannel.tabs.btnRoomInfo.click();
                yield poHomeChannel.tabs.room.btnEdit.click();
                yield poHomeChannel.tabs.room.pruneAccordion.click();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.checkboxPruneMessages).toBeChecked();
            }));
            (0, test_1.test)('should prune old messages checkbox enabled by default in group and show retention policy banner', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.sidenav.openChat(targetGroup);
                yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).toBeVisible();
                yield poHomeChannel.tabs.btnRoomInfo.click();
                yield poHomeChannel.tabs.room.btnEdit.click();
                yield poHomeChannel.tabs.room.pruneAccordion.click();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.checkboxPruneMessages).toBeChecked();
            }));
            (0, test_1.test)('should show retention policy banner in DMs', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.sidenav.openChat('user1');
                yield (0, test_1.expect)(poHomeChannel.content.channelRetentionPolicyWarning).toBeVisible();
            }));
        });
        test_1.test.describe('retention policy override', () => {
            let ignoreThreadsSetting;
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                ignoreThreadsSetting = (yield (0, utils_1.getSettingValueById)(api, 'RetentionPolicy_DoNotPruneThreads'));
                (0, test_1.expect)((yield (0, utils_1.setSettingValueById)(api, 'RetentionPolicy_TTL_Channels', (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, 15))).status()).toBe(200);
            }));
            test_1.test.beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.sidenav.openChat(targetChannel);
                yield poHomeChannel.tabs.btnRoomInfo.click();
                yield poHomeChannel.tabs.room.btnEdit.click();
                yield poHomeChannel.tabs.room.pruneAccordion.click();
            }));
            (0, test_1.test)('should display the default max age in edit channel', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.tabs.room.checkboxOverrideGlobalRetention.click();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.getMaxAgeLabel('15')).toBeVisible();
            }));
            (0, test_1.test)('should display overridden retention max age value', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.tabs.room.checkboxOverrideGlobalRetention.click();
                yield poHomeChannel.tabs.room.inputRetentionMaxAge.fill('365');
                yield poHomeChannel.tabs.room.btnSave.click();
                yield poHomeChannel.dismissToast();
                yield poHomeChannel.tabs.btnRoomInfo.click();
                yield poHomeChannel.tabs.room.btnEdit.click();
                yield poHomeChannel.tabs.room.pruneAccordion.click();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.getMaxAgeLabel('15')).toBeVisible();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.inputRetentionMaxAge).toHaveValue('365');
            }));
            (0, test_1.test)('should ignore threads be checked accordingly with the global default value', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poHomeChannel.tabs.room.checkboxIgnoreThreads).toBeChecked({ checked: ignoreThreadsSetting });
            }));
            (0, test_1.test)('should override ignore threads default value', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeChannel.tabs.room.checkboxIgnoreThreads.click();
                yield poHomeChannel.tabs.room.btnSave.click();
                yield poHomeChannel.dismissToast();
                yield poHomeChannel.tabs.btnRoomInfo.click();
                yield poHomeChannel.tabs.room.btnEdit.click();
                yield poHomeChannel.tabs.room.pruneAccordion.click();
                yield (0, test_1.expect)(poHomeChannel.tabs.room.checkboxIgnoreThreads).toBeChecked({ checked: !ignoreThreadsSetting });
            }));
        });
    });
});
