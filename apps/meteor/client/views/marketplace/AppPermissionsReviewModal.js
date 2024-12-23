"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppPermissionsList_1 = __importDefault(require("./components/AppPermissionsList"));
const GenericModal_1 = __importDefault(require("../../components/GenericModal"));
const AppPermissionsReviewModal = ({ appPermissions, onCancel, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'warning', title: t('Apps_Permissions_Review_Modal_Title'), onCancel: onCancel, onConfirm: () => onConfirm(appPermissions), onClose: onCancel, confirmText: t('Agree'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mbe: 20, children: t('Apps_Permissions_Review_Modal_Subtitle') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'ol', type: '1', style: { listStyleType: 'decimal' }, mis: 24, children: (0, jsx_runtime_1.jsx)(AppPermissionsList_1.default, { appPermissions: appPermissions }) })] }));
};
exports.default = AppPermissionsReviewModal;
