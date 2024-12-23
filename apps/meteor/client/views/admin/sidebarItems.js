"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToAdminSidebarItems = exports.getAdminSidebarItems = exports.unregisterSidebarItem = exports.registerAdminSidebarItem = void 0;
const ui_client_1 = require("@rocket.chat/ui-client");
const client_1 = require("../../../app/authorization/client");
const createSidebarItems_1 = require("../../lib/createSidebarItems");
_a = (0, createSidebarItems_1.createSidebarItems)([
    {
        href: '/admin/info',
        i18nLabel: 'Workspace',
        icon: 'info-circled',
        permissionGranted: () => (0, client_1.hasPermission)('view-statistics'),
    },
    {
        href: '/admin/subscription',
        i18nLabel: 'Subscription',
        icon: 'card',
        permissionGranted: () => (0, client_1.hasPermission)('manage-cloud'),
    },
    {
        href: '/admin/engagement/users',
        i18nLabel: 'Engagement',
        icon: 'dashboard',
        permissionGranted: () => (0, client_1.hasPermission)('view-engagement-dashboard'),
    },
    {
        href: '/admin/moderation',
        i18nLabel: 'Moderation',
        icon: 'shield-alt',
        tag: 'Beta',
        permissionGranted: () => (0, client_1.hasPermission)('view-moderation-console'),
    },
    {
        href: '/admin/federation',
        i18nLabel: 'Federation',
        icon: 'discover',
        permissionGranted: () => (0, client_1.hasPermission)('view-federation-data'),
    },
    {
        href: '/admin/rooms',
        i18nLabel: 'Rooms',
        icon: 'hashtag',
        permissionGranted: () => (0, client_1.hasPermission)('view-room-administration'),
    },
    {
        href: '/admin/users',
        i18nLabel: 'Users',
        icon: 'team',
        permissionGranted: () => (0, client_1.hasPermission)('view-user-administration'),
    },
    {
        href: '/admin/invites',
        i18nLabel: 'Invites',
        icon: 'user-plus',
        permissionGranted: () => (0, client_1.hasPermission)('create-invite-links'),
    },
    {
        href: '/admin/user-status',
        i18nLabel: 'User_Status',
        icon: 'user',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['manage-user-status']),
    },
    {
        href: '/admin/permissions',
        i18nLabel: 'Permissions',
        icon: 'user-lock',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['access-permissions', 'access-setting-permissions']),
    },
    {
        href: '/admin/device-management',
        i18nLabel: 'Device_Management',
        icon: 'mobile',
        permissionGranted: () => (0, client_1.hasPermission)('view-device-management'),
    },
    {
        href: '/admin/email-inboxes',
        i18nLabel: 'Email_Inboxes',
        icon: 'mail',
        tag: 'Alpha',
        permissionGranted: () => (0, client_1.hasPermission)('manage-email-inbox'),
    },
    {
        href: '/admin/mailer',
        icon: 'mail',
        i18nLabel: 'Mailer',
        permissionGranted: () => (0, client_1.hasAllPermission)('access-mailer'),
    },
    {
        href: '/admin/third-party-login',
        i18nLabel: 'Third_party_login',
        icon: 'login',
        permissionGranted: () => (0, client_1.hasAllPermission)('manage-oauth-apps'),
    },
    {
        href: '/admin/integrations',
        i18nLabel: 'Integrations',
        icon: 'code',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)([
            'manage-outgoing-integrations',
            'manage-own-outgoing-integrations',
            'manage-incoming-integrations',
            'manage-own-incoming-integrations',
        ]),
    },
    {
        href: '/admin/import',
        i18nLabel: 'Import',
        icon: 'import',
        permissionGranted: () => (0, client_1.hasPermission)('run-import'),
    },
    {
        href: '/admin/reports',
        i18nLabel: 'Reports',
        icon: 'post',
        permissionGranted: () => (0, client_1.hasPermission)('view-logs'),
    },
    {
        href: '/admin/sounds',
        i18nLabel: 'Sounds',
        icon: 'volume',
        permissionGranted: () => (0, client_1.hasPermission)('manage-sounds'),
    },
    {
        href: '/admin/emoji',
        i18nLabel: 'Emoji',
        icon: 'emoji',
        permissionGranted: () => (0, client_1.hasPermission)('manage-emoji'),
    },
    {
        href: '/admin/feature-preview',
        i18nLabel: 'Feature_preview',
        icon: 'flask',
        permissionGranted: () => (ui_client_1.defaultFeaturesPreview === null || ui_client_1.defaultFeaturesPreview === void 0 ? void 0 : ui_client_1.defaultFeaturesPreview.length) > 0,
    },
    {
        href: '/admin/settings',
        i18nLabel: 'Settings',
        icon: 'customize',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['view-privileged-setting', 'edit-privileged-setting', 'manage-selected-settings']),
    },
]), exports.registerAdminSidebarItem = _a.registerSidebarItem, exports.unregisterSidebarItem = _a.unregisterSidebarItem, exports.getAdminSidebarItems = _a.getSidebarItems, exports.subscribeToAdminSidebarItems = _a.subscribeToSidebarItems;
