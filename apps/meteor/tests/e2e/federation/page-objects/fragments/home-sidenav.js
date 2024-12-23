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
exports.FederationSidenav = void 0;
class FederationSidenav {
    constructor(page) {
        this.page = page;
    }
    get checkboxPrivateChannel() {
        return this.page.locator('//*[@id="modal-root"]//*[contains(@class, "rcx-field") and contains(text(), "Private")]/../following-sibling::label/i');
    }
    get checkboxFederatedChannel() {
        return this.page.locator('//*[@id="modal-root"]//*[contains(@class, "rcx-field") and contains(text(), "Federated")]/../following-sibling::label/i');
    }
    get autocompleteUser() {
        return this.page.locator('//*[@id="modal-root"]//*[contains(@class, "rcx-box--full") and contains(text(), "Add Members")]/..//input');
    }
    get autocompleteUserDM() {
        return this.page.locator('//*[@id="modal-root"]//*[contains(@class, "rcx-box--full")]/..//input');
    }
    get inputChannelName() {
        return this.page.locator('#modal-root [data-qa="create-channel-modal"] [data-qa-type="channel-name-input"]');
    }
    get btnCreateChannel() {
        return this.page.locator('role=button[name="Create"]');
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.getByRole('button', { name: 'User menu' }).click();
            yield this.page.locator('//*[contains(@class, "rcx-option__content") and contains(text(), "Logout")]').click();
        });
    }
    inviteUserToChannel(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autocompleteUser.click();
            yield this.autocompleteUser.type(username);
            yield this.page.locator('[data-qa-type="autocomplete-user-option"]', { hasText: username }).waitFor();
            yield this.page.locator('[data-qa-type="autocomplete-user-option"]', { hasText: username }).click();
        });
    }
    openAdministrationByLabel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=button[name="Administration"]').click();
            yield this.page.locator(`li.rcx-option >> text="${text}"`).click();
        });
    }
    openNewByLabel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[data-qa="sidebar-create"]').click();
            yield this.page.locator(`li.rcx-option >> text="${text}"`).click();
        });
    }
    openChat(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=navigation >> role=button[name=Search]').click();
            yield this.page.locator('role=search >> role=searchbox').focus();
            yield this.page.locator('role=search >> role=searchbox').type(name);
            yield this.page.locator(`role=search >> role=listbox >> role=link`).first().waitFor();
            yield this.page.locator(`role=search >> role=listbox >> role=link`).first().click();
        });
    }
    countFilteredChannelsOnDirectory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('button[title="Directory"]').click();
            yield this.page.locator('button:has-text("Channels")').click();
            yield this.page.locator('input[placeholder ="Search Channels"]').focus();
            yield this.page.locator('input[placeholder ="Search Channels"]').type(name, { delay: 100 });
            yield this.page.waitForTimeout(5000);
            return this.page.locator('table tbody tr').count();
        });
    }
    openChatWhenHaveMultipleWithTheSameName(name, item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=navigation >> role=button[name=Search]').click();
            yield this.page.locator('role=search >> role=searchbox').focus();
            yield this.page.locator('role=search >> role=searchbox').type(name);
            yield this.page.waitForTimeout(2000);
            yield this.page.locator(`role=search >> role=listbox >> role=link >> text="${name}"`).nth(item).click({ force: true });
        });
    }
    countRoomsByNameOnSearch(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=navigation >> role=button[name=Search]').click();
            yield this.page.locator('role=search >> role=searchbox').focus();
            yield this.page.locator('role=search >> role=searchbox').type(name);
            yield this.page.locator(`role=search >> role=listbox >> role=link >> text="${name}"`).waitFor();
            yield this.page.waitForTimeout(2000);
            return this.page.locator(`role=search >> role=listbox >> role=link >> text="${name}"`).count();
        });
    }
    openDMMultipleChat(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=navigation >> role=button[name=Search]').click();
            yield this.page.locator('role=search >> role=searchbox').focus();
            yield this.page.locator('role=search >> role=searchbox').type(name);
            yield this.page.locator(`role=search >> role=listbox >> role=link >> text="${name}"`).waitFor();
            yield this.page.locator(`.rcx-sidebar-item`).nth(1).click({ force: true });
        });
    }
    createPublicChannel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openNewByLabel('Channel');
            yield this.checkboxPrivateChannel.click();
            yield this.inputChannelName.type(name);
            yield this.btnCreateChannel.click();
        });
    }
    inviteUserToDM(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.autocompleteUserDM.click();
            yield this.autocompleteUserDM.type(username);
            yield this.page.locator('[data-qa-type="autocomplete-user-option"]', { hasText: username }).waitFor();
            yield this.page.locator('[data-qa-type="autocomplete-user-option"]', { hasText: username }).click();
        });
    }
}
exports.FederationSidenav = FederationSidenav;
