"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const useCheckoutUrl_1 = require("../../../views/admin/subscription/hooks/useCheckoutUrl");
const EnterpriseDepartmentsModal = ({ closeModal }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const ref = (0, react_1.useRef)(null);
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'new-departments-page', action: 'upgrade' });
    const goToManageSubscriptionPage = () => {
        openExternalLink(manageSubscriptionUrl);
        closeModal();
    };
    const onClose = () => {
        router.navigate('/omnichannel/departments');
        closeModal();
    };
    (0, fuselage_hooks_1.useOutsideClick)([ref], onClose);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "data-qa-id": 'enterprise-departments-modal', ref: ref, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.HeaderText, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Tagline, { children: t('Premium_capability') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Departments') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose, "data-qa": 'modal-close' })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { fontScale: 'p2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.HeroImage, { src: '/images/departments.svg' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h3', mbe: 28, children: t('Premium_Departments_title') }), t('Premium_Departments_description_upgrade')] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: goToManageSubscriptionPage, primary: true, "data-qa-id": 'upgrade-now', children: t('Upgrade') })] }) })] }));
};
exports.default = EnterpriseDepartmentsModal;
