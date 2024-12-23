"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationAccountSidenav = void 0;
class FederationAccountSidenav {
    constructor(page) {
        this.page = page;
    }
    get linkTokens() {
        return this.page.locator('.flex-nav [href="/account/tokens"]');
    }
}
exports.FederationAccountSidenav = FederationAccountSidenav;
