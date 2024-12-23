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
const setUserPreferences_1 = require("./utils/setUserPreferences");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('feature preview', () => {
    let poHomeChannel;
    let poAccountProfile;
    let targetChannel;
    let sidepanelTeam;
    const targetChannelNameInTeam = `channel-from-team-${faker_1.faker.number.int()}`;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, utils_1.setSettingValueById)(api, 'Accounts_AllowFeaturePreview', true);
        targetChannel = yield (0, utils_1.createTargetChannel)(api, { members: ['user1'] });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, utils_1.setSettingValueById)(api, 'Accounts_AllowFeaturePreview', false);
        yield (0, utils_1.deleteChannel)(api, targetChannel);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        poAccountProfile = new page_objects_1.AccountProfile(page);
    }));
    (0, test_1.test)('should show "Message" and "Navigation" feature sections', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/account/feature-preview');
        yield (0, test_1.expect)(page.getByRole('button', { name: 'Message' })).toBeVisible();
        yield (0, test_1.expect)(page.getByRole('button', { name: 'Navigation' })).toBeVisible();
    }));
    test_1.test.describe('Enhanced navigation', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, setUserPreferences_1.setUserPreferences)(api, {
                featuresPreview: [
                    {
                        name: 'newNavigation',
                        value: true,
                    },
                ],
            });
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, setUserPreferences_1.setUserPreferences)(api, {
                featuresPreview: [
                    {
                        name: 'newNavigation',
                        value: false,
                    },
                ],
            });
        }));
        // After moving `Enhanced navigation` out of feature preview, move these tests to sidebar.spec.ts
        (0, test_1.test)('should be able to toggle "Enhanced navigation" feature', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/account/feature-preview');
            yield poAccountProfile.getAccordionItemByName('Navigation').click();
            const newNavigationCheckbox = poAccountProfile.getCheckboxByLabelText('Enhanced navigation');
            yield (0, test_1.expect)(newNavigationCheckbox).toBeChecked();
            yield newNavigationCheckbox.click();
            yield (0, test_1.expect)(newNavigationCheckbox).not.toBeChecked();
        }));
        (0, test_1.test)('should be rendering new UI with "Enhanced navigation"', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/account/feature-preview');
            yield (0, test_1.expect)(poHomeChannel.navbar.navbar).toBeVisible();
        }));
        (0, test_1.test)('should display "Recent" button on sidebar search section, and display recent chats when clicked', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            yield poHomeChannel.sidebar.btnRecent.click();
            yield (0, test_1.expect)(poHomeChannel.sidebar.sidebar.getByRole('heading', { name: 'Recent' })).toBeVisible();
        }));
        (0, test_1.test)('should expand/collapse sidebar groups', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            const collapser = poHomeChannel.sidebar.firstCollapser;
            let isExpanded;
            yield collapser.click();
            isExpanded = (yield collapser.getAttribute('aria-expanded')) === 'true';
            (0, test_1.expect)(isExpanded).toBeFalsy();
            yield collapser.click();
            isExpanded = (yield collapser.getAttribute('aria-expanded')) === 'true';
            (0, test_1.expect)(isExpanded).toBeTruthy();
        }));
        (0, test_1.test)('should expand/collapse sidebar groups with keyboard', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            const collapser = poHomeChannel.sidebar.firstCollapser;
            yield (0, test_1.expect)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield collapser.focus();
                yield (0, test_1.expect)(collapser).toBeFocused();
                yield page.keyboard.press('Enter');
                const isExpanded = (yield collapser.getAttribute('aria-expanded')) === 'true';
                (0, test_1.expect)(isExpanded).toBeFalsy();
            })).toPass();
            yield (0, test_1.expect)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield collapser.focus();
                yield page.keyboard.press('Space');
                const isExpanded = (yield collapser.getAttribute('aria-expanded')) === 'true';
                (0, test_1.expect)(isExpanded).toBeTruthy();
            })).toPass();
        }));
        (0, test_1.test)('should be able to use keyboard to navigate through sidebar items', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            const collapser = poHomeChannel.sidebar.firstCollapser;
            const dataIndex = yield collapser.locator('../..').getAttribute('data-index');
            const nextItem = page.locator(`[data-index="${Number(dataIndex) + 1}"]`).getByRole('link');
            yield (0, test_1.expect)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield collapser.focus();
                yield page.keyboard.press('ArrowDown');
                yield (0, test_1.expect)(nextItem).toBeFocused();
            })).toPass();
        }));
        (0, test_1.test)('should persist collapsed/expanded groups after page reload', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            const collapser = poHomeChannel.sidebar.firstCollapser;
            yield collapser.click();
            const isExpanded = yield collapser.getAttribute('aria-expanded');
            yield page.reload();
            const isExpandedAfterReload = yield collapser.getAttribute('aria-expanded');
            (0, test_1.expect)(isExpanded).toEqual(isExpandedAfterReload);
        }));
        (0, test_1.test)('should show unread badge on collapser when group is collapsed and has unread items', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            yield poHomeChannel.sidebar.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('hello world');
            yield poHomeChannel.sidebar.typeSearch(targetChannel);
            const item = poHomeChannel.sidebar.getSearchRoomByName(targetChannel);
            yield poHomeChannel.sidebar.markItemAsUnread(item);
            yield poHomeChannel.sidebar.escSearch();
            const collapser = poHomeChannel.sidebar.getCollapseGroupByName('Channels');
            yield collapser.click();
            yield (0, test_1.expect)(poHomeChannel.sidebar.getItemUnreadBadge(collapser)).toBeVisible();
        }));
    });
    test_1.test.describe('Sidepanel', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            sidepanelTeam = yield (0, utils_1.createTargetTeam)(api, { sidepanel: { items: ['channels', 'discussions'] } });
            yield (0, setUserPreferences_1.setUserPreferences)(api, {
                sidebarViewMode: 'Medium',
                featuresPreview: [
                    {
                        name: 'newNavigation',
                        value: true,
                    },
                    {
                        name: 'sidepanelNavigation',
                        value: true,
                    },
                ],
            });
        }));
        test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.deleteTeam)(api, sidepanelTeam);
            yield (0, setUserPreferences_1.setUserPreferences)(api, {
                sidebarViewMode: 'Medium',
                featuresPreview: [
                    {
                        name: 'newNavigation',
                        value: false,
                    },
                    {
                        name: 'sidepanelNavigation',
                        value: false,
                    },
                ],
            });
        }));
        (0, test_1.test)('should be able to toggle "Sidepanel" feature', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/account/feature-preview');
            yield poAccountProfile.getAccordionItemByName('Navigation').click();
            const sidepanelCheckbox = poAccountProfile.getCheckboxByLabelText('Secondary navigation for teams');
            yield (0, test_1.expect)(sidepanelCheckbox).toBeChecked();
            yield sidepanelCheckbox.click();
            yield (0, test_1.expect)(sidepanelCheckbox).not.toBeChecked();
            yield poAccountProfile.btnSaveChanges.click();
            yield (0, test_1.expect)(poAccountProfile.btnSaveChanges).not.toBeVisible();
            yield (0, test_1.expect)(sidepanelCheckbox).not.toBeChecked();
        }));
        (0, test_1.test)('should display sidepanel on a team and hide it on edit', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto(`/group/${sidepanelTeam}`);
            yield poHomeChannel.content.waitForChannel();
            yield (0, test_1.expect)(poHomeChannel.sidepanel.sidepanelList).toBeVisible();
            yield poHomeChannel.tabs.btnRoomInfo.click();
            yield poHomeChannel.tabs.room.btnEdit.click();
            yield poHomeChannel.tabs.room.advancedSettingsAccordion.click();
            yield poHomeChannel.tabs.room.toggleSidepanelItems();
            yield poHomeChannel.tabs.room.btnSave.click();
            yield (0, test_1.expect)(poHomeChannel.sidepanel.sidepanelList).not.toBeVisible();
        }));
        (0, test_1.test)('should display new channel from team on the sidepanel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
            yield page.goto(`/group/${sidepanelTeam}`);
            yield poHomeChannel.content.waitForChannel();
            yield poHomeChannel.tabs.btnChannels.click();
            yield poHomeChannel.tabs.channels.btnCreateNew.click();
            yield poHomeChannel.sidenav.inputChannelName.fill(targetChannelNameInTeam);
            yield poHomeChannel.sidenav.checkboxPrivateChannel.click();
            yield poHomeChannel.sidenav.btnCreate.click();
            yield (0, test_1.expect)(poHomeChannel.sidepanel.sidepanelList).toBeVisible();
            yield (0, test_1.expect)(poHomeChannel.sidepanel.getItemByName(targetChannelNameInTeam)).toBeVisible();
            yield (0, utils_1.deleteChannel)(api, targetChannelNameInTeam);
        }));
        (0, test_1.test)('should display sidepanel item with the same display preference as the sidebar', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            const message = 'hello world';
            yield poHomeChannel.sidebar.setDisplayMode('Extended');
            yield poHomeChannel.sidebar.openChat(sidepanelTeam);
            yield poHomeChannel.content.sendMessage(message);
            yield (0, test_1.expect)(poHomeChannel.sidepanel.getExtendedItem(sidepanelTeam, message)).toBeVisible();
        }));
        (0, test_1.test)('should escape special characters on item subtitle', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            const message = 'hello > world';
            const parsedWrong = 'hello &gt; world';
            yield poHomeChannel.sidebar.setDisplayMode('Extended');
            yield poHomeChannel.sidebar.openChat(sidepanelTeam);
            yield poHomeChannel.content.sendMessage(message);
            yield (0, test_1.expect)(poHomeChannel.sidepanel.getExtendedItem(sidepanelTeam, message)).toBeVisible();
            yield (0, test_1.expect)(poHomeChannel.sidepanel.getExtendedItem(sidepanelTeam, message)).not.toHaveText(parsedWrong);
        }));
        (0, test_1.test)('should show channel in sidepanel after adding existing one', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto(`/group/${sidepanelTeam}`);
            yield poHomeChannel.tabs.btnChannels.click();
            yield poHomeChannel.tabs.channels.btnAddExisting.click();
            yield poHomeChannel.tabs.channels.inputChannels.fill(targetChannel);
            yield page.getByRole('listbox').getByRole('option', { name: targetChannel }).click();
            yield poHomeChannel.tabs.channels.btnAdd.click();
            yield poHomeChannel.content.waitForChannel();
            yield (0, test_1.expect)(poHomeChannel.sidepanel.getItemByName(targetChannel)).toBeVisible();
        }));
        // remove .fail after fix
        test_1.test.fail('should sort by last message even if unread message is inside thread', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, browser }) {
            const user1Page = yield browser.newPage({ storageState: userStates_1.Users.user1.state });
            const user1Channel = new page_objects_1.HomeChannel(user1Page);
            yield page.goto(`/group/${sidepanelTeam}`);
            yield poHomeChannel.tabs.btnChannels.click();
            yield poHomeChannel.tabs.channels.btnAddExisting.click();
            yield poHomeChannel.tabs.channels.inputChannels.fill(targetChannel);
            yield page.getByRole('listbox').getByRole('option', { name: targetChannel }).click();
            yield poHomeChannel.tabs.channels.btnAdd.click();
            const sidepanelTeamItem = poHomeChannel.sidepanel.getItemByName(sidepanelTeam);
            const targetChannelItem = poHomeChannel.sidepanel.getItemByName(targetChannel);
            yield targetChannelItem.click();
            (0, test_1.expect)(page.url()).toContain(`/channel/${targetChannel}`);
            yield poHomeChannel.content.sendMessage('hello channel');
            yield sidepanelTeamItem.focus();
            yield sidepanelTeamItem.click();
            (0, test_1.expect)(page.url()).toContain(`/group/${sidepanelTeam}`);
            yield poHomeChannel.content.sendMessage('hello team');
            yield user1Page.goto(`/channel/${targetChannel}`);
            yield user1Channel.content.waitForChannel();
            yield user1Channel.content.openReplyInThread();
            yield user1Channel.content.toggleAlsoSendThreadToChannel(false);
            yield user1Channel.content.sendMessageInThread('hello thread');
            const item = poHomeChannel.sidepanel.getItemByName(targetChannel);
            yield (0, test_1.expect)(item.locator('..')).toHaveAttribute('data-item-index', '0');
            yield user1Page.close();
        }));
    });
});
