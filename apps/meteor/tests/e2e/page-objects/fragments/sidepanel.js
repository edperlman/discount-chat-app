"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidepanel = void 0;
class Sidepanel {
    constructor(page) {
        this.page = page;
    }
    get sidepanelList() {
        return this.page.getByRole('main').getByRole('list', { name: 'Channels' });
    }
    get firstChannelFromList() {
        return this.sidepanelList.getByRole('listitem').first();
    }
    getItemByName(name) {
        return this.sidepanelList.getByRole('link').filter({ hasText: name });
    }
    getExtendedItem(name, subtitle) {
        const regex = new RegExp(`${name}.*${subtitle}`);
        return this.sidepanelList.getByRole('link', { name: regex });
    }
    getItemUnreadBadge(item) {
        return item.getByRole('status', { name: 'unread' });
    }
}
exports.Sidepanel = Sidepanel;
