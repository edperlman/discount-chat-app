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
const UpdateRocketChatButton_1 = __importDefault(require("../components/UpdateRocketChatButton"));
const UnsupportedEmptyState = () => {
    const isAdmin = (0, ui_contexts_1.usePermission)('manage-apps');
    const { t } = (0, react_i18next_1.useTranslation)();
    const title = isAdmin ? t('Update_to_access_marketplace') : t('Marketplace_unavailable');
    const description = isAdmin ? t('Update_to_access_marketplace_description') : t('Marketplace_unavailable_description');
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 64, children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'warning' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: title }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: description }), (0, jsx_runtime_1.jsxs)(fuselage_1.StatesActions, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, is: 'a', href: 'https://go.rocket.chat/i/support-prerequisites ', external: true, children: t('Learn_more') }), isAdmin && (0, jsx_runtime_1.jsx)(UpdateRocketChatButton_1.default, {})] })] }) }));
};
exports.default = UnsupportedEmptyState;
