"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelContactInfo = void 0;
const omnichannel_manage_contact_1 = require("./omnichannel-manage-contact");
class OmnichannelContactInfo extends omnichannel_manage_contact_1.OmnichannelManageContact {
    get dialogContactInfo() {
        return this.page.getByRole('dialog', { name: 'Contact' });
    }
    get btnEdit() {
        return this.page.locator('role=button[name="Edit"]');
    }
    get btnCall() {
        return this.page.locator('role=button[name=Call"]');
    }
    get tabHistory() {
        return this.dialogContactInfo.getByRole('tab', { name: 'History' });
    }
    get historyItem() {
        return this.dialogContactInfo.getByRole('listitem').first();
    }
    get historyMessage() {
        return this.dialogContactInfo.getByRole('listitem').first();
    }
}
exports.OmnichannelContactInfo = OmnichannelContactInfo;
