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
exports.OmnichannelTransferChatModal = void 0;
class OmnichannelTransferChatModal {
    constructor(page) {
        this.page = page;
        this.dialog = page.locator('[data-qa-id="forward-chat-modal"]');
    }
    get inputComment() {
        return this.dialog.locator('textarea[name="comment"]');
    }
    get inputFowardDepartment() {
        return this.dialog.locator('[data-qa-id="forward-to-department"] input');
    }
    get inputFowardUser() {
        return this.dialog.locator('[data-qa="autocomplete-agent"] input');
    }
    get btnForward() {
        return this.dialog.locator('role=button[name="Forward"]');
    }
    get btnCancel() {
        return this.dialog.locator('role=button[name="Cancel"]');
    }
    selectDepartment(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputFowardDepartment.click();
            yield this.inputFowardDepartment.fill(name);
            yield this.page.locator(`li[role="option"]`, { hasText: name }).click();
        });
    }
    selectUser(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputFowardUser.click();
            yield this.inputFowardUser.fill(name);
            yield this.page.locator(`li[role="option"][value="${id || name}"]`).click();
        });
    }
}
exports.OmnichannelTransferChatModal = OmnichannelTransferChatModal;
