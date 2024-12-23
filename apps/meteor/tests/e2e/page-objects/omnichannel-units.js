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
exports.OmnichannelUnits = void 0;
const omnichannel_administration_1 = require("./omnichannel-administration");
class OmnichannelUnits extends omnichannel_administration_1.OmnichannelAdministration {
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    search(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputSearch.fill(text);
        });
    }
    findRowByName(name) {
        return this.page.locator(`tr[data-qa-id="${name}"]`);
    }
    btnRemoveByName(name) {
        return this.findRowByName(name).locator('role=button[name="remove"]');
    }
    get inputName() {
        return this.page.locator('[name="name"]');
    }
    get inputDepartments() {
        return this.page.locator('[name="departments"]').locator('input[placeholder="Select an option"]');
    }
    get inputMonitors() {
        return this.page.locator('[name="monitors"]');
    }
    get inputVisibility() {
        return this.page.locator('button', { has: this.page.locator('select[name="visibility"]') });
    }
    get btnContextualbarClose() {
        return this.page.locator('[data-qa="ContextualbarActionClose"]');
    }
    selectOption(name) {
        return this.page.locator(`[role=option][value="${name}"]`);
    }
    selectOptionChip(name) {
        return this.page.getByRole('option', { name });
    }
    selectDepartment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, _id }) {
            yield this.inputDepartments.click();
            yield this.inputDepartments.fill(name);
            yield this.selectOption(_id).click();
            yield this.contextualBar.click({ position: { x: 0, y: 0 } });
        });
    }
    selectMonitor(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputMonitors.click();
            yield this.selectOption(option).click();
            yield this.contextualBar.click({ position: { x: 0, y: 0 } });
        });
    }
    selectVisibility(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputVisibility.click();
            yield this.page.locator(`li.rcx-option[data-key="${option}"]`).click();
        });
    }
    get btnCreateUnit() {
        return this.page.locator('header').locator('role=button[name="Create unit"]');
    }
    get btnCreateUnitEmptyState() {
        return this.page.locator('.rcx-states').locator('role=button[name="Create unit"]');
    }
    get contextualBar() {
        return this.page.locator('div[data-qa-id="units-contextual-bar"]');
    }
    get btnSave() {
        return this.contextualBar.locator('role=button[name="Save"]');
    }
    get btnCancel() {
        return this.contextualBar.locator('role=button[name="Cancel"]');
    }
    get btnDelete() {
        return this.contextualBar.locator('role=button[name="Delete"]');
    }
    btnDeleteByName(name) {
        return this.page.locator(`button[data-qa-id="remove-unit-${name}"]`);
    }
    get confirmDeleteModal() {
        return this.page.locator('dialog[data-qa-id="units-confirm-delete-modal"]');
    }
    get btnCancelDeleteModal() {
        return this.confirmDeleteModal.locator('role=button[name="Cancel"]');
    }
    get btnConfirmDeleteModal() {
        return this.confirmDeleteModal.locator('role=button[name="Delete"]');
    }
}
exports.OmnichannelUnits = OmnichannelUnits;
