"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationHomeFlextabChannels = void 0;
class FederationHomeFlextabChannels {
    constructor(page) {
        this.page = page;
    }
    get btnAddExisting() {
        return this.page.locator('button >> text="Add Existing"');
    }
    get inputChannels() {
        return this.page.locator('#modal-root input').first();
    }
    get btnAdd() {
        return this.page.locator('#modal-root button:has-text("Add")');
    }
}
exports.FederationHomeFlextabChannels = FederationHomeFlextabChannels;
