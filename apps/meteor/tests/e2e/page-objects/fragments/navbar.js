"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = void 0;
class Navbar {
    constructor(page) {
        this.page = page;
    }
    get navbar() {
        return this.page.getByRole('navigation', { name: 'header' });
    }
    get pagesToolbar() {
        return this.navbar.getByRole('toolbar', { name: 'Pages' });
    }
    get homeButton() {
        return this.pagesToolbar.getByRole('button', { name: 'Home' });
    }
}
exports.Navbar = Navbar;
