"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationHomeFlextabDirectMessageMember = void 0;
class FederationHomeFlextabDirectMessageMember {
    constructor(page) {
        this.page = page;
    }
    getUserInfoUsername(username) {
        return this.page.locator(`//div[contains(@class, "rcx-box--full") and contains(@title, "${username}")]`);
    }
}
exports.FederationHomeFlextabDirectMessageMember = FederationHomeFlextabDirectMessageMember;
