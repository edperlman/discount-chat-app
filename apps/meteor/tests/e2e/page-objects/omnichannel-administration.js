"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelAdministration = void 0;
const fragments_1 = require("./fragments");
class OmnichannelAdministration {
    constructor(page) {
        this.page = page;
        this.sidenav = new fragments_1.OmnichannelSidenav(page);
    }
}
exports.OmnichannelAdministration = OmnichannelAdministration;
