"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("./GenericModal"));
const FingerprintChangeModal = ({ onConfirm, onCancel, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'warning', title: t('Unique_ID_change_detected'), onConfirm: onConfirm, onClose: onClose, onCancel: onCancel, confirmText: t('New_workspace'), cancelText: t('Configuration_update'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', mbe: 16, dangerouslySetInnerHTML: {
                    __html: t('Unique_ID_change_detected_description'),
                } }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', mbe: 16, dangerouslySetInnerHTML: {
                    __html: t('Unique_ID_change_detected_learn_more_link'),
                } })] }));
};
exports.default = FingerprintChangeModal;
