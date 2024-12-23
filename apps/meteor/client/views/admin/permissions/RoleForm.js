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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const RoleForm = ({ className, editing = false, isProtected = false, isDisabled = false }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register, control, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const options = (0, react_1.useMemo)(() => [
        ['Users', t('Global')],
        ['Subscriptions', t('Rooms')],
    ], [t]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Role') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ disabled: editing || isDisabled, placeholder: t('Role') }, register('name', { required: t('Required_field', { field: t('Role') }) }))) }), (errors === null || errors === void 0 ? void 0 : errors.name) && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: errors.name.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ placeholder: t('Description'), disabled: isDisabled }, register('description'))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: "Leave the description field blank if you dont want to show the role" })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Scope') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scope', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { options: options, disabled: isProtected || isDisabled, placeholder: t('Scope') }))) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { className: className, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Users must use Two Factor Authentication') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'mandatory2fa', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({}, field, { checked: field.value, disabled: isDisabled })) })] }) })] }));
};
exports.default = RoleForm;
