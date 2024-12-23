"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountProfile = void 0;
const account_sidenav_1 = require("./fragments/account-sidenav");
class AccountProfile {
    constructor(page) {
        this.page = page;
        this.sidenav = new account_sidenav_1.AccountSidenav(page);
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
    get userAvatarEditor() {
        return this.page.locator('[data-qa-id="UserAvatarEditor"]');
    }
    get emailTextInput() {
        return this.page.locator('//label[contains(text(), "Email")]/..//input');
    }
    get btnClose() {
        return this.page.locator('role=navigation >> role=button[name=Close]');
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
        return this.page.locator('role=dialog[name="Personal Access Token successfully generated"]');
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
    get securityHeader() {
        return this.page.locator('h1[data-qa-type="PageHeader-title"]:has-text("Security")');
    }
    get securityPasswordSection() {
        return this.page.locator('[role="button"]:has-text("Password")');
    }
    get security2FASection() {
        return this.page.locator('[role="button"]:has-text("Two Factor Authentication")');
    }
    get securityE2EEncryptionSection() {
        return this.page.locator('[role="button"]:has-text("End-to-end encryption")');
    }
    get securityE2EEncryptionResetKeyButton() {
        return this.page.locator("role=button[name='Reset E2EE key']");
    }
    get securityE2EEncryptionPassword() {
        return this.page.locator('role=textbox[name="New encryption password"]');
    }
    get securityE2EEncryptionPasswordConfirmation() {
        return this.page.locator('role=textbox[name="Confirm new encryption password"]');
    }
    get securityE2EEncryptionSavePasswordButton() {
        return this.page.locator("role=button[name='Save changes']");
    }
    getAccordionItemByName(name) {
        return this.page.getByRole('button', { name, exact: true });
    }
    getCheckboxByLabelText(name) {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name }) });
    }
    get btnSaveChanges() {
        return this.page.getByRole('button', { name: 'Save changes', exact: true });
    }
}
exports.AccountProfile = AccountProfile;
