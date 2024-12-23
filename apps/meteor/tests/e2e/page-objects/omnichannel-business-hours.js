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
exports.OmnichannelBusinessHours = void 0;
const omnichannel_administration_1 = require("./omnichannel-administration");
class OmnichannelBusinessHours extends omnichannel_administration_1.OmnichannelAdministration {
    get btnCreateBusinessHour() {
        return this.page.locator('header').locator('role=button[name="New"]');
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save"]');
    }
    get btnCancel() {
        return this.page.locator('role=button[name="Cancel"]');
    }
    get btnBack() {
        return this.page.locator('role=button[name="Back"]');
    }
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    get inputName() {
        return this.page.locator('[name="name"]');
    }
    get inputDepartments() {
        return this.page.locator('input[placeholder="Select an option"]');
    }
    findRowByName(name) {
        return this.page.locator(`tr:has-text("${name}")`);
    }
    btnDeleteByName(name) {
        return this.page.locator(`tr:has-text("${name}") button[title="Remove"]`);
    }
    get confirmDeleteModal() {
        return this.page.locator('dialog:has(h2:has-text("Are you sure?"))');
    }
    get btnCancelDeleteModal() {
        return this.confirmDeleteModal.locator('role=button[name="Cancel"]');
    }
    get btnConfirmDeleteModal() {
        return this.confirmDeleteModal.locator('role=button[name="Delete"]');
    }
    selectOption(name) {
        return this.page.locator(`[role=option][value="${name}"]`);
    }
    selectDepartment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, _id }) {
            yield this.inputDepartments.click();
            yield this.inputDepartments.fill(name);
            yield this.selectOption(_id).click();
        });
    }
    search(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputSearch.fill(text);
        });
    }
}
exports.OmnichannelBusinessHours = OmnichannelBusinessHours;
