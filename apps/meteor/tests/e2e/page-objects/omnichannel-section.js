"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelSection = void 0;
class OmnichannelSection {
    constructor(page) {
        this.page = page;
    }
    get element() {
        return this.page.locator('div[data-qa-id="omncSection"]');
    }
    get btnVoipToggle() {
        return this.page.locator('role=button[name="Enable/Disable VoIP"]');
    }
    get btnDialpad() {
        return this.page.locator('role=button[name="Open Dialpad"]');
    }
    get btnContactCenter() {
        return this.page.locator('role=button[name="Contact Center"]');
    }
    get tabContacts() {
        return this.page.locator('role=tab[name="Contacts"]');
    }
}
exports.OmnichannelSection = OmnichannelSection;
