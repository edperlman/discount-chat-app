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
exports.HomeFlextabRoom = void 0;
class HomeFlextabRoom {
    constructor(page) {
        this.page = page;
    }
    get roomInfoTab() {
        return this.page.getByRole('dialog', { exact: true });
    }
    get btnEdit() {
        return this.page.locator('role=button[name="Edit"]');
    }
    get btnMore() {
        return this.page.locator('role=button[name="More"]');
    }
    get btnLeave() {
        return this.roomInfoTab.locator('role=button[name="Leave"]');
    }
    get btnDelete() {
        return this.roomInfoTab.locator('role=button[name="Delete"]');
    }
    getMoreOption(option) {
        return this.roomInfoTab.locator(`role=menuitem[name="${option}"]`);
    }
    get confirmLeaveModal() {
        return this.page.getByRole('dialog', { name: 'Confirmation', exact: true });
    }
    confirmLeave() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.confirmLeaveModal.getByRole('button', { name: 'Leave', exact: true }).click();
        });
    }
    get confirmDeleteTeamModal() {
        return this.page.getByRole('dialog', { name: 'Delete team', exact: true });
    }
    confirmDeleteTeam() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.confirmDeleteTeamModal.getByRole('button', { name: 'Yes, delete', exact: true }).click();
        });
    }
    get confirmConvertModal() {
        return this.page.getByRole('dialog', { name: 'Confirmation', exact: true });
    }
    confirmConvert() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.confirmConvertModal.getByRole('button', { name: 'Convert', exact: true }).click();
        });
    }
    get optionDelete() {
        return this.page.locator('label[data-key="delete"]');
    }
    get inputName() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Name' });
    }
    get inputTopic() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Topic' });
    }
    get inputAnnouncement() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Announcement' });
    }
    get inputDescription() {
        return this.page.getByRole('dialog').getByRole('textbox', { name: 'Description' });
    }
    get checkboxReadOnly() {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name: 'Read-only' }) });
    }
    get checkboxEncrypted() {
        return this.page.locator('label', { has: this.page.getByRole('checkbox', { name: 'Encrypted' }) });
    }
    get btnSave() {
        return this.page.locator('role=button[name="Save"]');
    }
    get calloutRetentionPolicy() {
        return this.page.getByRole('dialog').getByRole('alert', { name: 'Retention policy warning callout' });
    }
    get advancedSettingsAccordion() {
        return this.page.getByRole('dialog').getByRole('button', { name: 'Advanced settings' });
    }
    get pruneAccordion() {
        return this.page.getByRole('dialog').getByRole('button', { name: 'Prune', exact: true });
    }
    getMaxAgeLabel(maxAge = '30') {
        return this.page.getByRole('dialog').getByText(`Maximum message age in days (default: ${maxAge})`);
    }
    get inputRetentionMaxAge() {
        return this.page.getByRole('dialog').locator('input[name="retentionMaxAge"]');
    }
    get checkboxPruneMessages() {
        return this.page
            .getByRole('dialog')
            .locator('label', { has: this.page.getByRole('checkbox', { name: 'Automatically prune old messages' }) });
    }
    get checkboxOverrideGlobalRetention() {
        return this.page
            .getByRole('dialog')
            .locator('label', { has: this.page.getByRole('checkbox', { name: 'Override global retention policy' }) });
    }
    get checkboxIgnoreThreads() {
        return this.page.getByRole('dialog').locator('label', { has: this.page.getByRole('checkbox', { name: 'Do not prune Threads' }) });
    }
    get checkboxChannels() {
        return this.page.getByRole('dialog').locator('label', { has: this.page.getByRole('checkbox', { name: 'Channels' }) });
    }
    get checkboxDiscussions() {
        return this.page.getByRole('dialog').locator('label', { has: this.page.getByRole('checkbox', { name: 'Discussions' }) });
    }
    toggleSidepanelItems() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkboxChannels.click();
            yield this.checkboxDiscussions.click();
        });
    }
}
exports.HomeFlextabRoom = HomeFlextabRoom;
