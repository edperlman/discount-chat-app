"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelTranscript = void 0;
const fragments_1 = require("./fragments");
class OmnichannelTranscript {
    constructor(page) {
        this.page = page;
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
    get checkboxPDF() {
        return this.page.locator('//input[@name="transcriptPDF"]//following::i[1]');
    }
    get exportedPDF() {
        return this.page.locator('//div[contains(text(),"PDF Transcript successfully generated")]');
    }
    get contactCenter() {
        return this.page.locator('//button[@data-tooltip="Contact Center"]');
    }
    get contactCenterChats() {
        return this.page.locator('//button[contains(.,"Chats")]');
    }
    get contactCenterSearch() {
        return this.page.locator('[placeholder="Search"]');
    }
    get firstRow() {
        return this.page.locator('//tr[1]//td[1]');
    }
    get btnOpenChat() {
        return this.page.getByRole('dialog').getByRole('button', { name: 'Open chat', exact: true });
    }
    get DownloadedPDF() {
        return this.page.locator('[data-qa-type="attachment-title-link"]').last();
    }
}
exports.OmnichannelTranscript = OmnichannelTranscript;
