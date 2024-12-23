"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrioritiesResetModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const PrioritiesResetModal = ({ onCancel, onReset }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', title: t('Reset_priorities'), onConfirm: onReset, onCancel: onCancel, onClose: onCancel, confirmText: t('Reset'), children: t('Are_you_sure_you_want_to_reset_the_name_of_all_priorities') }));
};
exports.PrioritiesResetModal = PrioritiesResetModal;
