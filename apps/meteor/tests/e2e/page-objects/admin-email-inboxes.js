"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEmailInboxes = void 0;
class AdminEmailInboxes {
    constructor(page) {
        this.page = page;
    }
    get btnNewEmailInbox() {
        return this.page.locator('role=button[name="New Email Inbox"]');
    }
    get inputName() {
        return this.page.locator('input[name="name"]');
    }
    get inputEmail() {
        return this.page.locator('input[name="email"]');
    }
    // SMTP
    get inputSmtpServer() {
        return this.page.locator('input[name="smtpServer"]');
    }
    get inputSmtpUsername() {
        return this.page.locator('input[name="smtpUsername"]');
    }
    get inputSmtpPassword() {
        return this.page.locator('input[name="smtpPassword"]');
    }
    get inputSmtpSecure() {
        return this.page.locator('label >> text="Connect with SSL/TLS"').first();
    }
    // IMAP
    get inputImapServer() {
        return this.page.locator('input[name="imapServer"]');
    }
    get inputImapUsername() {
        return this.page.locator('input[name="imapUsername"]');
    }
    get inputImapPassword() {
        return this.page.locator('input[name="imapPassword"]');
    }
    get inputImapSecure() {
        return this.page.locator('label >> text="Connect with SSL/TLS"').last();
    }
    get btnSave() {
        return this.page.locator('button >> text=Save');
    }
    get btnDelete() {
        return this.page.locator('button >> text=Delete');
    }
    itemRow(name) {
        return this.page.locator(`td >> text="${name}"`);
    }
}
exports.AdminEmailInboxes = AdminEmailInboxes;
