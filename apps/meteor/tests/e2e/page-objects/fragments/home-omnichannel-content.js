"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeOmnichannelContent = void 0;
const omnichannel_transfer_chat_modal_1 = require("../omnichannel-transfer-chat-modal");
const home_content_1 = require("./home-content");
const omnichannel_close_chat_modal_1 = require("./omnichannel-close-chat-modal");
class HomeOmnichannelContent extends home_content_1.HomeContent {
    constructor(page) {
        super(page);
        this.closeChatModal = new omnichannel_close_chat_modal_1.OmnichannelCloseChatModal(page);
        this.forwardChatModal = new omnichannel_transfer_chat_modal_1.OmnichannelTransferChatModal(page);
    }
    get btnReturnToQueue() {
        return this.page.locator('role=button[name="Move to the queue"]');
    }
    get modalReturnToQueue() {
        return this.page.locator('[data-qa-id="return-to-queue-modal"]');
    }
    get btnReturnToQueueConfirm() {
        return this.modalReturnToQueue.locator('role=button[name="Confirm"]');
    }
    get btnReturnToQueueCancel() {
        return this.modalReturnToQueue.locator('role=button[name="Cancel"]');
    }
    get btnTakeChat() {
        return this.page.locator('role=button[name="Take it!"]');
    }
    get inputMessage() {
        return this.page.locator('[name="msg"]');
    }
    get btnForwardChat() {
        return this.page.locator('[data-qa-id="ToolBoxAction-balloon-arrow-top-right"]');
    }
    get btnCloseChat() {
        return this.page.locator('[data-qa-id="ToolBoxAction-balloon-close-top-right"]');
    }
    get btnGuestInfo() {
        return this.page.locator('[data-qa-id="ToolBoxAction-user"]');
    }
    get infoContactEmail() {
        return this.page.getByRole('dialog').locator('p[data-type="email"]');
    }
    get infoContactName() {
        return this.page.locator('[data-qa-id="contactInfo-name"]');
    }
    get btnReturn() {
        return this.page.locator('[data-qa-id="ToolBoxAction-back"]');
    }
    get btnResume() {
        return this.page.locator('role=button[name="Resume"]');
    }
    get modalOnHold() {
        return this.page.locator('[data-qa-id="on-hold-modal"]');
    }
    get btnEditRoomInfo() {
        return this.page.locator('button[data-qa-id="room-info-edit"]');
    }
    get btnOnHoldConfirm() {
        return this.modalOnHold.locator('role=button[name="Place chat On-Hold"]');
    }
    get infoHeaderName() {
        return this.page.locator('.rcx-room-header').getByRole('heading');
    }
}
exports.HomeOmnichannelContent = HomeOmnichannelContent;
