"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const getURL_1 = require("../../../../app/utils/client/getURL");
const GenericUpsellModal_1 = __importDefault(require("../../../components/GenericUpsellModal"));
const hooks_1 = require("../../../components/GenericUpsellModal/hooks");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const AdvancedContactModal = ({ onCancel }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isAdmin = (0, ui_contexts_1.useRole)('admin');
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('contact-id-verification');
    const { shouldShowUpsell, handleManageSubscription } = (0, hooks_1.useUpsellActions)(hasLicense);
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsx)(GenericUpsellModal_1.default, { title: t('Advanced_contact_profile'), description: t('Advanced_contact_profile_description'), img: (0, getURL_1.getURL)('images/single-contact-id-upsell.png'), onClose: onCancel, onCancel: shouldShowUpsell ? onCancel : () => openExternalLink('https://go.rocket.chat/i/omnichannel-docs'), cancelText: !shouldShowUpsell ? t('Learn_more') : undefined, onConfirm: shouldShowUpsell ? handleManageSubscription : undefined, annotation: !shouldShowUpsell && !isAdmin ? t('Ask_enable_advanced_contact_profile') : undefined }));
};
exports.default = AdvancedContactModal;
