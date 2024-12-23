"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppDetailsPageTabs = ({ context, installed, isSecurityVisible, settings, tab }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    const router = (0, ui_contexts_1.useRouter)();
    const handleTabClick = (tab) => {
        router.navigate({
            name: 'marketplace',
            params: Object.assign(Object.assign({}, router.getRouteParameters()), { tab }),
        }, { replace: true });
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { onClick: () => handleTabClick('details'), selected: !tab || tab === 'details', children: t('Details') }), isAdminUser && context !== 'private' && ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { onClick: () => handleTabClick('requests'), selected: tab === 'requests', children: t('Requests') })), isSecurityVisible && ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { onClick: () => handleTabClick('security'), selected: tab === 'security', children: t('Security') })), context !== 'private' && ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { onClick: () => handleTabClick('releases'), selected: tab === 'releases', children: t('Releases') })), Boolean(installed && settings && Object.values(settings).length) && isAdminUser && ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { onClick: () => handleTabClick('settings'), selected: tab === 'settings', children: t('Settings') })), Boolean(installed) && isAdminUser && isAdminUser && ((0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { onClick: () => handleTabClick('logs'), selected: tab === 'logs', children: t('Logs') }))] }));
};
exports.default = AppDetailsPageTabs;
