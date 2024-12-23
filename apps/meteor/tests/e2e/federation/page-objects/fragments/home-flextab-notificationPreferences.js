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
exports.FederationHomeFlextabNotificationPreferences = void 0;
class FederationHomeFlextabNotificationPreferences {
    constructor(page) {
        this.page = page;
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save"]');
    }
    getPreferenceByDevice(device) {
        return this.page.locator(`//div[@id="${device}Alert"]`);
    }
    selectDropdownById(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator(`//div[@id="${text}"]`).click();
        });
    }
    selectOptionByLabel(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator(`li.rcx-option >> text="${text}"`).click();
        });
    }
    selectDevice(text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator(`[data-qa-id="${text}-notifications"]`).click();
        });
    }
    updateDevicePreference(device) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.selectDevice(device);
            yield this.selectDropdownById(`${device}Alert`);
            yield this.selectOptionByLabel('Mentions');
        });
    }
    updateAllNotificationPreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateDevicePreference('Desktop');
            yield this.updateDevicePreference('Mobile');
            yield this.updateDevicePreference('Email');
        });
    }
}
exports.FederationHomeFlextabNotificationPreferences = FederationHomeFlextabNotificationPreferences;
