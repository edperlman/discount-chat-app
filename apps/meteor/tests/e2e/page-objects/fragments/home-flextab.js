"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeFlextab = void 0;
const home_flextab_channels_1 = require("./home-flextab-channels");
const home_flextab_members_1 = require("./home-flextab-members");
const home_flextab_notificationPreferences_1 = require("./home-flextab-notificationPreferences");
const home_flextab_room_1 = require("./home-flextab-room");
class HomeFlextab {
    constructor(page) {
        this.page = page;
        this.members = new home_flextab_members_1.HomeFlextabMembers(page);
        this.room = new home_flextab_room_1.HomeFlextabRoom(page);
        this.channels = new home_flextab_channels_1.HomeFlextabChannels(page);
        this.notificationPreferences = new home_flextab_notificationPreferences_1.HomeFlextabNotificationPreferences(page);
    }
    get btnTabMembers() {
        return this.page.locator('[data-qa-id=ToolBoxAction-members]');
    }
    get btnRoomInfo() {
        return this.page.locator('[data-qa-id=ToolBoxAction-info-circled]');
    }
    get btnChannels() {
        return this.page.locator('[data-qa-id="ToolBoxAction-hash"]');
    }
    get btnTeamMembers() {
        return this.page.locator('role=menuitem[name="Teams Members"]');
    }
    get kebab() {
        return this.page.locator('role=button[name="Options"]');
    }
    get btnNotificationPreferences() {
        return this.page.locator('role=menuitem[name="Notifications Preferences"]');
    }
    get btnE2EERoomSetupDisableE2E() {
        return this.page.locator('[data-qa-id=ToolBoxAction-key]');
    }
    get btnDisableE2E() {
        return this.page.locator('role=menuitem[name="Disable E2E"]');
    }
    get btnEnableE2E() {
        return this.page.locator('role=menuitem[name="Enable E2E"]');
    }
    get btnEnableOTR() {
        return this.page.locator('role=menuitem[name="OTR"]');
    }
    get flexTabViewThreadMessage() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last().locator('[data-qa-type="message-body"]');
    }
    get userInfoUsername() {
        return this.page.locator('[data-qa="UserInfoUserName"]');
    }
    get btnPinnedMessagesList() {
        return this.page.locator('[data-key="pinned-messages"]');
    }
    get btnStarredMessageList() {
        return this.page.locator('[data-key="starred-messages"]');
    }
}
exports.HomeFlextab = HomeFlextab;
