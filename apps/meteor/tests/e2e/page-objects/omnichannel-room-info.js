"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelRoomInfo = void 0;
class OmnichannelRoomInfo {
    constructor(page) {
        this.page = page;
    }
    getInfo(value) {
        return this.page.locator(`span >> text="${value}"`);
    }
    getLabel(label) {
        return this.page.locator(`div >> text="${label}"`);
    }
}
exports.OmnichannelRoomInfo = OmnichannelRoomInfo;
