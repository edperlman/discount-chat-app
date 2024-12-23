"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../../../components/GenericModal"));
const LeaveTeamModalConfirmation = ({ selectedRooms, onConfirm, onCancel, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', title: t('Confirmation'), onConfirm: () => onConfirm(selectedRooms), onCancel: onCancel || onClose, onClose: onClose, confirmText: t('Leave'), cancelText: onCancel ? t('Back') : t('Cancel'), children: t('Teams_leaving_team') }));
};
exports.default = LeaveTeamModalConfirmation;
