"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSidebarItems = exports.isGoRocketChatLink = exports.isSidebarItem = void 0;
const isSidebarItem = (item) => !('divider' in item);
exports.isSidebarItem = isSidebarItem;
const isGoRocketChatLink = (link) => link.startsWith('https://go.rocket.chat/i/');
exports.isGoRocketChatLink = isGoRocketChatLink;
const createSidebarItems = (initialItems = []) => {
    const items = initialItems;
    let updateCb = () => undefined;
    const getSidebarItems = () => items;
    const subscribeToSidebarItems = (cb) => {
        updateCb = cb;
        return () => {
            updateCb = () => undefined;
        };
    };
    const registerSidebarItem = (item) => {
        items.push(item);
        updateCb();
    };
    const unregisterSidebarItem = (i18nLabel) => {
        const index = items.findIndex((item) => item.i18nLabel === i18nLabel);
        delete items[index];
        updateCb();
    };
    return {
        registerSidebarItem,
        unregisterSidebarItem,
        getSidebarItems,
        subscribeToSidebarItems,
    };
};
exports.createSidebarItems = createSidebarItems;
