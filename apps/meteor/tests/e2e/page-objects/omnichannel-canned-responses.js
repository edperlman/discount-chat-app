"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelCannedResponses = void 0;
const omnichannel_administration_1 = require("./omnichannel-administration");
class OmnichannelCannedResponses extends omnichannel_administration_1.OmnichannelAdministration {
    get radioPublic() {
        return this.page.locator('[data-qa-id="canned-response-public-radio"]').first();
    }
    get btnNew() {
        return this.page.locator('role=button[name="Create canned response"]').first();
    }
}
exports.OmnichannelCannedResponses = OmnichannelCannedResponses;
