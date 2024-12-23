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
exports.AdminFlextabUsers = void 0;
class AdminFlextabUsers {
    constructor(page) {
        this.page = page;
    }
    get btnNewUser() {
        return this.page.locator('role=button[name="New user"]');
    }
    get btnSave() {
        return this.page.locator('role=button[name="Add user"]');
    }
    get btnInvite() {
        return this.page.locator('role=button[name="Invite"]');
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
    get inputSetManually() {
        return this.page.locator('//label[text()="Set manually"]');
    }
    get inputPassword() {
        return this.page.locator('input[placeholder="Password"]');
    }
    get inputConfirmPassword() {
        return this.page.locator('input[placeholder="Confirm password"]');
    }
    get checkboxVerified() {
        return this.page.locator('//label[text()="Mark email as verified"]');
    }
    get joinDefaultChannels() {
        return this.page.locator('//label[text()="Join default channels"]');
    }
    get userRole() {
        return this.page.locator('button[role="option"]:has-text("user")');
    }
    addRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('//label[text()="Roles"]/following-sibling::span//input').click();
            yield this.page.locator(`li[value=${role}]`).click();
        });
    }
    get setupSmtpLink() {
        return this.page.locator('role=link[name="Set up SMTP"]');
    }
    get btnContextualbarClose() {
        return this.page.locator('button[data-qa="ContextualbarActionClose"]');
    }
}
exports.AdminFlextabUsers = AdminFlextabUsers;
