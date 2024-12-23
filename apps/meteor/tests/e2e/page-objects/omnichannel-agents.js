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
exports.OmnichannelAgents = void 0;
const fragments_1 = require("./fragments");
class OmnichannelAgents {
    constructor(page) {
        this.page = page;
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
        this.editCtxBar = page.locator('[data-qa-id="agent-edit-contextual-bar"]');
        this.infoCtxBar = page.locator('[data-qa-id="agent-info-contextual-bar"]');
    }
    get inputUsername() {
        return this.page.locator('[data-qa-id="UserAutoComplete"]');
    }
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    get btnAdd() {
        return this.page.locator('role=button[name="Add agent"]');
    }
    get firstRowInTable() {
        return this.page.locator('[data-qa-id="agents-table"] tr:first-child td:first-child');
    }
    get btnDeleteFirstRowInTable() {
        return this.page.locator('[data-qa-id="agents-table"] tr:first-child').locator('role=button[name="Remove"]');
    }
    get modalRemoveAgent() {
        return this.page.locator('[data-qa-id="remove-agent-modal"]');
    }
    get btnModalRemove() {
        return this.modalRemoveAgent.locator('role=button[name="Delete"]');
    }
    get btnEdit() {
        return this.infoCtxBar.locator('[data-qa="agent-info-action-edit"]');
    }
    get btnRemove() {
        return this.infoCtxBar.locator('role=button[name="Remove"]');
    }
    get btnSave() {
        return this.editCtxBar.locator('[data-qa-id="agent-edit-save"]');
    }
    get inputMaxChats() {
        return this.editCtxBar.locator('input[name="maxNumberSimultaneousChat"]');
    }
    get inputStatus() {
        return this.page.locator('[data-qa-id="agent-edit-status"]');
    }
    get inputDepartment() {
        return this.editCtxBar.locator('[data-qa-id="agent-edit-departments"]');
    }
    selectDepartment(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputDepartment.click();
            yield this.inputDepartment.press(name[0]); // department input doesn't accept text, this only makes it focus on the first element that begins with that letter
            yield this.page.locator(`.rcx-option__content:has-text("${name}")`).click();
        });
    }
    selectStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputStatus.click();
            yield this.page.locator(`.rcx-option__content:has-text("${status}")`).click();
        });
    }
    selectUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputUsername.fill(username);
            yield this.page.locator(`role=option[name="${username}"]`).click();
        });
    }
    findRowByUsername(username) {
        return this.page.locator(`[data-qa-id="${username}"]`);
    }
    findRowByName(name) {
        return this.page.locator('tr', { has: this.page.locator(`td >> text="${name}"`) });
    }
    findSelectedDepartment(name) {
        return this.page.locator(`role=option[name="${name}"]`);
    }
}
exports.OmnichannelAgents = OmnichannelAgents;
