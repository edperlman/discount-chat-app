"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const links_1 = require("../../admin/subscription/utils/links");
const AddonRequiredModal = ({ actionType, onDismiss, onInstallAnyway }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleOpenLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Add-on_required') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onDismiss })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: t('Add-on_required_modal_enable_content') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [['install', 'update'].includes(actionType) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onInstallAnyway, children: actionType === 'install' ? t('Install_anyway') : t('Update_anyway') })), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: () => handleOpenLink(links_1.GET_ADDONS_LINK), children: t('Contact_sales') })] }) })] }));
};
exports.default = AddonRequiredModal;
