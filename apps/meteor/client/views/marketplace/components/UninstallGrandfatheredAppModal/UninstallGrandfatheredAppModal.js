"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const usePrivateAppsEnabled_1 = require("../../hooks/usePrivateAppsEnabled");
const UninstallGrandfatheredAppModal = ({ context, limit, appName, handleUninstall, handleClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const privateAppsEnabled = (0, usePrivateAppsEnabled_1.usePrivateAppsEnabled)();
    const modalContent = context === 'private' && !privateAppsEnabled
        ? t('App_will_lose_grandfathered_status_private')
        : t('App_will_lose_grandfathered_status', { limit });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Uninstall_grandfathered_app', { appName }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: handleClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: modalContent }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Footer, { justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.FooterAnnotation, { children: (0, jsx_runtime_1.jsx)("a", { target: '_blank', rel: 'noopener noreferrer', href: 'https://docs.rocket.chat/docs/rocketchat-marketplace', children: t('Learn_more') }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleUninstall, children: t('Uninstall') })] })] })] }));
};
exports.default = UninstallGrandfatheredAppModal;
