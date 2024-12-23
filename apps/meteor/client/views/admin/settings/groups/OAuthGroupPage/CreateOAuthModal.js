"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const CreateOAuthModal = ({ onConfirm, onClose }) => {
    const { register, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            customOAuthName: '',
        },
    });
    const { t } = (0, react_i18next_1.useTranslation)();
    const customOAuthNameId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(({ customOAuthName }) => onConfirm(customOAuthName)) }, props)), title: t('Add_custom_oauth'), confirmText: t('Add'), onCancel: onClose, onClose: onClose, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: customOAuthNameId, children: t('Custom_OAuth_name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: customOAuthNameId }, register('customOAuthName', { required: t('Required_field', { field: t('Custom_OAuth_name') }) }), { "aria-required": 'true', "aria-describedby": `${customOAuthNameId}-error ${customOAuthNameId}-hint`, "aria-label": t('Custom_OAuth_name') })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${customOAuthNameId}-hint`, children: t('Custom_OAuth_name_hint') }), errors.customOAuthName && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${customOAuthNameId}-error`, children: errors.customOAuthName.message }))] }) }));
};
exports.default = CreateOAuthModal;
