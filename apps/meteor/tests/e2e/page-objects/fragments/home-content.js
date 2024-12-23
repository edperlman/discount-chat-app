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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeContent = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const test_1 = require("../../utils/test");
class HomeContent {
    constructor(page) {
        this.page = page;
    }
    get channelHeader() {
        return this.page.locator('main header');
    }
    get channelRetentionPolicyWarning() {
        return this.page.locator('main').getByRole('alert', { name: 'Retention policy warning banner' });
    }
    get inputMessage() {
        return this.page.locator('[name="msg"]');
    }
    get inputThreadMessage() {
        return this.page.getByRole('dialog').locator('[name="msg"]').last();
    }
    get messagePopupUsers() {
        return this.page.locator('role=menu[name="People"]');
    }
    get lastUserMessage() {
        return this.page.locator('[data-qa-type="message"]').last();
    }
    nthMessage(index) {
        return this.page.locator('[data-qa-type="message"]').nth(index);
    }
    get lastUserMessageNotThread() {
        return this.page.locator('div.messages-box [data-qa-type="message"]').last();
    }
    get lastUserMessageBody() {
        return this.lastUserMessage.locator('[data-qa-type="message-body"]');
    }
    get lastUserMessageNotSequential() {
        return this.page.locator('[data-qa-type="message"][data-sequential="false"]').last();
    }
    get encryptedRoomHeaderIcon() {
        return this.page.locator('.rcx-room-header i.rcx-icon--name-key');
    }
    get lastIgnoredUserMessage() {
        return this.lastUserMessageBody.locator('role=button[name="This message was ignored"]');
    }
    get btnJoinRoom() {
        return this.page.locator('role=button[name="Join"]');
    }
    openRoomInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channelHeader.locator('button[data-qa-id="ToolBoxAction-info-circled"]').click();
        });
    }
    joinRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnJoinRoom.click();
        });
    }
    joinRoomIfNeeded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.inputMessage.isEnabled()) {
                return;
            }
            if (!(yield this.btnJoinRoom.isVisible())) {
                return;
            }
            yield this.joinRoom();
        });
    }
    sendMessage(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.joinRoomIfNeeded();
            yield this.page.waitForSelector('[name="msg"]:not([disabled])');
            yield this.page.locator('[name="msg"]').fill(text);
            yield this.page.getByRole('button', { name: 'Send', exact: true }).click();
        });
    }
    dispatchSlashCommand(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.joinRoomIfNeeded();
            yield this.page.waitForSelector('[name="msg"]:not([disabled])');
            yield this.page.locator('[name="msg"]').fill('');
            yield this.page.locator('[name="msg"]').fill(text);
            yield this.page.keyboard.press('Enter');
            yield this.page.keyboard.press('Enter');
        });
    }
    forwardMessage(chatName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[data-qa-type="message"]').last().hover();
            yield this.page.locator('role=button[name="Forward message"]').click();
            yield this.page.getByRole('textbox', { name: 'Person or Channel', exact: true }).click();
            yield this.page.keyboard.type(chatName);
            yield this.page.locator('#position-container').getByText(chatName).waitFor();
            yield this.page.locator('#position-container').getByText(chatName).click();
            yield this.page.locator('role=button[name="Forward"]').click();
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
    get getFileDescription() {
        return this.page.locator('[data-qa-type="message"]:last-child [data-qa-type="message-body"]');
    }
    get fileNameInput() {
        return this.page.locator('//div[@id="modal-root"]//fieldset//div[1]//span//input');
    }
    get lastMessageFileName() {
        return this.page.locator('[data-qa-type="message"]:last-child [data-qa-type="attachment-title-link"]');
    }
    get lastMessageTextAttachmentEqualsText() {
        return this.page.locator('[data-qa-type="message"]:last-child .rcx-attachment__details .rcx-message-body');
    }
    get lastThreadMessageTextAttachmentEqualsText() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last().locator('.rcx-attachment__details');
    }
    get mainThreadMessageText() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').first();
    }
    get lastThreadMessageText() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last();
    }
    get lastThreadMessagePreviewText() {
        return this.page.locator('div.messages-box ul.messages-list [role=link]').last();
    }
    get lastThreadMessageFileDescription() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last().locator('[data-qa-type="message-body"]');
    }
    get lastThreadMessageFileName() {
        return this.page.locator('div.thread-list ul.thread [data-qa-type="message"]').last().locator('[data-qa-type="attachment-title-link"]');
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
        return this.page.locator('[data-qa-id="audio-message"]');
    }
    get btnMenuMoreActions() {
        return this.page.getByRole('button', { name: 'More actions', exact: true });
    }
    get userCard() {
        return this.page.locator('[data-qa="UserCard"]');
    }
    get linkUserCard() {
        return this.userCard.locator('a');
    }
    get btnContactInformation() {
        return this.page.locator('[data-qa-id="ToolBoxAction-user"]');
    }
    get btnContactEdit() {
        return this.page.getByRole('dialog').getByRole('button', { name: 'Edit', exact: true });
    }
    get inputModalClosingComment() {
        return this.page.locator('#modal-root input:nth-child(1)[name="comment"]');
    }
    get btnSendTranscript() {
        return this.page.locator('role=button[name="Send transcript"]');
    }
    get btnSendTranscriptToEmail() {
        return this.page.locator('li.rcx-option', { hasText: 'Send via email' });
    }
    get btnSendTranscriptAsPDF() {
        return this.page.locator('li.rcx-option', { hasText: 'Export as PDF' });
    }
    get btnCannedResponses() {
        return this.page.locator('[data-qa-id="ToolBoxAction-canned-response"]');
    }
    get btnNewCannedResponse() {
        return this.page.locator('.rcx-vertical-bar button:has-text("Create")');
    }
    get imageGallery() {
        return this.page.getByRole('dialog', { name: 'Image gallery', exact: true });
    }
    get imageGalleryImage() {
        return this.imageGallery.locator('.swiper-zoom-container img');
    }
    getGalleryButtonByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.imageGallery.locator(`button[name="${name}"]`);
        });
    }
    pickEmoji(emoji_1) {
        return __awaiter(this, arguments, void 0, function* (emoji, section = 'Smileys & People') {
            yield this.page.locator('role=toolbar[name="Composer Primary Actions"] >> role=button[name="Emoji"]').click();
            yield this.page.locator(`role=dialog[name="Emoji picker"] >> role=tablist >> role=tab[name="${section}"]`).click();
            yield this.page.locator(`role=dialog[name="Emoji picker"] >> role=tabpanel >> role=button[name="${emoji}"]`).click();
        });
    }
    dragAndDropTxtFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield promises_1.default.readFile('./tests/e2e/fixtures/files/any_file.txt', 'utf-8');
            const dataTransfer = yield this.page.evaluateHandle((contract) => {
                const data = new DataTransfer();
                const file = new File([`${contract}`], 'any_file.txt', {
                    type: 'text/plain',
                });
                data.items.add(file);
                return data;
            }, contract);
            yield this.inputMessage.dispatchEvent('dragenter', { dataTransfer });
            yield this.page.locator('[role=dialog][data-qa="DropTargetOverlay"]').dispatchEvent('drop', { dataTransfer });
        });
    }
    dragAndDropLstFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield promises_1.default.readFile('./tests/e2e/fixtures/files/lst-test.lst', 'utf-8');
            const dataTransfer = yield this.page.evaluateHandle((contract) => {
                const data = new DataTransfer();
                const file = new File([`${contract}`], 'lst-test.lst', {
                    type: 'text/plain',
                });
                data.items.add(file);
                return data;
            }, contract);
            yield this.inputMessage.dispatchEvent('dragenter', { dataTransfer });
            yield this.page.locator('[role=dialog][data-qa="DropTargetOverlay"]').dispatchEvent('drop', { dataTransfer });
        });
    }
    dragAndDropTxtFileToThread() {
        return __awaiter(this, void 0, void 0, function* () {
            const contract = yield promises_1.default.readFile('./tests/e2e/fixtures/files/any_file.txt', 'utf-8');
            const dataTransfer = yield this.page.evaluateHandle((contract) => {
                const data = new DataTransfer();
                const file = new File([`${contract}`], 'any_file.txt', {
                    type: 'text/plain',
                });
                data.items.add(file);
                return data;
            }, contract);
            yield this.inputThreadMessage.dispatchEvent('dragenter', { dataTransfer });
            yield this.page.locator('[role=dialog][data-qa="DropTargetOverlay"]').dispatchEvent('drop', { dataTransfer });
        });
    }
    sendFileMessage(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('input[type=file]').setInputFiles(`./tests/e2e/fixtures/files/${fileName}`);
        });
    }
    openLastMessageMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[data-qa-type="message"]').last().hover();
            yield this.page.locator('[data-qa-type="message"]').last().locator('role=button[name="More"]').waitFor();
            yield this.page.locator('[data-qa-type="message"]').last().locator('role=button[name="More"]').click();
        });
    }
    openLastThreadMessageMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.getByRole('dialog').locator('[data-qa-type="message"]').last().hover();
            yield this.page.getByRole('dialog').locator('[data-qa-type="message"]').last().locator('role=button[name="More"]').waitFor();
            yield this.page.getByRole('dialog').locator('[data-qa-type="message"]').last().locator('role=button[name="More"]').click();
        });
    }
    toggleAlsoSendThreadToChannel(isChecked) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page
                .getByRole('dialog')
                .locator('label', { has: this.page.getByRole('checkbox', { name: 'Also send to channel' }) })
                .setChecked(isChecked);
        });
    }
    get lastSystemMessageBody() {
        return this.page.locator('[data-qa-type="system-message-body"]').last();
    }
    get resumeOnHoldOmnichannelChatButton() {
        return this.page.locator('button.rcx-button--primary >> text="Resume"');
    }
    get btnOnHold() {
        return this.page.locator('[data-qa-id="ToolBoxAction-pause-unfilled"]');
    }
    get btnCall() {
        return this.page.locator('[data-qa-id="ToolBoxAction-phone"]');
    }
    get menuItemVideoCall() {
        return this.page.locator('role=menuitem[name="Video call"]');
    }
    get btnStartVideoCall() {
        return this.page.locator('#video-conf-root .rcx-button--primary.rcx-button >> text="Start call"');
    }
    get btnDeclineVideoCall() {
        return this.page.locator('.rcx-button--secondary-danger.rcx-button >> text="Decline"');
    }
    videoConfRingCallText(text) {
        return this.page.locator(`#video-conf-root .rcx-box.rcx-box--full >> text="${text}"`);
    }
    get videoConfMessageBlock() {
        return this.page.locator('.rcx-videoconf-message-block');
    }
    get btnAnonymousSignIn() {
        return this.page.locator('footer >> role=button[name="Sign in to start talking"]');
    }
    get btnAnonymousTalk() {
        return this.page.locator('role=button[name="Or talk as anonymous"]');
    }
    get nextSlideButton() {
        return this.page.getByLabel('Next slide');
    }
    get previousSlideButton() {
        return this.page.getByLabel('Previous slide');
    }
    get currentGalleryImage() {
        return this.page.locator('div[class="swiper-slide swiper-slide-active"] img');
    }
    // TODO: use getSystemMessageByText instead
    findSystemMessage(text) {
        return this.page.locator(`[data-qa-type="system-message-body"] >> text="${text}"`);
    }
    getSystemMessageByText(text) {
        return this.page.locator('[aria-roledescription="system message"]', { hasText: text });
    }
    getMessageByText(text) {
        return this.page.locator('[role="listitem"][aria-roledescription="message"]', { hasText: text });
    }
    waitForChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('role=main').waitFor();
            yield this.page.locator('role=main >> role=heading[level=1]').waitFor();
            const messageList = this.page.getByRole('main').getByRole('list', { name: 'Message list', exact: true });
            yield messageList.waitFor();
            yield (0, test_1.expect)(messageList).not.toHaveAttribute('aria-busy', 'true');
        });
    }
    openReplyInThread() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator('[data-qa-type="message"]').last().hover();
            yield this.page.locator('[data-qa-type="message"]').last().locator('role=button[name="Reply in thread"]').waitFor();
            yield this.page.locator('[data-qa-type="message"]').last().locator('role=button[name="Reply in thread"]').click();
        });
    }
    sendMessageInThread(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.getByRole('dialog').getByRole('textbox', { name: 'Message' }).fill(text);
            yield this.page.getByRole('dialog').getByRole('button', { name: 'Send', exact: true }).click();
        });
    }
}
exports.HomeContent = HomeContent;
