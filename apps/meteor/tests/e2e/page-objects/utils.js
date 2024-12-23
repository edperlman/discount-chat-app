"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    constructor(page) {
        this.page = page;
    }
    get mainContent() {
        return this.page.locator('main.main-content');
    }
    get toastBar() {
        return this.page.locator('.rcx-toastbar');
    }
    get toastBarSuccess() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--success');
    }
    get toastBarError() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--error');
    }
    get btnModalConfirmDelete() {
        return this.page.locator('.rcx-modal >> button >> text="Delete"');
    }
}
exports.Utils = Utils;
