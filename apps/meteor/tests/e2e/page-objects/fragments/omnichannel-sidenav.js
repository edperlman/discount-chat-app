"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelSidenav = void 0;
class OmnichannelSidenav {
    constructor(page) {
        this.page = page;
    }
    get linkDepartments() {
        return this.page.locator('a[href="/omnichannel/departments"]');
    }
    get linkAgents() {
        return this.page.locator('a[href="/omnichannel/agents"]');
    }
    get linkManagers() {
        return this.page.locator('a[href="/omnichannel/managers"]');
    }
    get linkCustomFields() {
        return this.page.locator('a[href="/omnichannel/customfields"]');
    }
    get linkCurrentChats() {
        return this.page.locator('a[href="/omnichannel/current"]');
    }
    get linkTriggers() {
        return this.page.locator('a[href="/omnichannel/triggers"]');
    }
    get linkSlaPolicies() {
        return this.page.locator('a[href="/omnichannel/sla-policies"]');
    }
    get linkPriorities() {
        return this.page.locator('a[href="/omnichannel/priorities"]');
    }
    get linkMonitors() {
        return this.page.locator('a[href="/omnichannel/monitors"]');
    }
    get linkBusinessHours() {
        return this.page.locator('a[href="/omnichannel/businessHours"]');
    }
    get linkAnalytics() {
        return this.page.locator('a[href="/omnichannel/analytics"]');
    }
    get linkRealTimeMonitoring() {
        return this.page.locator('a[href="/omnichannel/realtime-monitoring"]');
    }
    get linkReports() {
        return this.page.locator('a[href="/omnichannel/reports"]');
    }
    get linkCannedResponses() {
        return this.page.locator('a[href="/omnichannel/canned-responses"]');
    }
    get linkUnits() {
        return this.page.locator('a[href="/omnichannel/units"]');
    }
    get linkLivechatAppearance() {
        return this.page.locator('a[href="/omnichannel/appearance"]');
    }
    get linkTags() {
        return this.page.locator('a[href="/omnichannel/tags"]');
    }
}
exports.OmnichannelSidenav = OmnichannelSidenav;
