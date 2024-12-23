"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeDiscussion = void 0;
const fragments_1 = require("./fragments");
class HomeDiscussion {
    constructor(page) {
        this.page = page;
        this.content = new fragments_1.HomeContent(page);
        this.sidenav = new fragments_1.HomeSidenav(page);
        this.tabs = new fragments_1.HomeFlextab(page);
    }
    get inputChannelName() {
        return this.page.locator('role=textbox[name="Parent channel or team"]');
    }
    get inputName() {
        return this.page.locator('role=textbox[name="Name"]');
    }
    get inputMessage() {
        return this.page.locator('role=textbox[name="Message"]');
    }
    get btnCreate() {
        return this.page.locator('role=dialog >> role=group >> role=button[name="Create"]');
    }
}
exports.HomeDiscussion = HomeDiscussion;
