"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationAdmin = void 0;
const admin_flextab_1 = require("./fragments/admin-flextab");
class FederationAdmin {
    constructor(page) {
        this.page = page;
        this.tabs = new admin_flextab_1.FederationAdminFlextab(page);
    }
    get inputSearchRooms() {
        return this.page.locator('input[placeholder ="Search rooms"]');
    }
    get inputSearchUsers() {
        return this.page.locator('input[placeholder="Search Users"]');
    }
    get inputSearchSettings() {
        return this.page.locator('input[type=search]');
    }
    get roomsInputName() {
        return this.page.locator('//label[text()="Name"]/following-sibling::span//input');
    }
    get roomsInputDescription() {
        return this.page.locator('//label[text()="Description"]/following-sibling::span//textarea');
    }
    get roomsInputAnnouncement() {
        return this.page.locator('//label[text()="Announcement"]/following-sibling::span//textarea');
    }
    get roomsInputTopic() {
        return this.page.locator('//label[text()="Topic"]/following-sibling::span//textarea');
    }
    get roomsInputFavorite() {
        return this.page.locator('//label[text()="Favorite"]/following-sibling::span//input/following-sibling::i');
    }
    get roomsInputPrivate() {
        return this.page.locator('//label[text()="Private"]/following-sibling::span//input/following-sibling::i');
    }
    get roomsInputReadOnly() {
        return this.page.locator('//label[text()="Read Only"]/following-sibling::span//input/following-sibling::i');
    }
    get roomsInputArchived() {
        return this.page.locator('//label[text()="Archived"]/following-sibling::span//input/following-sibling::i');
    }
    get roomsInputDefault() {
        return this.page.locator('//label[text()="Default"]/following-sibling::span//input/following-sibling::i');
    }
    get roomsInputFeatured() {
        return this.page.locator('//label[text()="Featured"]/following-sibling::span//input/following-sibling::i');
    }
    get roomsBtnDelete() {
        return this.page.locator('role=button[name="Delete"]');
    }
    get roomsBtnUploadAvatar() {
        return this.page.locator('role=button[name="Upload"]');
    }
    get roomsBtnDefaultAvatar() {
        return this.page.locator('button[title="Set Default Avatar"]');
    }
}
exports.FederationAdmin = FederationAdmin;
