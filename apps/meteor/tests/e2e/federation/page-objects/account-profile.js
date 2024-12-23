"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationAccountProfile = void 0;
const account_sidenav_1 = require("./fragments/account-sidenav");
class FederationAccountProfile {
    constructor(page) {
        this.page = page;
        this.sidenav = new account_sidenav_1.FederationAccountSidenav(page);
    }
    get inputName() {
        return this.page.locator('//label[contains(text(), "Name")]/..//input');
    }
    get inputAvatarLink() {
        return this.page.locator('[data-qa-id="UserAvatarEditorLink"]');
    }
    get btnSetAvatarLink() {
        return this.page.locator('[data-qa-id="UserAvatarEditorSetAvatarLink"]');
    }
    get inputUsername() {
        return this.page.locator('//label[contains(text(), "Username")]/..//input');
    }
    get btnSubmit() {
        return this.page.locator('[data-qa="AccountProfilePageSaveButton"]');
    }
    get avatarFileInput() {
        return this.page.locator('.avatar-file-input');
    }
    get emailTextInput() {
        return this.page.locator('//label[contains(text(), "Email")]/..//input');
    }
    get btnClose() {
        return this.page.locator('button >> i.rcx-icon--name-cross.rcx-icon');
    }
    get inputToken() {
        return this.page.locator('[data-qa="PersonalTokenField"]');
    }
    get tokensTableEmpty() {
        return this.page.locator('//h3[contains(text(), "No results found")]');
    }
    get btnTokensAdd() {
        return this.page.locator('role=button[name="Add"]');
    }
    get tokenAddedModal() {
        return this.page.locator("//div[text()='Personal Access Token successfully generated']");
    }
    tokenInTable(name) {
        return this.page.locator(`tr[qa-token-name="${name}"]`);
    }
    get btnRegenerateTokenModal() {
        return this.page.locator('role=button[name="Regenerate token"]');
    }
    get btnRemoveTokenModal() {
        return this.page.locator('role=button[name="Remove"]');
    }
    get inputImageFile() {
        return this.page.locator('input[type=file]');
    }
}
exports.FederationAccountProfile = FederationAccountProfile;
