"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelContacts = void 0;
const omnichannel_info_1 = require("./omnichannel-info");
const omnichannel_manage_contact_1 = require("./omnichannel-manage-contact");
class OmnichannelContacts {
    constructor(page) {
        this.page = page;
        this.newContact = new omnichannel_manage_contact_1.OmnichannelManageContact(page);
        this.contactInfo = new omnichannel_info_1.OmnichannelContactInfo(page);
    }
    get btnNewContact() {
        return this.page.locator('button >> text="New contact"');
    }
    get inputSearch() {
        return this.page.locator('input[placeholder="Search"]');
    }
    findRowByName(contactName) {
        return this.page.locator(`td >> text="${contactName}"`);
    }
}
exports.OmnichannelContacts = OmnichannelContacts;
