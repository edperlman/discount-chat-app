"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const useExternalLink_1 = require("../../hooks/useExternalLink");
const useCheckoutUrl_1 = require("../admin/subscription/hooks/useCheckoutUrl");
const links_1 = require("../admin/subscription/utils/links");
const AppExemptModal = ({ onCancel, appName }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'private-apps-page', action: 'upgrade' });
    const goToManageSubscriptionPage = () => {
        openExternalLink(manageSubscriptionUrl);
        onCancel();
    };
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { title: t('Apps_Cannot_Be_Updated'), onClose: onCancel, dontAskAgain: (0, jsx_runtime_1.jsx)(fuselage_1.Modal.FooterAnnotation, { children: (0, jsx_runtime_1.jsx)("a", { target: '_blank', rel: 'noopener noreferrer', href: links_1.PRICING_LINK, children: t('Compare_plans') }) }), variant: 'warning', cancelText: t('Cancel'), confirmText: t('Upgrade'), onCancel: onCancel, onConfirm: goToManageSubscriptionPage, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 28, children: t('Apps_Private_App_Is_Exempt', { appName }) }), t('Upgrade_subscription_to_enable_private_apps')] }));
};
exports.default = AppExemptModal;
