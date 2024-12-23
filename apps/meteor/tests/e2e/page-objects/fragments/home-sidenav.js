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
exports.HomeSidenav = void 0;
const test_1 = require("../../utils/test");
class HomeSidenav {
    constructor(page) {
        this.page = page;
    }
    get advancedSettingsAccordion() {
        return this.page.getByRole('dialog').getByRole('button', { name: 'Advanced settings', exact: true });
    }
    get checkboxPrivateChannel() {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name: 'Private' }) });
    }
    get checkboxEncryption() {
        return this.page.locator('role=dialog[name="Create channel"] >> label >> text="Encrypted"');
    }
    get checkboxReadOnly() {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name: 'Read-only' }) });
    }
    get inputChannelName() {
        return this.page.locator('#modal-root [data-qa="create-channel-modal"] [data-qa-type="channel-name-input"]');
    }
    get inputDirectUsername() {
        return this.page.locator('#modal-root [data-qa="create-direct-modal"] [data-qa-type="user-auto-complete-input"]');
    }
    get btnCreate() {
        return this.page.locator('role=button[name="Create"]');
    }
    get inputSearch() {
        return this.page.locator('[placeholder="Search (Ctrl+K)"]').first();
    }
    get userProfileMenu() {
        return this.page.getByRole('button', { name: 'User menu', exact: true });
    }
    get sidebarChannelsList() {
        return this.page.getByRole('list', { name: 'Channels' });
    }
    get sidebarToolbar() {
        return this.page.getByRole('toolbar', { name: 'Sidebar actions' });
    }
    setDisplayMode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sidebarToolbar.getByRole('button', { name: 'Display', exact: true }).click();
            yield this.sidebarToolbar.getByRole('menuitemcheckbox', { name: mode }).click();
            yield this.sidebarToolbar.click();
        });
    }
    // Note: this is different from openChat because queued chats are not searchable
    getQueuedChat(name) {
        return this.page.locator('[data-qa="sidebar-item-title"]', { hasText: new RegExp(`^${name}$`) }).first();
    }
    get accountProfileOption() {
        return this.page.locator('role=menuitemcheckbox[name="Profile"]');
    }
    // TODO: refactor getSidebarItemByName to not use data-qa
    getSidebarItemByName(name, isRead) {
        return this.page.locator(['[data-qa="sidebar-item"]', `[aria-label="${name}"]`, isRead && '[data-unread="false"]'].filter(Boolean).join(''));
    }
    selectMarkAsUnread(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const sidebarItem = this.getSidebarItemByName(name);
            yield sidebarItem.focus();
            yield sidebarItem.locator('.rcx-sidebar-item__menu').click();
            yield this.page.getByRole('option', { name: 'Mark Unread' }).click();
        });
    }
    selectPriority(name, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const sidebarItem = this.getSidebarItemByName(name);
            yield sidebarItem.focus();
            yield sidebarItem.locator('.rcx-sidebar-item__menu').click();
            yield this.page.locator(`li[value="${priority}"]`).click();
        });
    }
    openAdministrationByLabel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="Administration"]').click();
            yield this.page.locator(`role=menuitem[name="${text}"]`).click();
        });
    }
    openInstalledApps() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="Administration"]').click();
            yield this.page.locator('//div[contains(text(),"Installed")]').click();
        });
    }
    openNewByLabel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="Create new"]').click();
            yield this.page.locator(`role=menuitem[name="${text}"]`).click();
        });
    }
    openSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=navigation >> role=button[name=Search]').click();
        });
    }
    getSearchRoomByName(name) {
        return this.page.locator(`role=search >> role=listbox >> role=link >> text="${name}"`);
    }
    searchRoom(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openSearch();
            yield this.page.locator('role=search >> role=searchbox').fill(name);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userProfileMenu.click();
            yield this.page.locator('//*[contains(@class, "rcx-option__content") and contains(text(), "Logout")]').click();
        });
    }
    switchStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userProfileMenu.click();
            yield this.page.locator(`role=menuitemcheckbox[name="${status}"]`).click();
        });
    }
    openChat(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.searchRoom(name);
            yield this.getSearchRoomByName(name).click();
            yield this.waitForChannel();
        });
    }
    waitForChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=main').waitFor();
            yield this.page.locator('role=main >> role=heading[level=1]').waitFor();
            yield this.page.locator('role=main >> role=list').waitFor();
            yield (0, test_1.expect)(this.page.locator('role=main >> role=list')).not.toHaveAttribute('aria-busy', 'true');
        });
    }
    switchOmnichannelStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            // button has a id of "omnichannel-status-toggle"
            const toggleButton = this.page.locator('#omnichannel-status-toggle');
            yield (0, test_1.expect)(toggleButton).toBeVisible();
            let StatusTitleMap;
            (function (StatusTitleMap) {
                StatusTitleMap["offline"] = "Turn on answer chats";
                StatusTitleMap["online"] = "Turn off answer chats";
            })(StatusTitleMap || (StatusTitleMap = {}));
            const currentStatus = yield toggleButton.getAttribute('title');
            if (status === 'offline') {
                if (currentStatus === StatusTitleMap.online) {
                    yield toggleButton.click();
                }
            }
            else if (currentStatus === StatusTitleMap.offline) {
                yield toggleButton.click();
            }
            yield this.page.waitForTimeout(500);
            const newStatus = yield this.page.locator('#omnichannel-status-toggle').getAttribute('title');
            (0, test_1.expect)(newStatus).toBe(status === 'offline' ? StatusTitleMap.offline : StatusTitleMap.online);
        });
    }
    createPublicChannel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openNewByLabel('Channel');
            yield this.checkboxPrivateChannel.click();
            yield this.inputChannelName.type(name);
            yield this.btnCreate.click();
        });
    }
    createEncryptedChannel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openNewByLabel('Channel');
            yield this.inputChannelName.fill(name);
            yield this.advancedSettingsAccordion.click();
            yield this.checkboxEncryption.click();
            yield this.btnCreate.click();
        });
    }
    getRoomBadge(roomName) {
        return this.getSidebarItemByName(roomName).getByRole('status', { exact: true });
    }
    getSearchChannelBadge(name) {
        return this.page.locator(`[data-qa="sidebar-item"][aria-label="${name}"]`).first().getByRole('status', { exact: true });
    }
}
exports.HomeSidenav = HomeSidenav;
