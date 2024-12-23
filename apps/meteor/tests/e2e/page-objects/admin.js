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
exports.Admin = exports.AdminSectionsHref = void 0;
const admin_flextab_1 = require("./fragments/admin-flextab");
var AdminSectionsHref;
(function (AdminSectionsHref) {
    AdminSectionsHref["Workspace"] = "/admin/info";
    AdminSectionsHref["Subscription"] = "/admin/subscription";
    AdminSectionsHref["Engagement"] = "/admin/engagement/users";
    AdminSectionsHref["Moderation"] = "/admin/moderation";
    AdminSectionsHref["Federation"] = "/admin/federation";
    AdminSectionsHref["Rooms"] = "/admin/rooms";
    AdminSectionsHref["Users"] = "/admin/users";
    AdminSectionsHref["Invites"] = "/admin/invites";
    AdminSectionsHref["User_Status"] = "/admin/user-status";
    AdminSectionsHref["Permissions"] = "/admin/permissions";
    AdminSectionsHref["Device_Management"] = "/admin/device-management";
    AdminSectionsHref["Email_Inboxes"] = "/admin/email-inboxes";
    AdminSectionsHref["Mailer"] = "/admin/mailer";
    AdminSectionsHref["Third_party_login"] = "/admin/third-party-login";
    AdminSectionsHref["Integrations"] = "/admin/integrations";
    AdminSectionsHref["Import"] = "/admin/import";
    AdminSectionsHref["Reports"] = "/admin/reports";
    AdminSectionsHref["Sounds"] = "/admin/sounds";
    AdminSectionsHref["Emoji"] = "/admin/emoji";
    AdminSectionsHref["Settings"] = "/admin/settings";
})(AdminSectionsHref || (exports.AdminSectionsHref = AdminSectionsHref = {}));
class Admin {
    constructor(page) {
        this.page = page;
        this.tabs = new admin_flextab_1.AdminFlextab(page);
    }
    get inputSearchRooms() {
        return this.page.locator('input[placeholder ="Search rooms"]');
    }
    getRoomRow(name) {
        return this.page.locator('[role="link"]', { hasText: name });
    }
    getUserRow(username) {
        return this.page.locator('[role="link"]', { hasText: username });
    }
    get btnSave() {
        return this.page.locator('button >> text="Save"');
    }
    get btnSaveSettings() {
        return this.page.getByRole('button', { name: 'Save changes' });
    }
    get btnEdit() {
        return this.page.locator('button >> text="Edit"');
    }
    get privateLabel() {
        return this.page.locator(`label >> text=Private`);
    }
    get privateInput() {
        return this.page.locator('input[name="roomType"]');
    }
    get roomNameInput() {
        return this.page.locator('input[name="roomName"]');
    }
    get roomOwnerInput() {
        return this.page.locator('input[name="roomOwner"]');
    }
    get archivedLabel() {
        return this.page.locator('label >> text=Archived');
    }
    get archivedInput() {
        return this.page.locator('input[name="archived"]');
    }
    get favoriteLabel() {
        return this.page.locator('label >> text=Favorite');
    }
    get favoriteInput() {
        return this.page.locator('input[name="favorite"]');
    }
    get defaultLabel() {
        return this.page.locator('label >> text=Default');
    }
    get defaultInput() {
        return this.page.locator('input[name="isDefault"]');
    }
    get inputSearchUsers() {
        return this.page.locator('input[placeholder="Search Users"]');
    }
    get inputSearchSettings() {
        return this.page.locator('input[type=search]');
    }
    get inputSiteURL() {
        return this.page.locator('[data-qa-setting-id="Site_Url"]');
    }
    get btnResetSiteURL() {
        return this.page.locator('//label[@title="Site_Url"]//following-sibling::button');
    }
    get inputSiteName() {
        return this.page.locator('[data-qa-setting-id="Site_Name"]');
    }
    get btnResetSiteName() {
        return this.page.locator('[data-qa-reset-setting-id="Site_Name"]');
    }
    get btnAllowInvalidSelfSignedCerts() {
        return this.page.locator('//label[@data-qa-setting-id="Allow_Invalid_SelfSigned_Certs"]//i');
    }
    get btnResetAllowInvalidSelfSignedCerts() {
        return this.page.locator('//button[@data-qa-reset-setting-id="Allow_Invalid_SelfSigned_Certs"]');
    }
    get btnEnableFavoriteRooms() {
        return this.page.locator('[data-qa-setting-id="Favorite_Rooms"]');
    }
    get btnResetEnableFavoriteRooms() {
        return this.page.locator('[data-qa-reset-setting-id="Favorite_Rooms"]');
    }
    get btnUseCDNPrefix() {
        return this.page.locator('[data-qa-setting-id="CDN_PREFIX_ALL"]');
    }
    get btnResetUseCDNPrefix() {
        return this.page.locator('[data-qa-reset-setting-id="CDN_PREFIX_ALL"]');
    }
    get btnForceSSL() {
        return this.page.locator('[data-qa-setting-id="Force_SSL"]');
    }
    get btnResetForceSSL() {
        return this.page.locator('[data-qa-reset-setting-id="Force_SSL"]');
    }
    get inputGoogleTagManagerId() {
        return this.page.locator('[data-qa-setting-id="GoogleTagManager_id"]');
    }
    get btnResetGoogleTagManagerId() {
        return this.page.locator('[data-qa-reset-setting-id="GoogleTagManager_id"]');
    }
    get inputBugsnagApiKey() {
        return this.page.locator('[data-qa-setting-id="Bugsnag_api_key"]');
    }
    get inputResetBugsnagApiKey() {
        return this.page.locator('[data-qa-reset-setting-id="Bugsnag_api_key"]');
    }
    get inputRobotsFileContent() {
        return this.page.locator('#Robot_Instructions_File_Content');
    }
    get btnResetRobotsFileContent() {
        return this.page.locator('[data-qa-reset-setting-id="Robot_Instructions_File_Content"]');
    }
    get btnImportNewFile() {
        return this.page.locator('.rcx-button--primary.rcx-button >> text="Import New File"');
    }
    getOptionFileType(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('.rcx-select').click();
            return this.page.locator(`.rcx-option__content >> text="${option}"`);
        });
    }
    get inputFile() {
        return this.page.locator('input[type=file]');
    }
    get btnImport() {
        return this.page.locator('.rcx-button--primary.rcx-button >> text="Import"');
    }
    get btnStartImport() {
        return this.page.locator('.rcx-button--primary.rcx-button >> text="Start Importing"');
    }
    get importStatusTableFirstRowCell() {
        return this.page.locator('[data-qa-id="ImportTable"] tbody tr:first-child td >> text="Completed successfully"');
    }
    get btnAssetsSettings() {
        return this.page.locator('[data-qa-id="Assets"] >> role=link[name="Open"]');
    }
    get btnDeleteAssetsLogo() {
        return this.page.locator('//label[@title="Assets_logo"]/following-sibling::span >> role=button[name="Delete"]');
    }
    get inputAssetsLogo() {
        return this.page.locator('//label[@title="Assets_logo"]/following-sibling::span >> input[type="file"]');
    }
    get btnCreateRole() {
        return this.page.locator('button[name="New role"]');
    }
    openRoleByName(name) {
        return this.page.getByRole('table').getByRole('button', { name });
    }
    get btnUsersInRole() {
        return this.page.getByRole('dialog').getByRole('button', { name: 'Users in role', exact: true });
    }
    get inputRoom() {
        return this.page.locator('input[placeholder="Room"]');
    }
    get inputUsers() {
        return this.page.locator('input[placeholder="Users"]');
    }
    get btnAdd() {
        return this.page.getByRole('button', { name: 'Add', exact: true });
    }
    getUserRowByUsername(username) {
        return this.page.locator('tr', { hasText: username });
    }
    get btnBack() {
        return this.page.getByRole('button', { name: 'Back', exact: true });
    }
    get btnNew() {
        return this.page.getByRole('button', { name: 'New', exact: true });
    }
    get btnDelete() {
        return this.page.getByRole('button', { name: 'Delete', exact: true });
    }
    get btnInstructions() {
        return this.page.getByRole('button', { name: 'Instructions', exact: true });
    }
    get inputName() {
        return this.page.getByRole('textbox', { name: 'Name' });
    }
    get inputPostToChannel() {
        return this.page.getByRole('textbox', { name: 'Post to Channel' });
    }
    get inputPostAs() {
        return this.page.getByRole('textbox', { name: 'Post as' });
    }
    codeExamplePayload(text) {
        return this.page.locator('code', { hasText: text });
    }
    getIntegrationByName(name) {
        return this.page.getByRole('table', { name: 'Integrations table' }).locator('tr', { hasText: name });
    }
    get inputWebhookUrl() {
        return this.page.getByRole('textbox', { name: 'Webhook URL' });
    }
    getAccordionBtnByName(name) {
        return this.page.getByRole('button', { name, exact: true });
    }
    get btnFullScreen() {
        return this.page.getByRole('button', { name: 'Full Screen', exact: true });
    }
    dropdownFilterRoomType() {
        return __awaiter(this, arguments, void 0, function* (text = 'All rooms') {
            return this.page.locator(`div[role="button"]:has-text("${text}")`);
        });
    }
    adminSectionButton(href) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.locator(`a[href="${href}"]`);
        });
    }
    findFileRowByUsername(username) {
        return this.page.locator('tr', { has: this.page.getByRole('cell', { name: username }) });
    }
    findFileCheckboxByUsername(username) {
        return this.findFileRowByUsername(username).locator('label', { has: this.page.getByRole('checkbox') });
    }
}
exports.Admin = Admin;
