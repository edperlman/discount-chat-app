"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToOmnichannelSidebarItems = exports.getOmnichannelSidebarItems = exports.unregisterSidebarItem = exports.registerOmnichannelSidebarItem = void 0;
const client_1 = require("../../../app/authorization/client");
const createSidebarItems_1 = require("../../lib/createSidebarItems");
_a = (0, createSidebarItems_1.createSidebarItems)([
    {
        href: '/omnichannel/current',
        icon: 'message',
        i18nLabel: 'Current_Chats',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-current-chats'),
    },
    {
        href: '/omnichannel/analytics',
        icon: 'dashboard',
        i18nLabel: 'Analytics',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-analytics'),
    },
    {
        href: '/omnichannel/realtime-monitoring',
        icon: 'live',
        i18nLabel: 'Real_Time_Monitoring',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-real-time-monitoring'),
    },
    {
        href: '/omnichannel/managers',
        icon: 'shield',
        i18nLabel: 'Managers',
        permissionGranted: () => (0, client_1.hasPermission)('manage-livechat-managers'),
    },
    {
        href: '/omnichannel/agents',
        icon: 'headset',
        i18nLabel: 'Agents',
        permissionGranted: () => (0, client_1.hasPermission)('manage-livechat-agents'),
    },
    {
        href: '/omnichannel/departments',
        icon: 'folder',
        i18nLabel: 'Departments',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-departments'),
    },
    {
        href: '/omnichannel/customfields',
        icon: 'file-sheets',
        i18nLabel: 'Custom_Fields',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-customfields'),
    },
    {
        href: '/omnichannel/triggers',
        icon: 'smart',
        i18nLabel: 'Livechat_Triggers',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-triggers'),
    },
    {
        href: '/omnichannel/installation',
        icon: 'livechat',
        i18nLabel: 'Livechat_Installation',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-installation'),
    },
    {
        href: '/omnichannel/appearance',
        icon: 'palette',
        i18nLabel: 'Livechat_Appearance',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-appearance'),
    },
    {
        href: '/omnichannel/webhooks',
        icon: 'code',
        i18nLabel: 'Webhooks',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-webhooks'),
    },
    {
        href: '/omnichannel/businessHours',
        icon: 'clock',
        i18nLabel: 'Business_Hours',
        permissionGranted: () => (0, client_1.hasPermission)('view-livechat-business-hours'),
    },
    {
        href: '/omnichannel/security-privacy',
        icon: 'shield-check',
        i18nLabel: 'Security_and_privacy',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['view-privileged-setting', 'edit-privileged-setting', 'manage-selected-settings']),
    },
]), exports.registerOmnichannelSidebarItem = _a.registerSidebarItem, exports.unregisterSidebarItem = _a.unregisterSidebarItem, exports.getOmnichannelSidebarItems = _a.getSidebarItems, exports.subscribeToOmnichannelSidebarItems = _a.subscribeToSidebarItems;
