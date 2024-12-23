"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelLivechatAppearance = void 0;
const omnichannel_administration_1 = require("./omnichannel-administration");
class OmnichannelLivechatAppearance extends omnichannel_administration_1.OmnichannelAdministration {
    get inputHideSystemMessages() {
        return this.page.locator('[name="Livechat_hide_system_messages"]');
    }
    get inputLivechatBackground() {
        return this.page.locator('[name="Livechat_background"]');
    }
    get inputLivechatTitle() {
        return this.page.locator('[name="Livechat_title"]');
    }
    findHideSystemMessageOption(option) {
        return this.page.locator(`[role="option"][value="${option}"]`);
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save changes"]');
    }
    get btnCancel() {
        return this.page.locator('role=button[name="Cancel"]');
    }
}
exports.OmnichannelLivechatAppearance = OmnichannelLivechatAppearance;
