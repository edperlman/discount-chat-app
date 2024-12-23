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
exports.OmnichannelCurrentChats = void 0;
const fragments_1 = require("./fragments");
const omnichannel_administration_1 = require("./omnichannel-administration");
class OmnichannelCurrentChats extends omnichannel_administration_1.OmnichannelAdministration {
    constructor(page) {
        super(page);
        this.content = new fragments_1.HomeOmnichannelContent(page);
    }
    get inputGuest() {
        return this.page.locator('[data-qa="current-chats-guest"]');
    }
    get inputServedBy() {
        return this.page.locator('[data-qa="autocomplete-agent"] input');
    }
    get inputStatus() {
        return this.page.locator('[data-qa="current-chats-status"]');
    }
    get inputFrom() {
        return this.page.locator('[data-qa="current-chats-from"]');
    }
    get inputTo() {
        return this.page.locator('[data-qa="current-chats-to"]');
    }
    get inputDepartment() {
        return this.page.locator('[data-qa="autocomplete-department"] input');
    }
    get inputDepartmentValue() {
        return this.page.locator('[data-qa="autocomplete-department"] span');
    }
    get inputTags() {
        return this.page.locator('[data-qa="current-chats-tags"] [role="listbox"]');
    }
    get btnFilterOptions() {
        return this.page.locator('[data-qa="current-chats-options"]');
    }
    get optionClearFilter() {
        return this.page.locator('[data-qa="current-chats-options-clearFilters"]');
    }
    get optionRemoveAllClosed() {
        return this.page.locator('[data-qa="current-chats-options-removeAllClosed"]');
    }
    get modalConfirmRemove() {
        return this.page.locator('[data-qa-id="current-chats-modal-remove"]');
    }
    get modalConfirmRemoveAllClosed() {
        return this.page.locator('[data-qa-id="current-chats-modal-remove-all-closed"]');
    }
    get btnConfirmRemove() {
        return this.modalConfirmRemove.locator('role=button[name="Delete"]');
    }
    get btnConfirmRemoveAllClosed() {
        return this.modalConfirmRemoveAllClosed.locator('role=button[name="Delete"]');
    }
    get optionCustomFields() {
        return this.page.locator('[data-qa="current-chats-options-customFields"]');
    }
    selectServedBy(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputServedBy.click();
            yield this.inputServedBy.fill(option);
            yield this.page.locator(`[role='option'][value='${option}']`).click();
        });
    }
    addTag(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputTags.click();
            yield this.page.locator(`[role='option'][value='${option}']`).click();
            yield this.inputTags.click();
        });
    }
    removeTag(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.locator(`role=option[name='${option}']`).click();
        });
    }
    selectDepartment(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputDepartment.click();
            yield this.inputDepartment.fill(option);
            yield this.page.locator(`role=option[name='${option}']`).click();
        });
    }
    selectStatus(option) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputStatus.click();
            yield this.page.locator(`[role='option'][data-key='${option}']`).click();
        });
    }
    btnRemoveByName(name) {
        return this.findRowByName(name).locator('role=button[name="Remove"]');
    }
    findRowByName(name) {
        return this.page.locator(`tr[data-qa-id="${name}"]`);
    }
    findRowByServer(name) {
        return this.page.locator('tr', { has: this.page.locator(`[data-qa="current-chats-cell-servedBy"] >> text=${name}`) });
    }
}
exports.OmnichannelCurrentChats = OmnichannelCurrentChats;
