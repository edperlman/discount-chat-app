"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToMarketplaceSidebarItems = exports.getMarketplaceSidebarItems = exports.unregisterMarketplaceSidebarItem = exports.registerMarketplaceSidebarItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const MarketplaceRequestBadge_1 = __importDefault(require("./components/MarketplaceRequestBadge"));
const client_1 = require("../../../app/authorization/client");
const createSidebarItems_1 = require("../../lib/createSidebarItems");
_a = (0, createSidebarItems_1.createSidebarItems)([
    {
        href: '/marketplace/explore',
        icon: 'compass',
        i18nLabel: 'Explore',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['access-marketplace', 'manage-apps']),
    },
    {
        href: '/marketplace/premium',
        icon: 'lightning',
        i18nLabel: 'Premium',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['access-marketplace', 'manage-apps']),
    },
    {
        href: '/marketplace/installed',
        icon: 'circle-arrow-down',
        i18nLabel: 'Installed',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['access-marketplace', 'manage-apps']),
    },
    {
        href: '/marketplace/requested',
        icon: 'cube',
        i18nLabel: 'Requested',
        badge: () => (0, jsx_runtime_1.jsx)(MarketplaceRequestBadge_1.default, {}),
        permissionGranted: () => (0, client_1.hasPermission)('manage-apps'),
    },
    {
        href: '/marketplace/private',
        icon: 'lock',
        i18nLabel: 'Private_Apps',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['access-marketplace', 'manage-apps']),
    },
    { divider: true, i18nLabel: 'marketplace/private', permissionGranted: () => (0, client_1.hasPermission)('access-marketplace') },
    {
        href: 'https://go.rocket.chat/i/developing-an-app',
        icon: 'new-window',
        i18nLabel: 'Documentation',
        externalUrl: true,
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['access-marketplace', 'manage-apps']),
    },
    { divider: true, i18nLabel: 'marketplace/Documentation', permissionGranted: () => (0, client_1.hasPermission)('access-marketplace') },
]), exports.registerMarketplaceSidebarItem = _a.registerSidebarItem, exports.unregisterMarketplaceSidebarItem = _a.unregisterSidebarItem, exports.getMarketplaceSidebarItems = _a.getSidebarItems, exports.subscribeToMarketplaceSidebarItems = _a.subscribeToSidebarItems;
