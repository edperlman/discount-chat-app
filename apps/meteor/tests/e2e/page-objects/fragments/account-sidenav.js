"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountSidenav = void 0;
class AccountSidenav {
    constructor(page) {
        this.page = page;
    }
    get linkTokens() {
        return this.page.locator('.flex-nav [href="/account/tokens"]');
    }
    get linkSecurity() {
        return this.page.locator('.flex-nav [href="/account/security"]');
    }
}
exports.AccountSidenav = AccountSidenav;
