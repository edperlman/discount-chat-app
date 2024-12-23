"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelManageContact = void 0;
class OmnichannelManageContact {
    constructor(page) {
        this.page = page;
    }
    get inputName() {
        return this.page.locator('input[name=name]');
    }
    get inputEmail() {
        return this.page.locator('input[name="emails.0.address"]');
    }
    get inputPhone() {
        return this.page.locator('input[name="phones.0.phoneNumber"]');
    }
    get inputContactManager() {
        return this.page.locator('input[name=contactManager]');
    }
    get btnSave() {
        return this.page.locator('button >> text="Save"');
    }
    get btnCancel() {
        return this.page.locator('button >> text="Cancel"');
    }
    get btnAddEmail() {
        return this.page.locator('role=button[name="Add email"]');
    }
    get btnAddPhone() {
        return this.page.locator('role=button[name="Add phone"]');
    }
    getErrorMessage(message) {
        return this.page.locator(`role=alert >> text="${message}"`);
    }
}
exports.OmnichannelManageContact = OmnichannelManageContact;
