"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useStatusDisabledModal_1 = require("../../views/admin/customUserStatus/hooks/useStatusDisabledModal");
const StatusDisabledBanner = ({ onDismiss }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleStatusDisabledModal = (0, useStatusDisabledModal_1.useStatusDisabledModal)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.SidebarBanner, { text: t('User_status_temporarily_disabled'), description: t('Learn_more'), onClose: onDismiss, onClick: handleStatusDisabledModal }));
};
exports.default = StatusDisabledBanner;
