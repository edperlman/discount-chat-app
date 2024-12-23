"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function IntSettingInput({ _id, label, value, placeholder, readonly, autocomplete, disabled, required, onChangeValue, hasResetButton, onResetButtonClick, }) {
    const handleChange = (event) => {
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(parseInt(event.currentTarget.value, 10));
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { "data-qa-setting-id": _id, id: _id, type: 'number', value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleChange }) })] }));
}
exports.default = IntSettingInput;
