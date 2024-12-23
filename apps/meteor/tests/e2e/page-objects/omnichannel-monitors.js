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
exports.OmnichannelMonitors = void 0;
const omnichannel_administration_1 = require("./omnichannel-administration");
class OmnichannelMonitors extends omnichannel_administration_1.OmnichannelAdministration {
    get modalConfirmRemove() {
        return this.page.locator('[data-qa-id="manage-monitors-confirm-remove"]');
    }
    get btnConfirmRemove() {
        return this.modalConfirmRemove.locator('role=button[name="Delete"]');
    }
    get btnAddMonitor() {
        return this.page.locator('role=button[name="Add monitor"]');
    }
    get inputMonitor() {
        return this.page.locator('input[name="monitor"]');
    }
    get inputSearch() {
        return this.page.getByRole('main').getByRole('textbox', { name: 'Search' });
    }
    findRowByName(name) {
        return this.page.locator(`tr[data-qa-id="${name}"]`);
    }
    btnRemoveByName(name) {
        return this.findRowByName(name).locator('role=button[name="Remove"]');
    }
    selectMonitor(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputMonitor.fill(name);
            yield this.page.locator(`li[role="option"]`, { has: this.page.locator(`[data-username='${name}']`) }).click();
        });
    }
}
exports.OmnichannelMonitors = OmnichannelMonitors;
