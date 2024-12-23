"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFields = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const FormField_1 = require("../FormField");
const SelectInput_1 = require("../SelectInput");
const TextInput_1 = require("../TextInput");
const CustomFields = ({ customFields, loading, control, errors }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const customFieldsList = customFields.map(({ _id, required = false, label, type, options, regexp, defaultValue }) => {
        var _a, _b;
        const rules = type === 'select'
            ? { required }
            : Object.assign({ required }, (regexp && {
                pattern: {
                    value: regexp,
                    message: t('invalid', { field: label }),
                },
            }));
        return ((0, jsx_runtime_1.jsx)(FormField_1.FormField, { label: label, required: required, error: (_b = (_a = errors === null || errors === void 0 ? void 0 : errors[_id]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: _id, control: control, defaultValue: defaultValue, rules: rules, render: ({ field }) => {
                    var _a;
                    switch (type) {
                        case 'input':
                            return (0, jsx_runtime_1.jsx)(TextInput_1.TextInput, Object.assign({ placeholder: t('insert_your_field_here', { field: label }), disabled: loading }, field));
                        case 'select':
                            return ((0, jsx_runtime_1.jsx)(SelectInput_1.SelectInput, Object.assign({ placeholder: t('choose_an_option'), options: (_a = options === null || options === void 0 ? void 0 : options.map((option) => ({ value: option, label: option }))) !== null && _a !== void 0 ? _a : [], disabled: loading }, field)));
                    }
                } }) }, _id));
    });
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: customFieldsList });
};
exports.CustomFields = CustomFields;
