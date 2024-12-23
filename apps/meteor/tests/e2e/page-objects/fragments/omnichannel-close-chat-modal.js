"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelCloseChatModal = void 0;
class OmnichannelCloseChatModal {
    constructor(page) {
        this.page = page;
    }
    get inputComment() {
        return this.page.locator('input[name="comment"]');
    }
    get btnConfirm() {
        return this.page.locator('role=button[name="Confirm"]');
    }
}
exports.OmnichannelCloseChatModal = OmnichannelCloseChatModal;
