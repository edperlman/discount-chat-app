"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const CustomUserStatusDisabledModal = ({ isAdmin, onConfirm, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return isAdmin ? ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('User_status_disabled_learn_more'), cancelText: t('Close'), confirmText: t('Go_to_workspace_settings'), children: t('User_status_disabled_learn_more_description'), onConfirm: onConfirm, onClose: onClose, onCancel: onClose, icon: null, variant: 'warning' })) : ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('User_status_disabled_learn_more'), confirmText: t('Close'), children: t('User_status_disabled_learn_more_description'), onConfirm: onConfirm, onClose: onClose, icon: null }));
};
exports.default = CustomUserStatusDisabledModal;
