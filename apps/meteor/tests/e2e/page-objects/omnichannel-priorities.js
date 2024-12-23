"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelPriorities = void 0;
const fragments_1 = require("./fragments");
class OmnichannelManagePriority {
    constructor(page) {
        this.page = page;
    }
    get inputName() {
        return this.page.locator('[name="name"]');
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
    get btnReset() {
        return this.page.locator('.rcx-vertical-bar').locator('role=button[name="Reset"]');
    }
    errorMessage(message) {
        return this.page.locator(`.rcx-field__error >> text="${message}"`);
    }
}
class OmnichannelPriorities {
    constructor(page) {
        this.page = page;
        this.managePriority = new OmnichannelManagePriority(page);
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
    get toastSuccess() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--success');
    }
    get btnReset() {
        return this.page.locator('role=button[name="Reset"]');
    }
    get btnResetConfirm() {
        return this.page.locator('.rcx-modal').locator('role=button[name="Reset"]');
    }
    get btnCloseToastSuccess() {
        return this.toastSuccess.locator('button');
    }
    findPriority(name) {
        return this.page.locator('tr', { has: this.page.locator(`td >> text="${name}"`) });
    }
}
exports.OmnichannelPriorities = OmnichannelPriorities;
