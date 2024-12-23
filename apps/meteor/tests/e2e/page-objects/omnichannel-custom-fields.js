"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelCustomFields = void 0;
const fragments_1 = require("./fragments");
class OmnichannelCustomFields {
    constructor(page) {
        this.page = page;
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
    get btnAdd() {
        return this.page.locator('[data-qa-id="CustomFieldPageBtnNew"]');
    }
    get inputField() {
        return this.page.locator('input[name="field"]');
    }
    get inputLabel() {
        return this.page.locator('input[name="label"]');
    }
    get visibleLabel() {
        return this.page.locator('label >> text="Visible"');
    }
    get btnSave() {
        return this.page.locator('button >> text=Save');
    }
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    firstRowInTable(filedName) {
        return this.page.locator(`[qa-user-id="${filedName}"]`);
    }
    get btnDeleteCustomField() {
        return this.page.locator('button >> text=Delete');
    }
    get btnModalRemove() {
        return this.page.locator('#modal-root dialog .rcx-modal__inner .rcx-modal__footer .rcx-button--danger');
    }
}
exports.OmnichannelCustomFields = OmnichannelCustomFields;
