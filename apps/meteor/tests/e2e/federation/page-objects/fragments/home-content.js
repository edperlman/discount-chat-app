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
exports.FederationHomeContent = void 0;
class FederationHomeContent {
    constructor(page) {
        this.page = page;
    }
    get inputMessage() {
        return this.page.locator('[name="msg"]');
    }
    get messagePopUpItems() {
        return this.page.locator('role=menu[name="People"]');
    }
    get lastUserMessage() {
        return this.page.locator('[data-qa-type="message"]').last();
    }
    get lastUserMessageBody() {
        return this.lastUserMessage.locator('[data-qa-type="message-body"]');
    }
    get lastUserMessageNotSequential() {
        return this.page.locator('[data-qa-type="message"][data-sequential="false"]').last();
    }
    get typingIndicator() {
        return this.page.locator('.rc-message-box__activity');
    }
    sendMessage(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[name="msg"]').type(text);
            yield this.page.locator('button[aria-label="Send"]').click();
        });
    }
    sendMessageUsingEnter(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[name="msg"]').type(text);
            yield this.page.keyboard.press('Enter');
        });
    }
    editLastMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastMessageMenu();
            yield this.btnOptionEditMessage.click();
            yield this.page.locator('[name="msg"]').fill(message);
            yield this.page.keyboard.press('Enter');
        });
    }
    editLastThreadMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastThreadMessageMenu();
            yield this.page.locator('[data-qa-id="edit-message"]').click();
            yield this.page.locator('[name="msg"]').last().fill(message);
            yield this.page.keyboard.press('Enter');
        });
    }
    deleteLastMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastMessageMenu();
            yield this.btnOptionDeleteMessage.click();
            yield this.page.locator('#modal-root dialog .rcx-modal__inner .rcx-modal__footer .rcx-button--danger').click();
        });
    }
    starLastMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastMessageMenu();
            yield this.btnOptionStarMessage.waitFor();
            yield this.btnOptionStarMessage.click();
        });
    }
    replyInDm(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastMessageMenu();
            yield this.btnOptionReplyDirectly.click();
            yield this.page.waitForTimeout(2000);
            yield this.page.locator('[name="msg"]').type(message, { delay: 100 });
            yield this.page.waitForTimeout(2000);
            yield this.page.keyboard.press('Enter');
        });
    }
    sendAudioRecordedMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnRecordAudio.click();
            yield this.page.waitForTimeout(3000);
            yield this.page.locator('.rc-message-box__icon.rc-message-box__audio-message-done').click();
            yield this.btnModalConfirm.click();
        });
    }
    sendAudioRecordedInThreadMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnRecordAudio.nth(1).click();
            yield this.page.waitForTimeout(3000);
            yield this.page.locator('.rc-message-box__icon.rc-message-box__audio-message-done').click();
            yield this.btnModalConfirm.click();
        });
    }
    sendVideoRecordedMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnVideoMessage.click();
            yield this.page.locator('.rcx-box.rcx-box--full.rcx-icon--name-video').click();
            yield this.page.waitForTimeout(3000);
            yield this.page.locator('.rcx-box.rcx-box--full.rcx-icon--name-stop-unfilled').click();
            yield this.page.locator('button >> text="Send"').click();
            yield this.page.waitForTimeout(3000);
            yield this.btnModalConfirm.click();
        });
    }
    dispatchSlashCommand(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[name="msg"]').fill(text);
            yield this.page.locator('button[aria-label="Send"]').waitFor();
            yield this.page.locator('button[aria-label="Send"]').click();
        });
    }
    get btnModalCancel() {
        return this.page.locator('#modal-root .rcx-button-group--align-end .rcx-button--secondary');
    }
    get modalFilePreview() {
        return this.page.locator('//div[@id="modal-root"]//header//following-sibling::div[1]//div//div//img | //div[@id="modal-root"]//header//following-sibling::div[1]//div//div//div//i');
    }
    get btnModalConfirm() {
        return this.page.locator('#modal-root .rcx-button-group--align-end .rcx-button--primary');
    }
    get descriptionInput() {
        return this.page.locator('//div[@id="modal-root"]//fieldset//div[2]//span//input');
    }
    get getLastFileAttachmentContent() {
        return this.page.locator('.rcx-attachment__content').last();
    }
    get getLastFileName() {
        return this.page.locator('.rcx-message-attachment').last();
    }
    get fileNameInput() {
        return this.page.locator('//div[@id="modal-root"]//fieldset//div[1]//span//input');
    }
    get lastMessageFileName() {
        return this.page.locator('[data-qa-type="message"]:last-child');
    }
    getLastFileMessageByFileName(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.locator('[data-qa-type="message"]:last-child .rcx-message-container').last().locator(`div[title="${filename}"]`);
        });
    }
    getLastFileThreadMessageByFileName(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page
                .locator('div.thread-list ul.thread [data-qa-type="message"]:last-child .rcx-message-container')
                .last()
                .locator(`div[title="${filename}"]`);
        });
    }
    getLastVideoMessageFileName(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getLastFileMessageByFileName(filename);
        });
    }
    get lastFileMessage() {
        return this.page.locator('[data-qa-type="message"]:last-child .rcx-message-container').last();
    }
    get waitForLastMessageTextAttachmentEqualsText() {
        return this.page.locator('[data-qa-type="message"]:last-child .rcx-attachment__details .rcx-message-body');
    }
    get waitForLastThreadMessageTextAttachmentEqualsText() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last().locator('.rcx-attachment__details');
    }
    get btnOptionEditMessage() {
        return this.page.locator('[data-qa-id="edit-message"]');
    }
    get btnOptionDeleteMessage() {
        return this.page.locator('[data-qa-id="delete-message"]');
    }
    get btnOptionPinMessage() {
        return this.page.locator('[data-qa-id="pin-message"]');
    }
    get btnOptionStarMessage() {
        return this.page.locator('[data-qa-id="star-message"]');
    }
    get btnOptionFileUpload() {
        return this.page.locator('[data-qa-id="file-upload"]');
    }
    get btnVideoMessage() {
        return this.page.locator('[data-qa-id="video-message"]');
    }
    get btnRecordAudio() {
        return this.page.locator('[data-qa-id="audio-record"]');
    }
    get btnMenuMoreActions() {
        return this.page.locator('[data-qa-id="menu-more-actions"]');
    }
    get linkUserCard() {
        return this.page.locator('[data-qa="UserCard"] a');
    }
    get btnContactInformation() {
        return this.page.locator('[data-qa-id="ToolBoxAction-user"]');
    }
    get btnContactEdit() {
        return this.page.locator('.rcx-vertical-bar button:has-text("Edit")');
    }
    get btnOptionReplyInThread() {
        return this.page.locator('[data-qa-id="reply-in-thread"]');
    }
    get btnOptionStartDiscussion() {
        return this.page.locator('[data-qa-id="start-discussion"]');
    }
    get btnOptionReplyDirectly() {
        return this.page.locator('[data-qa-id="reply-directly"]');
    }
    get lastThreadMessageText() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last();
    }
    get lastThreadMessagePreviewText() {
        return this.page.locator('div.messages-box ul.messages-list [role=link]').last();
    }
    get threadInputMessage() {
        return this.page.getByRole('dialog').locator('[name="msg"]').last();
    }
    sendFileMessage(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('input[type=file]').setInputFiles(`./tests/e2e/federation/files/${fileName}`);
        });
    }
    sendThreadMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.getByRole('dialog').locator('[name="msg"]').last().fill(message);
            yield this.page.keyboard.press('Enter');
        });
    }
    openLastMessageMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[data-qa-type="message"]').last().hover();
            yield this.page.locator('[data-qa-type="message"]').last().locator('[data-qa-type="message-action-menu"][data-qa-id="menu"]').waitFor();
            yield this.page.locator('[data-qa-type="message"]').last().locator('[data-qa-type="message-action-menu"][data-qa-id="menu"]').click();
        });
    }
    threadSendToChannelAlso() {
        return this.page.getByRole('dialog').locator('label', { hasText: 'Also send to channel' });
    }
    quoteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastMessageMenu();
            yield this.page.locator('[data-qa-id="quote-message"]').click();
            yield this.page.locator('[name="msg"]').fill(message);
            yield this.page.keyboard.press('Enter');
        });
    }
    openLastThreadMessageMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.getByRole('dialog').locator('[data-qa-type="message"]').last().hover();
            yield this.page
                .getByRole('dialog')
                .locator('[data-qa-type="message"]')
                .last()
                .locator('[data-qa-type="message-action-menu"][data-qa-id="menu"]')
                .waitFor();
            yield this.page
                .getByRole('dialog')
                .locator('[data-qa-type="message"]')
                .last()
                .locator('[data-qa-type="message-action-menu"][data-qa-id="menu"]')
                .click();
        });
    }
    quoteMessageInsideThread(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastThreadMessageMenu();
            yield this.page.locator('[data-qa-id="quote-message"]').click();
            yield this.sendThreadMessage(message);
        });
    }
    reactToMessage(emoji) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openLastMessageMenu();
            yield this.page.locator('[data-qa-id="reaction-message"]').click();
            yield this.page.locator('input.js-emojipicker-search').type(emoji);
            yield this.page.locator(`[data-emoji="${emoji}"]`).last().click();
        });
    }
    unreactLastMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[data-qa-type="message"]').last().locator('.rcx-message-reactions__reaction').nth(1).waitFor();
            yield this.page.locator('[data-qa-type="message"]').last().locator('.rcx-message-reactions__reaction').nth(1).click();
        });
    }
    getSystemMessageByText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.locator('div[data-qa="system-message"] div[data-qa-type="system-message-body"]', { hasText: text });
        });
    }
    getLastSystemMessageName() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.locator('div[data-qa="system-message"]:last-child span.rcx-message-system__name');
        });
    }
    getAllReactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.locator('[data-qa-type="message"]').last().locator('.rcx-message-reactions__reaction');
        });
    }
}
exports.FederationHomeContent = FederationHomeContent;
