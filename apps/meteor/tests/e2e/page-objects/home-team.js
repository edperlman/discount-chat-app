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
exports.HomeTeam = void 0;
const fragments_1 = require("./fragments");
class HomeTeam {
    constructor(page) {
        this.page = page;
        this.content = new fragments_1.HomeContent(page);
        this.sidenav = new fragments_1.HomeSidenav(page);
        this.tabs = new fragments_1.HomeFlextab(page);
    }
    get inputTeamName() {
        return this.page.locator('role=textbox[name="Name"]');
    }
    addMember(memberName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=textbox[name="Members"]').type(memberName, { delay: 100 });
            yield this.page.locator(`.rcx-option__content:has-text("${memberName}")`).click();
        });
    }
    get btnTeamCreate() {
        return this.page.locator('role=dialog >> role=group >> role=button[name=Create]');
    }
    get textPrivate() {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name: 'Private' }) });
    }
    get textReadOnly() {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name: 'Read-only' }) });
    }
}
exports.HomeTeam = HomeTeam;
