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
exports.OmnichannelLiveChat = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const test_1 = require("../utils/test");
class OmnichannelLiveChat {
    constructor(page, api) {
        this.api = api;
        this.page = page;
    }
    btnOpenOnlineLiveChat(label) {
        return this.page.locator(`role=button[name="${label}"]`);
    }
    get btnOpenLiveChat() {
        return this.page.locator(`[data-qa-id="chat-button"]`);
    }
    get btnNewChat() {
        return this.page.locator(`role=button[name="New Chat"]`);
    }
    get btnOptions() {
        return this.page.locator(`button >> text="Options"`);
    }
    get btnCloseChat() {
        return this.page.locator(`button >> text="Finish this chat"`);
    }
    get btnChangeDepartment() {
        return this.page.locator(`button >> text="Change department"`);
    }
    get btnCloseChatConfirm() {
        return this.page.locator(`button >> text="Yes"`);
    }
    get txtHeaderTitle() {
        return this.page.locator('div >> text="Chat Finished"');
    }
    get btnChatNow() {
        return this.page.locator('[type="button"] >> text="Chat now"');
    }
    get headerTitle() {
        return this.page.locator('[data-qa="header-title"]');
    }
    get txtWatermark() {
        return this.page.locator('[data-qa="livechat-watermark"]');
    }
    get imgLogo() {
        return this.btnOpenLiveChat.locator('img[alt="Livechat"]');
    }
    alertMessage(message) {
        return this.page.getByRole('alert').locator(`text="${message}"`);
    }
    txtChatMessage(message) {
        return this.page.locator(`[data-qa="message-bubble"] >> text="${message}"`);
    }
    closeChat() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnOptions.click();
            yield this.btnCloseChat.click();
            yield this.btnCloseChatConfirm.click();
        });
    }
    openLiveChat() {
        return __awaiter(this, void 0, void 0, function* () {
            const { value: siteName } = yield (yield this.api.get('/settings/Livechat_title')).json();
            yield this.btnOpenOnlineLiveChat(siteName).click();
        });
    }
    // TODO: replace openLivechat with this method and create a new method for openOnlineLivechat
    // as openLivechat only opens a chat that is in the 'online' state
    openAnyLiveChat() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnOpenLiveChat.click();
        });
    }
    startNewChat() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.btnNewChat.click();
        });
    }
    openAnyLiveChatAndSendMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { liveChatUser, message, isOffline, department } = params;
            yield this.openAnyLiveChat();
            yield this.sendMessage(liveChatUser, isOffline, department);
            yield this.onlineAgentMessage.fill(message);
            yield this.btnSendMessageToOnlineAgent.click();
        });
    }
    unreadMessagesBadge(count) {
        const name = count === 1 ? `${count} unread message` : `${count} unread messages`;
        return this.page.locator(`role=status[name="${name}"]`);
    }
    get inputName() {
        return this.page.locator('[name="name"]');
    }
    get inputEmail() {
        return this.page.locator('[name="email"]');
    }
    get selectDepartment() {
        return this.page.locator('[name="department"]');
    }
    get textAreaMessage() {
        return this.page.locator('[name="message"]');
    }
    btnSendMessage(btnText) {
        return this.page.locator(`role=button[name="${btnText}"]`);
    }
    get btnOk() {
        return this.page.locator('role=button[name="OK"]');
    }
    get btnYes() {
        return this.page.locator('role=button[name="Yes"]');
    }
    get onlineAgentMessage() {
        return this.page.locator('[contenteditable="true"]');
    }
    get btnSendMessageToOnlineAgent() {
        return this.page.locator('footer div div div:nth-child(3) button');
    }
    get livechatModal() {
        return this.page.locator('[data-qa-type="modal-overlay"]');
    }
    livechatModalText(text) {
        return this.page.locator(`[data-qa-type="modal-overlay"] >> text=${text}`);
    }
    get fileUploadTarget() {
        return this.page.locator('#files-drop-target');
    }
    findUploadedFileLink(fileName) {
        return this.page.getByRole('link', { name: fileName });
    }
    sendMessage(liveChatUser_1) {
        return __awaiter(this, arguments, void 0, function* (liveChatUser, isOffline = true, department) {
            const buttonLabel = isOffline ? 'Send' : 'Start chat';
            yield this.inputName.fill(liveChatUser.name);
            yield this.inputEmail.fill(liveChatUser.email);
            if (department) {
                yield this.selectDepartment.selectOption({ label: department });
            }
            if (isOffline) {
                yield this.textAreaMessage.type('any_message');
            }
            yield this.btnSendMessage(buttonLabel).click();
            yield this.page.waitForSelector('[data-qa="livechat-composer"]');
        });
    }
    sendMessageAndCloseChat(liveChatUser_1) {
        return __awaiter(this, arguments, void 0, function* (liveChatUser, message = 'this_a_test_message_from_user') {
            yield this.openAnyLiveChat();
            yield this.sendMessage(liveChatUser, false);
            yield this.onlineAgentMessage.fill(message);
            yield this.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(this.txtChatMessage(message)).toBeVisible();
            yield (0, test_1.expect)(this.page.locator('[data-qa="message-bubble"] >> text="Chat started"')).toBeVisible();
            yield this.closeChat();
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
            yield this.fileUploadTarget.dispatchEvent('dragenter', { dataTransfer });
            yield this.fileUploadTarget.dispatchEvent('drop', { dataTransfer });
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
            yield this.fileUploadTarget.dispatchEvent('dragenter', { dataTransfer });
            yield this.fileUploadTarget.dispatchEvent('drop', { dataTransfer });
        });
    }
    queuePosition(position) {
        return this.page.locator(`div[role='alert'] >> text=Your spot is #${position}`);
    }
}
exports.OmnichannelLiveChat = OmnichannelLiveChat;
