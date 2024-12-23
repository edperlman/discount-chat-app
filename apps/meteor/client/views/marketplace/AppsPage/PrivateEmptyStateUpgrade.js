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
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const UpgradeButton_1 = __importDefault(require("../../admin/subscription/components/UpgradeButton"));
const links_1 = require("../../admin/subscription/utils/links");
const PrivateEmptyStateUpgrade = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdmin = (0, ui_contexts_1.usePermission)('manage-apps');
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'lightning' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Private_apps_upgrade_empty_state_title') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Private_apps_upgrade_empty_state_description') }), (0, jsx_runtime_1.jsxs)(fuselage_1.StatesActions, { children: [isAdmin && ((0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { primary: true, target: 'private-apps-header', action: 'upgrade', children: t('Upgrade') })), !isAdmin && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => handleOpenLink(links_1.PRICING_LINK), role: 'link', children: t('Learn_more') }))] })] }));
};
exports.default = PrivateEmptyStateUpgrade;
