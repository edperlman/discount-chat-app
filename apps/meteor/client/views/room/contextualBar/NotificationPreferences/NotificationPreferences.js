"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const NotificationPreferencesForm_1 = __importDefault(require("./NotificationPreferencesForm"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const NotificationPreferences = ({ handleClose, handleSave, notificationOptions, handlePlaySound, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { formState: { isDirty, isSubmitting }, } = (0, react_hook_form_1.useFormContext)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'bell' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Notifications_Preferences') }), handleClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(NotificationPreferencesForm_1.default, { notificationOptions: notificationOptions, handlePlaySound: handlePlaySound }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [handleClose && (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !isDirty, loading: isSubmitting, onClick: handleSave, children: t('Save') })] }) })] }));
};
exports.default = NotificationPreferences;
