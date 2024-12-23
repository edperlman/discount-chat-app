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
exports.FederationHomeFlextab = void 0;
const home_flextab_channels_1 = require("./home-flextab-channels");
const home_flextab_dm_member_1 = require("./home-flextab-dm-member");
const home_flextab_members_1 = require("./home-flextab-members");
const home_flextab_notificationPreferences_1 = require("./home-flextab-notificationPreferences");
const home_flextab_room_1 = require("./home-flextab-room");
class FederationHomeFlextab {
    constructor(page) {
        this.page = page;
        this.members = new home_flextab_members_1.FederationHomeFlextabMembers(page);
        this.room = new home_flextab_room_1.FederationHomeFlextabRoom(page);
        this.channels = new home_flextab_channels_1.FederationHomeFlextabChannels(page);
        this.notificationPreferences = new home_flextab_notificationPreferences_1.FederationHomeFlextabNotificationPreferences(page);
        this.dmUserMember = new home_flextab_dm_member_1.FederationHomeFlextabDirectMessageMember(page);
    }
    get btnTabMembers() {
        return this.page.locator('[data-qa-id=ToolBoxAction-members]');
    }
    get btnRoomInfo() {
        return this.page.locator('[data-qa-id=ToolBoxAction-info-circled]');
    }
    get btnUserInfo() {
        return this.page.locator('[data-qa-id="ToolBoxAction-user"]');
    }
    get btnCall() {
        return this.page.locator('[data-qa-id="ToolBoxAction-phone"]');
    }
    get btnDiscussion() {
        return this.page.locator('[data-qa-id="ToolBoxAction-discussion"]');
    }
    get btnTeam() {
        return this.page.locator('[data-qa-id="ToolBoxAction-hash"]');
    }
    get btnAddExistingChannelToTeam() {
        return this.page.locator('role=button[name="Add Existing"]');
    }
    searchForChannelOnAddChannelToTeam(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('//label[contains(text(), "Channels")]/..//input').focus();
            yield this.page.waitForTimeout(2000);
            yield this.page.locator('//label[contains(text(), "Channels")]/..//input').type(channelName);
        });
    }
    get btnThread() {
        return this.page.locator('[data-qa-id="ToolBoxAction-thread"]');
    }
    get btnChannels() {
        return this.page.locator('[data-qa-id="ToolBoxAction-hash"]');
    }
    get kebab() {
        return this.page.locator('[data-qa-id=ToolBox-Menu]');
    }
    get btnNotificationPreferences() {
        return this.page.locator('[data-qa-id=ToolBoxAction-bell]');
    }
    get userInfoUsername() {
        return this.page.locator('[data-qa="UserInfoUserName"]');
    }
    get btnFileList() {
        return this.page.locator('[data-qa-id="ToolBoxAction-clip"]');
    }
    get btnMentionedMessagesList() {
        return this.page.locator('[data-qa-id="ToolBoxAction-at"]');
    }
    get btnStarredMessagesList() {
        return this.page.locator('[data-qa-id="ToolBoxAction-star"]');
    }
    get btnPinnedMessagesList() {
        return this.page.locator('[data-qa-id="ToolBoxAction-pin"]');
    }
    get btnPruneMessages() {
        return this.page.locator('[data-qa-id="ToolBoxAction-eraser"]');
    }
}
exports.FederationHomeFlextab = FederationHomeFlextab;
