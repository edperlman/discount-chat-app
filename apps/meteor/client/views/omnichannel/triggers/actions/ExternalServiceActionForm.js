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
exports.ExternalServiceActionForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../../../hooks/useHasLicenseModule");
const hooks_1 = require("../hooks");
const ActionExternalServiceUrl_1 = require("./ActionExternalServiceUrl");
const ActionSender_1 = require("./ActionSender");
const ExternalServiceActionForm = (_a) => {
    var { control, trigger, index } = _a, props = __rest(_a, ["control", "trigger", "index"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const timeoutFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const timeoutFieldName = `actions.${index}.params.serviceTimeout`;
    const fallbackMessageFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const fallbackMessageFieldName = `actions.${index}.params.serviceFallbackMessage`;
    const [timeoutError, fallbackMessageError] = (0, hooks_1.useFieldError)({ control, name: [timeoutFieldName, fallbackMessageFieldName] });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(ActionSender_1.ActionSender, { disabled: !hasLicense, control: control, index: index }), (0, jsx_runtime_1.jsx)(ActionExternalServiceUrl_1.ActionExternalServiceUrl, { disabled: !hasLicense, control: control, trigger: trigger, index: index }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: timeoutFieldId, children: t('Timeout_in_miliseconds') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: timeoutFieldName, defaultValue: 10000, rules: {
                                required: t('Required_field', { field: t('Timeout_in_miliseconds') }),
                                min: { value: 0, message: t('Timeout_in_miliseconds_cant_be_negative_number') },
                            }, render: ({ field }) => {
                                return ((0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({}, field, { error: timeoutError === null || timeoutError === void 0 ? void 0 : timeoutError.message, "aria-invalid": Boolean(timeoutError), "aria-describedby": `${timeoutFieldId}-hint`, "aria-required": true, onFocus: (v) => v.currentTarget.select(), disabled: !hasLicense })));
                            } }) }), timeoutError && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${timeoutFieldId}-error`, children: timeoutError.message })), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${timeoutFieldId}-hint`, children: t('Timeout_in_miliseconds_hint') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fallbackMessageFieldId, children: t('Fallback_message') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: fallbackMessageFieldName, defaultValue: '', render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({}, field, { id: fallbackMessageFieldId, rows: 3, placeholder: t('Fallback_message'), error: fallbackMessageError === null || fallbackMessageError === void 0 ? void 0 : fallbackMessageError.message, "aria-invalid": Boolean(fallbackMessageError), "aria-describedby": `${fallbackMessageFieldId}-hint`, "aria-required": true, disabled: !hasLicense }))) }) }), fallbackMessageError && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${fallbackMessageFieldId}-error`, children: fallbackMessageError.message })), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${fallbackMessageFieldId}-hint`, children: t('Service_fallback_message_hint') })] })] })));
};
exports.ExternalServiceActionForm = ExternalServiceActionForm;
