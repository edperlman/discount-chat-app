"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToAccountSidebarItems = exports.getAccountSidebarItems = exports.unregisterSidebarItem = exports.registerAccountSidebarItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const client_1 = require("../../../app/authorization/client");
const client_2 = require("../../../app/settings/client");
const createSidebarItems_1 = require("../../lib/createSidebarItems");
_a = (0, createSidebarItems_1.createSidebarItems)([
    {
        href: '/account/profile',
        i18nLabel: 'Profile',
        icon: 'user',
        permissionGranted: () => client_2.settings.get('Accounts_AllowUserProfileChange'),
    },
    {
        href: '/account/preferences',
        i18nLabel: 'Preferences',
        icon: 'customize',
    },
    {
        href: '/account/security',
        i18nLabel: 'Security',
        icon: 'lock',
        permissionGranted: () => client_2.settings.get('Accounts_TwoFactorAuthentication_Enabled') ||
            client_2.settings.get('E2E_Enable') ||
            client_2.settings.get('Accounts_AllowPasswordChange'),
    },
    {
        href: '/account/integrations',
        i18nLabel: 'Integrations',
        icon: 'code',
        permissionGranted: () => client_2.settings.get('Webdav_Integration_Enabled'),
    },
    {
        href: '/account/tokens',
        i18nLabel: 'Personal_Access_Tokens',
        icon: 'key',
        permissionGranted: () => (0, client_1.hasPermission)('create-personal-access-tokens'),
    },
    {
        href: '/account/omnichannel',
        i18nLabel: 'Omnichannel',
        icon: 'headset',
        permissionGranted: () => (0, client_1.hasAtLeastOnePermission)(['send-omnichannel-chat-transcript', 'request-pdf-transcript']),
    },
    {
        href: '/account/feature-preview',
        i18nLabel: 'Feature_preview',
        icon: 'flask',
        badge: () => (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewBadge, {}),
        permissionGranted: () => client_2.settings.get('Accounts_AllowFeaturePreview') && (ui_client_1.defaultFeaturesPreview === null || ui_client_1.defaultFeaturesPreview === void 0 ? void 0 : ui_client_1.defaultFeaturesPreview.length) > 0,
    },
    {
        href: '/account/accessibility-and-appearance',
        i18nLabel: 'Accessibility_and_Appearance',
        icon: 'person-arms-spread',
    },
]), exports.registerAccountSidebarItem = _a.registerSidebarItem, exports.unregisterSidebarItem = _a.unregisterSidebarItem, exports.getAccountSidebarItems = _a.getSidebarItems, exports.subscribeToAccountSidebarItems = _a.subscribeToSidebarItems;
