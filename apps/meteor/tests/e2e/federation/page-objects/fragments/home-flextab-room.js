"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationHomeFlextabRoom = void 0;
class FederationHomeFlextabRoom {
    constructor(page) {
        this.page = page;
    }
    get btnEdit() {
        return this.page.locator('role=button[name="Edit"]');
    }
    get btnLeave() {
        return this.page.locator('role=button[name="Leave"]');
    }
    get btnDelete() {
        return this.page.locator('role=button[name="Delete"]');
    }
    get inputName() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Name' });
    }
    get inputTopic() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Topic' });
    }
    get inputAnnouncement() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Announcement' });
    }
    get inputDescription() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Description' });
    }
    get checkboxReadOnly() {
        return this.page.locator('text=Read OnlyOnly authorized users can write new messages >> i');
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save"]');
    }
    get btnModalConfirm() {
        return this.page.locator('#modal-root dialog .rcx-modal__inner .rcx-modal__footer .rcx-button--danger');
    }
}
exports.FederationHomeFlextabRoom = FederationHomeFlextabRoom;
