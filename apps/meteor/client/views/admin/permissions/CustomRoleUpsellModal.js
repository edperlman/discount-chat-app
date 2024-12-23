"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericUpsellModal_1 = __importDefault(require("../../../components/GenericUpsellModal"));
const hooks_1 = require("../../../components/GenericUpsellModal/hooks");
const CustomRoleUpsellModal = ({ onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { handleManageSubscription } = (0, hooks_1.useUpsellActions)();
    return ((0, jsx_runtime_1.jsx)(GenericUpsellModal_1.default, { "aria-label": t('Custom_roles'), img: 'images/custom-role-upsell-modal.png', title: t('Custom_roles'), subtitle: t('Custom_roles_upsell_add_custom_roles_workspace'), description: t('Custom_roles_upsell_add_custom_roles_workspace_description'), onClose: onClose, onConfirm: handleManageSubscription, onCancel: onClose }));
};
exports.default = CustomRoleUpsellModal;
