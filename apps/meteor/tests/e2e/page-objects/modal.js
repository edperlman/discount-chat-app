"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = void 0;
class Modal {
    constructor(page) {
        this.page = page;
    }
    get textInput() {
        return this.page.locator('[name="modal_input"]');
    }
    get textInputErrorMessage() {
        return this.page.getByText('Validation failed');
    }
    get btnModalSubmit() {
        return this.page.locator('role=button[name="Submit"]');
    }
}
exports.Modal = Modal;
