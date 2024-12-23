"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const RoomAutoCompleteMultiple_1 = __importDefault(require("../../../../../components/RoomAutoCompleteMultiple"));
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function RoomPickSettingInput({ _id, label, value, placeholder, readonly, disabled, required, hasResetButton, onChangeValue, onResetButtonClick, }) {
    const parsedValue = (value || []).map(({ _id }) => _id);
    const handleChange = (value) => {
        if (typeof value === 'object') {
            const newValue = value.map((currentValue) => ({ _id: currentValue }));
            onChangeValue(newValue);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(RoomAutoCompleteMultiple_1.default, { readOnly: readonly, placeholder: placeholder, disabled: disabled, value: parsedValue, onChange: handleChange }) })] }));
}
exports.default = RoomPickSettingInput;
