"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function StringSettingInput({ _id, label, name, disabled, required, multiline, placeholder, readonly, error, autocomplete, value, hasResetButton, onChangeValue, onResetButtonClick, }) {
    const handleChange = (event) => {
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(event.currentTarget.value);
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: multiline ? ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, { "data-qa-setting-id": _id, id: _id, name: name, rows: 4, value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, error: error, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleChange })) : ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { "data-qa-setting-id": _id, id: _id, value: value, name: name, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, error: error, onChange: handleChange })) })] }));
}
exports.default = StringSettingInput;
