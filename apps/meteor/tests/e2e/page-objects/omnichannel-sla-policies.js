"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelSlaPolicies = void 0;
const fragments_1 = require("./fragments");
class OmnichannelManageSlaPolicy {
    constructor(page) {
        this.page = page;
    }
    get inputName() {
        return this.page.locator('[name="name"]');
    }
    get inputDescription() {
        return this.page.locator('[name="description"]');
    }
    get inputEstimatedWaitTime() {
        return this.page.locator('[name="dueTimeInMinutes"]');
    }
    get btnClose() {
        return this.page.locator('button.rcx-button >> text="Close"');
    }
    get btnCancel() {
        return this.page.locator('button.rcx-button >> text="Cancel"');
    }
    get btnSave() {
        return this.page.locator('button.rcx-button >> text="Save"');
    }
    errorMessage(message) {
        return this.page.locator(`.rcx-field__error >> text="${message}"`);
    }
}
class OmnichannelSlaPolicies {
    constructor(page) {
        this.page = page;
        this.manageSlaPolicy = new OmnichannelManageSlaPolicy(page);
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
    findRowByName(name) {
        return this.page.locator('tr', { has: this.page.locator(`td >> text="${name}"`) });
    }
    btnRemove(name) {
        return this.findRowByName(name).locator('button[title="Remove"]');
    }
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    headingButtonNew(name) {
        return this.page.locator(`role=main >> role=button[name="${name}"]`).first();
    }
    get btnDelete() {
        return this.page.locator('button.rcx-button >> text="Delete"');
    }
    get txtDeleteModalTitle() {
        return this.page.locator('role=dialog >> text="Are you sure?"');
    }
    get txtEmptyState() {
        return this.page.locator('div >> text="No results found"');
    }
}
exports.OmnichannelSlaPolicies = OmnichannelSlaPolicies;
