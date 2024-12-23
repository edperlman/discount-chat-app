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
exports.OmnichannelLiveChatEmbedded = void 0;
class OmnichannelLiveChatEmbedded {
    constructor(page) {
        this.page = page;
    }
    btnOpenLiveChat() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`[data-qa-id="chat-button"]`);
    }
    btnOpenOfflineLiveChat() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`button[aria-label="Leave a message"]`);
    }
    btnFinishOfflineMessage() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`button[aria-label="OK"]`);
    }
    get btnOptions() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`button >> text="Options"`);
    }
    get btnCloseChat() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`button >> text="Finish this chat"`);
    }
    get btnCloseChatConfirm() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`button >> text="Yes"`);
    }
    get txtHeaderTitle() {
        return this.page.frameLocator('#rocketchat-iframe').locator('div >> text="Chat Finished"');
    }
    get headerTitle() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[data-qa="header-title"]');
    }
    get btnChatNow() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[type="button"] >> text="Chat now"');
    }
    get btnNewChat() {
        return this.page.frameLocator('#rocketchat-iframe').locator(`role=button[name="New Chat"]`);
    }
    get messageList() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[data-qa="message-list"]');
    }
    get messageListBackground() {
        return this.messageList.evaluate((el) => window.getComputedStyle(el).getPropertyValue('background-color'));
    }
    messageBubble(message) {
        return this.page
            .frameLocator('#rocketchat-iframe')
            .locator('[data-qa="message-bubble"]', { has: this.page.frameLocator('#rocketchat-iframe').locator(`div >> text="${message}"`) });
    }
    messageBubbleBackground(message) {
        return this.messageBubble(message)
            .last()
            .evaluate((el) => window.getComputedStyle(el).getPropertyValue('background-color'));
    }
    txtChatMessage(message) {
        return this.page.frameLocator('#rocketchat-iframe').locator(`li >> text="${message}"`);
    }
    imgAvatar(username) {
        return this.page.frameLocator('#rocketchat-iframe').locator(`img[alt="${username}"]`).last();
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
            yield this.btnOpenLiveChat().click();
        });
    }
    unreadMessagesBadge(count) {
        const name = count === 1 ? `${count} unread message` : `${count} unread messages`;
        return this.page.frameLocator('#rocketchat-iframe').locator(`role=status[name="${name}"]`);
    }
    get inputName() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[name="name"]');
    }
    get inputEmail() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[name="email"]');
    }
    get textAreaMessage() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[name="message"]');
    }
    btnSendMessage(btnText) {
        return this.page.frameLocator('#rocketchat-iframe').locator(`role=button[name="${btnText}"]`);
    }
    get btnOk() {
        return this.page.frameLocator('#rocketchat-iframe').locator('role=button[name="OK"]');
    }
    get onlineAgentMessage() {
        return this.page.frameLocator('#rocketchat-iframe').locator('[contenteditable="true"]');
    }
    get btnSendMessageToOnlineAgent() {
        return this.page.frameLocator('#rocketchat-iframe').locator('footer div div div:nth-child(3) button');
    }
    get firstAutoMessage() {
        return this.page.frameLocator('#rocketchat-iframe').locator('div.message-text__WwYco p');
    }
    sendMessage(liveChatUser_1) {
        return __awaiter(this, arguments, void 0, function* (liveChatUser, isOffline = true) {
            const buttonLabel = isOffline ? 'Send' : 'Start chat';
            yield this.inputName.fill(liveChatUser.name);
            yield this.inputEmail.fill(liveChatUser.email);
            if (isOffline) {
                yield this.textAreaMessage.fill('any_message');
                yield this.btnSendMessage(buttonLabel).click();
                return this.btnFinishOfflineMessage().click();
            }
            yield this.btnSendMessage(buttonLabel).click();
            yield this.page.frameLocator('#rocketchat-iframe').locator('[data-qa="livechat-composer"]').waitFor();
        });
    }
}
exports.OmnichannelLiveChatEmbedded = OmnichannelLiveChatEmbedded;
