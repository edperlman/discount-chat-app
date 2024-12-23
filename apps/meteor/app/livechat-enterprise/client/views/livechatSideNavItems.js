"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sidebarItems_1 = require("../../../../client/views/omnichannel/sidebarItems");
const client_1 = require("../../../authorization/client");
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/reports',
    icon: 'file',
    i18nLabel: 'Reports',
    permissionGranted: () => (0, client_1.hasPermission)('view-livechat-reports'),
});
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/monitors',
    icon: 'shield-blank',
    i18nLabel: 'Livechat_Monitors',
    permissionGranted: () => (0, client_1.hasPermission)('manage-livechat-monitors'),
});
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/units',
    icon: 'business',
    i18nLabel: 'Units',
    permissionGranted: () => (0, client_1.hasPermission)('manage-livechat-units'),
});
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/canned-responses',
    icon: 'canned-response',
    i18nLabel: 'Canned_Responses',
    permissionGranted: () => (0, client_1.hasPermission)('manage-livechat-canned-responses'),
});
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/tags',
    icon: 'tag',
    i18nLabel: 'Tags',
    permissionGranted: () => (0, client_1.hasPermission)('manage-livechat-tags'),
});
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/sla-policies',
    icon: 'flag',
    i18nLabel: 'SLA_Policies',
    permissionGranted: () => (0, client_1.hasAtLeastOnePermission)('manage-livechat-sla'),
});
(0, sidebarItems_1.registerOmnichannelSidebarItem)({
    href: '/omnichannel/priorities',
    icon: 'chevron-double-up',
    i18nLabel: 'Priorities',
    permissionGranted: () => (0, client_1.hasAtLeastOnePermission)('manage-livechat-priorities'),
});
