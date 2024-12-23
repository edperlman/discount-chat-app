"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function BooleanSettingInput({ _id, label, disabled, readonly, required, value, hasResetButton, onChangeValue, onResetButtonClick, }) {
    const handleChange = (event) => {
        const value = event.currentTarget.checked;
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(value);
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { marginBlockEnd: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { mie: 8, "data-qa-reset-setting-id": _id, onClick: onResetButtonClick }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "data-qa-setting-id": _id, id: _id, checked: value === true, disabled: disabled || readonly, onChange: handleChange })] })] }) }));
}
exports.default = BooleanSettingInput;
