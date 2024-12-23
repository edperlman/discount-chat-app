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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldsForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const FIELD_TYPES = {
    select: fuselage_1.Select,
    text: fuselage_1.TextInput,
};
const CustomField = (_a) => {
    var _b;
    var { name, type, control, label, required, defaultValue, options = [] } = _a, props = __rest(_a, ["name", "type", "control", "label", "required", "defaultValue", "options"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { errors } = (0, react_hook_form_1.useFormState)({ control });
    const fieldId = (0, fuselage_hooks_1.useUniqueId)();
    const Component = (_b = FIELD_TYPES[type]) !== null && _b !== void 0 ? _b : null;
    const selectOptions = (0, react_1.useMemo)(() => options.length > 0 && options[0] instanceof Array ? options : options.map((option) => [option, option, defaultValue === option]), [defaultValue, options]);
    const validateRequired = (0, react_1.useCallback)((value) => (required ? typeof value === 'string' && !!value.trim() : true), [required]);
    const getErrorMessage = (0, react_1.useCallback)((error) => {
        switch (error === null || error === void 0 ? void 0 : error.type) {
            case 'required':
                return t('Required_field', { field: label || name });
            case 'minLength':
                return t('Min_length_is', { postProcess: 'sprintf', sprintf: [props === null || props === void 0 ? void 0 : props.minLength] });
            case 'maxLength':
                return t('Max_length_is', { postProcess: 'sprintf', sprintf: [props === null || props === void 0 ? void 0 : props.maxLength] });
        }
    }, [label, name, props === null || props === void 0 ? void 0 : props.maxLength, props === null || props === void 0 ? void 0 : props.minLength, t]);
    const error = (0, react_hook_form_1.get)(errors, name);
    const errorMessage = (0, react_1.useMemo)(() => getErrorMessage(error), [error, getErrorMessage]);
    return ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: name, control: control, defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : '', rules: { minLength: props.minLength, maxLength: props.maxLength, validate: { required: validateRequired } }, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { "rcx-field-group__item": true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fieldId, required: required, children: label || t(name) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props, field, { id: fieldId, "aria-describedby": `${fieldId}-error`, error: errorMessage, options: selectOptions, flexGrow: 1 })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${fieldId}-error`, children: errorMessage })] })) }));
};
// eslint-disable-next-line react/no-multi-comp
const CustomFieldsForm = ({ formName, formControl, metadata }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: metadata.map((_a) => {
        var _b;
        var { name: fieldName } = _a, props = __rest(_a, ["name"]);
        props.label = (_b = props.label) !== null && _b !== void 0 ? _b : fieldName;
        return (0, jsx_runtime_1.jsx)(CustomField, Object.assign({ name: `${formName}.${fieldName}`, control: formControl }, props), fieldName);
    }) }));
exports.CustomFieldsForm = CustomFieldsForm;
