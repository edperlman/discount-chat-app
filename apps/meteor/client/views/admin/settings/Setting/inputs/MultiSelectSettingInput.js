"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function MultiSelectSettingInput({ _id, label, value, placeholder, readonly, disabled, required, values = [], hasResetButton, onChangeValue, onResetButtonClick, autocomplete, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleChange = (value) => {
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(value);
        // onChangeValue && onChangeValue([...event.currentTarget.querySelectorAll('option')].filter((e) => e.selected).map((el) => el.value));
    };
    const Component = autocomplete ? fuselage_1.MultiSelectFiltered : fuselage_1.MultiSelect;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(Component, { "max-width": 'full', "data-qa-setting-id": _id, id: _id, value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, 
                    // autoComplete={autocomplete === false ? 'off' : undefined}
                    onChange: handleChange, options: values.map(({ key, i18nLabel }) => [key, t(i18nLabel)]) }) })] }));
}
exports.default = MultiSelectSettingInput;
