"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const checkIsOptionsValid = (value) => {
    if (!value || value.trim() === '') {
        return false;
    }
    return value.split(',').every((v) => /^[a-zA-Z0-9-_ ]+$/.test(v));
};
const CustomFieldsAdditionalForm = ({ className }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control, watch, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const { visibility, type } = watch();
    const typeOptions = (0, react_1.useMemo)(() => [
        ['input', t('Input')],
        ['select', t('Select')],
    ], [t]);
    const requiredField = (0, fuselage_hooks_1.useUniqueId)();
    const typeField = (0, fuselage_hooks_1.useUniqueId)();
    const defaultValueField = (0, fuselage_hooks_1.useUniqueId)();
    const optionsField = (0, fuselage_hooks_1.useUniqueId)();
    const publicField = (0, fuselage_hooks_1.useUniqueId)();
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { className: className, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: requiredField, children: t('Required') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'required', control: control, render: (_a) => {
                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: requiredField }, field, { checked: value }));
                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: typeField, children: t('Type') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'type', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: typeField, options: typeOptions }, field)) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: defaultValueField, children: t('Default_value') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'defaultValue', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: defaultValueField }, field)) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: optionsField, children: t('Options') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'options', control: control, rules: {
                                validate: (optionsValue) => (type === 'select' && !checkIsOptionsValid(optionsValue) ? t('error-invalid-value') : undefined),
                            }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: optionsField }, field, { disabled: type === 'input', "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.options), "aria-describedby": `${optionsField}-hint ${optionsField}-error` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${optionsField}-hint`, children: t('Livechat_custom_fields_options_placeholder') }), errors.options && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${optionsField}-error`, children: errors.options.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: publicField, children: t('Public') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'public', control: control, render: (_a) => {
                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: publicField }, field, { disabled: !visibility, checked: value, "aria-describedby": `${publicField}-hint` })));
                                } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${publicField}-hint`, children: t('Livechat_custom_fields_public_description') })] })] }));
};
exports.default = CustomFieldsAdditionalForm;
