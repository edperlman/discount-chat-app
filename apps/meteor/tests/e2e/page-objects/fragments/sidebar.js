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
exports.Sidebar = void 0;
const test_1 = require("../../utils/test");
class Sidebar {
    constructor(page) {
        this.page = page;
    }
    // New navigation locators
    get sidebar() {
        return this.page.getByRole('navigation', { name: 'sidebar' });
    }
    get sidebarSearchSection() {
        return this.sidebar.getByRole('search');
    }
    get btnRecent() {
        return this.sidebarSearchSection.getByRole('button', { name: 'Recent' });
    }
    get channelsList() {
        return this.sidebar.getByRole('list', { name: 'Channels' });
    }
    get searchList() {
        return this.sidebar.getByRole('search').getByRole('list', { name: 'Channels' });
    }
    get firstCollapser() {
        return this.channelsList.getByRole('button').first();
    }
    get firstChannelFromList() {
        return this.channelsList.getByRole('listitem').first();
    }
    get searchInput() {
        return this.sidebarSearchSection.getByRole('searchbox');
    }
    setDisplayMode(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sidebarSearchSection.getByRole('button', { name: 'Display', exact: true }).click();
            yield this.sidebarSearchSection.getByRole('menuitemcheckbox', { name: mode }).click();
            yield this.sidebarSearchSection.click();
        });
    }
    escSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.keyboard.press('Escape');
        });
    }
    waitForChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=main').waitFor();
            yield this.page.locator('role=main >> role=heading[level=1]').waitFor();
            const messageList = this.page.getByRole('main').getByRole('list', { name: 'Message list', exact: true });
            yield messageList.waitFor();
            yield (0, test_1.expect)(messageList).not.toHaveAttribute('aria-busy', 'true');
        });
    }
    typeSearch(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.searchInput.fill(name);
        });
    }
    getSearchRoomByName(name) {
        return this.searchList.getByRole('link', { name });
    }
    openChat(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.typeSearch(name);
            yield this.getSearchRoomByName(name).click();
            yield this.waitForChannel();
        });
    }
    markItemAsUnread(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield item.hover();
            yield item.focus();
            yield item.locator('.rcx-sidebar-item__menu').click();
            yield this.page.getByRole('option', { name: 'Mark Unread' }).click();
        });
    }
    getCollapseGroupByName(name) {
        return this.channelsList.getByRole('button').filter({ has: this.page.getByRole('heading', { name, exact: true }) });
    }
    getItemUnreadBadge(item) {
        return item.getByRole('status', { name: 'unread' });
    }
}
exports.Sidebar = Sidebar;
