"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marketplace = void 0;
class Marketplace {
    constructor(page) {
        this.page = page;
    }
    get btnUploadPrivateApp() {
        return this.page.locator('role=button[name="Upload private app"]');
    }
    get btnInstallPrivateApp() {
        return this.page.locator('role=button[name="Install"]');
    }
    get btnUploadPrivateAppFile() {
        return this.page.locator('role=button[name="Browse Files"]');
    }
    get appStatusTag() {
        return this.page.locator('[data-qa-type="app-status-tag"]');
    }
    get confirmAppUploadModalTitle() {
        return this.page.locator('[data-qa-id="confirm-app-upload-modal-title"]');
    }
    get btnConfirmAppUploadModal() {
        return this.page.locator('role=button[name="Upload anyway"]');
    }
    get lastAppRow() {
        return this.page.locator('[data-qa-type="app-row"]').last();
    }
    get appMenu() {
        return this.page.getByTitle('More options');
    }
    get btnEnableApp() {
        return this.page.getByRole('menuitem', { name: 'Enable' });
    }
    get btnDisableApp() {
        return this.page.getByRole('menuitem', { name: 'Disable' });
    }
    get btnConfirmAppUpdate() {
        return this.page.locator('role=button[name="Yes"]');
    }
}
exports.Marketplace = Marketplace;
