"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeOmnichannel = void 0;
const fragments_1 = require("./fragments");
const omnichannel_agents_1 = require("./omnichannel-agents");
const omnichannel_canned_responses_1 = require("./omnichannel-canned-responses");
const omnichannel_contacts_list_1 = require("./omnichannel-contacts-list");
const omnichannel_current_chats_1 = require("./omnichannel-current-chats");
const omnichannel_manager_1 = require("./omnichannel-manager");
const omnichannel_monitors_1 = require("./omnichannel-monitors");
const omnichannel_transcript_1 = require("./omnichannel-transcript");
const omnichannel_triggers_1 = require("./omnichannel-triggers");
class HomeOmnichannel {
    constructor(page) {
        this.page = page;
        this.content = new fragments_1.HomeOmnichannelContent(page);
        this.sidenav = new fragments_1.HomeSidenav(page);
        this.tabs = new fragments_1.HomeFlextab(page);
        this.triggers = new omnichannel_triggers_1.OmnichannelTriggers(page);
        this.omnisidenav = new fragments_1.OmnichannelSidenav(page);
        this.currentChats = new omnichannel_current_chats_1.OmnichannelCurrentChats(page);
        this.transcript = new omnichannel_transcript_1.OmnichannelTranscript(page);
        this.cannedResponses = new omnichannel_canned_responses_1.OmnichannelCannedResponses(page);
        this.agents = new omnichannel_agents_1.OmnichannelAgents(page);
        this.managers = new omnichannel_manager_1.OmnichannelManager(page);
        this.monitors = new omnichannel_monitors_1.OmnichannelMonitors(page);
        this.contacts = new omnichannel_contacts_list_1.OmnichannelContacts(page);
    }
    get toastSuccess() {
        return this.page.locator('.rcx-toastbar.rcx-toastbar--success');
    }
    get btnContextualbarClose() {
        return this.page.locator('[data-qa="ContextualbarActionClose"]');
    }
    get btnContactInfo() {
        return this.page.getByRole('button', { name: 'Contact Information' });
    }
}
exports.HomeOmnichannel = HomeOmnichannel;
