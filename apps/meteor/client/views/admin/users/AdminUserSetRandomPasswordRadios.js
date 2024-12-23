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
const AdminUserSetRandomPasswordRadios = ({ isNewUserPage, control, isSmtpEnabled, setRandomPasswordId, setValue, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setPasswordManuallyId = (0, fuselage_hooks_1.useUniqueId)();
    const handleSetRandomPasswordChange = (onChange, value) => {
        setValue('requirePasswordChange', value);
        onChange(value);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1, mbe: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { mie: 8, children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'setRandomPassword', defaultValue: isSmtpEnabled && isNewUserPage, render: ({ field: { ref, onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { ref: ref, id: setRandomPasswordId, "aria-describedby": `${setRandomPasswordId}-hint`, checked: value, onChange: () => handleSetRandomPasswordChange(onChange, true), disabled: !isSmtpEnabled })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: setRandomPasswordId, alignSelf: 'center', fontScale: 'p2', disabled: !isSmtpEnabled, children: t('Set_randomly_and_send_by_email') })] }), !isSmtpEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${setRandomPasswordId}-hint`, dangerouslySetInnerHTML: { __html: t('Send_Email_SMTP_Warning', { url: 'admin/settings/Email' }) }, mbe: 16, mbs: 0 })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { mie: 8, children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'setRandomPassword', defaultValue: !isNewUserPage, render: ({ field: { ref, onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { ref: ref, id: setPasswordManuallyId, "aria-describedby": `${setPasswordManuallyId}-hint`, checked: !value, onChange: () => handleSetRandomPasswordChange(onChange, false) })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: setPasswordManuallyId, alignSelf: 'center', fontScale: 'p2', children: t('Set_manually') })] })] }));
};
exports.default = AdminUserSetRandomPasswordRadios;
