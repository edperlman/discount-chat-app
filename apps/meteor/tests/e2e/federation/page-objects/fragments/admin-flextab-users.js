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
exports.FederationAdminFlextabUsers = void 0;
class FederationAdminFlextabUsers {
    constructor(page) {
        this.page = page;
    }
    get btnNew() {
        return this.page.locator('role=button[name="New"]');
    }
    get btnEdit() {
        return this.page.locator('role=button[name="Edit"]');
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save"]');
    }
    get inputName() {
        return this.page.locator('//label[text()="Name"]/following-sibling::span//input');
    }
    get inputUserName() {
        return this.page.locator('//label[text()="Username"]/following-sibling::span//input');
    }
    get inputEmail() {
        return this.page.locator('//label[text()="Email"]/following-sibling::span//input').first();
    }
    get inputPassword() {
        return this.page.locator('//label[text()="Password"]/following-sibling::span//input');
    }
    get checkboxVerified() {
        return this.page.locator('//label[text()="Email"]/following-sibling::span//input/following-sibling::i');
    }
    addRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('//label[text()="Roles"]/following-sibling::span//input').click();
            yield this.page.locator(`li[value=${role}]`).click();
        });
    }
}
exports.FederationAdminFlextabUsers = FederationAdminFlextabUsers;
