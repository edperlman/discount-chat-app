"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelSettings = void 0;
class OmnichannelSettings {
    constructor(page) {
        this.page = page;
    }
    get labelLivechatLogo() {
        return this.page.locator('//label[@title="Assets_livechat_widget_logo"]');
    }
    get imgLivechatLogoPreview() {
        return this.page.locator('//label[@title="Assets_livechat_widget_logo"]/following-sibling::span >> role=img[name="Asset preview"]');
    }
    get inputLivechatLogo() {
        return this.page.locator('//label[@title="Assets_livechat_widget_logo"]/following-sibling::span >> input[type="file"]');
    }
    get btnDeleteLivechatLogo() {
        return this.page.locator('//label[@title="Assets_livechat_widget_logo"]/following-sibling::span >> role=button[name="Delete"]');
    }
    group(sectionName) {
        return this.page.locator(`[data-qa-section="${sectionName}"] h2 >> text="${sectionName}"`);
    }
    get labelHideWatermark() {
        return this.page.locator('label', { has: this.page.locator('[data-qa-setting-id="Livechat_hide_watermark"]') });
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save changes"]');
    }
}
exports.OmnichannelSettings = OmnichannelSettings;
