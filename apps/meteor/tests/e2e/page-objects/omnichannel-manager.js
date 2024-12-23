"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelManager = void 0;
const fragments_1 = require("./fragments");
class OmnichannelManager {
    constructor(page) {
        this.page = page;
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    search(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputSearch.fill(text);
            yield this.page.waitForTimeout(500);
        });
    }
    clearSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputSearch.fill('');
            yield this.page.waitForTimeout(500);
        });
    }
    get inputUsername() {
        return this.page.getByRole('main').getByLabel('Username');
    }
    selectUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputUsername.fill(username);
            yield this.page.locator(`role=option[name="${username}"]`).click();
        });
    }
    get btnAdd() {
        return this.page.locator('button.rcx-button--primary.rcx-button >> text="Add manager"');
    }
    findRowByName(name) {
        return this.page.locator('role=table[name="Managers"] >> role=row', { has: this.page.locator(`role=cell[name="${name}"]`) });
    }
    btnDeleteSelectedAgent(text) {
        return this.page.locator('tr', { has: this.page.locator(`td >> text="${text}"`) }).locator('button[title="Remove"]');
    }
    get btnModalRemove() {
        return this.page.locator('#modal-root dialog .rcx-modal__inner .rcx-modal__footer .rcx-button--danger');
    }
}
exports.OmnichannelManager = OmnichannelManager;
