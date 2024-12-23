"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
const AutoCompleteDepartmentMultiple_1 = __importDefault(require("../../components/AutoCompleteDepartmentMultiple"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const BusinessHoursMultiple = ({ className }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const enabledField = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentsField = (0, fuselage_hooks_1.useUniqueId)();
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { className: className, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enabledField, children: t('Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'active', control: control, render: (_a) => {
                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: enabledField }, field, { checked: value }));
                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField }, field, { "aria-describedby": `${departmentsField}-error` })) }) }), (errors === null || errors === void 0 ? void 0 : errors.name) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${departmentsField}-error`, children: errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentsField, children: t('Departments') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'departments', control: control, render: ({ field: { value, onChange, name, onBlur } }) => ((0, jsx_runtime_1.jsx)(AutoCompleteDepartmentMultiple_1.default, { id: departmentsField, value: value, onChange: onChange, name: name, onBlur: onBlur, enabled: true })) }) })] })] }));
};
exports.default = BusinessHoursMultiple;
