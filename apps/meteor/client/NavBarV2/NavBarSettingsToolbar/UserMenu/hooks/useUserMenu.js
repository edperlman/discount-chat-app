"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserMenu = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const UserMenuHeader_1 = __importDefault(require("../UserMenuHeader"));
const useAccountItems_1 = require("./useAccountItems");
const useStatusItems_1 = require("./useStatusItems");
const useVoipItemsSection_1 = require("./useVoipItemsSection");
const useUserMenu = (user) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const statusItems = (0, useStatusItems_1.useStatusItems)();
    const accountItems = (0, useAccountItems_1.useAccountItems)();
    const voipSection = (0, useVoipItemsSection_1.useVoipItemsSection)();
    const logout = (0, ui_contexts_1.useLogout)();
    const handleLogout = (0, fuselage_hooks_1.useEffectEvent)(() => {
        logout();
    });
    const logoutItem = {
        id: 'logout',
        icon: 'sign-out',
        content: t('Logout'),
        onClick: handleLogout,
    };
    return [
        {
            title: (0, jsx_runtime_1.jsx)(UserMenuHeader_1.default, { user: user }),
            items: [],
        },
        {
            title: t('Status'),
            items: statusItems,
        },
        voipSection,
        {
            title: t('Account'),
            items: accountItems,
        },
        {
            items: [logoutItem],
        },
    ].filter((section) => section !== undefined);
};
exports.useUserMenu = useUserMenu;
