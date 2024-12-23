"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useExternalLink_1 = require("../../../../hooks/useExternalLink");
const useCheckoutUrl_1 = require("../../../admin/subscription/hooks/useCheckoutUrl");
const links_1 = require("../../../admin/subscription/utils/links");
const PrivateAppInstallModal = ({ onClose, onProceed }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'private-apps-page', action: 'upgrade' });
    const goToManageSubscriptionPage = () => {
        openExternalLink(manageSubscriptionUrl);
        onClose();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeaderText, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Private_app_install_modal_title') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { "aria-label": t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 28, children: t('Private_app_install_modal_content') }), t('Upgrade_subscription_to_enable_private_apps')] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Footer, { justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.FooterAnnotation, { children: (0, jsx_runtime_1.jsx)("a", { target: '_blank', rel: 'noopener noreferrer', href: links_1.PRICING_LINK, children: t('Compare_plans') }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onProceed, children: t('Upload_anyway') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: goToManageSubscriptionPage, primary: true, children: t('Upgrade') })] })] })] }));
};
exports.default = PrivateAppInstallModal;
