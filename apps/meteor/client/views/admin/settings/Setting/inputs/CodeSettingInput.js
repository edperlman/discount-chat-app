"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
const CodeMirror_1 = __importDefault(require("./CodeMirror"));
const CodeMirrorBox_1 = __importDefault(require("./CodeMirror/CodeMirrorBox"));
function CodeSettingInput({ _id, label, hint, value = '', code, placeholder, readonly, autocomplete, disabled, required, hasResetButton, onChangeValue, onResetButtonClick, }) {
    const handleChange = (value) => {
        onChangeValue(value);
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), hint && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: hint }), (0, jsx_runtime_1.jsx)(CodeMirrorBox_1.default, { label: label, children: (0, jsx_runtime_1.jsx)(CodeMirror_1.default, { "data-qa-setting-id": _id, id: _id, mode: code, value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleChange }) })] }));
}
exports.default = CodeSettingInput;
