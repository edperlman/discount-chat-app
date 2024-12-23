"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useEndpointData_1 = require("../../../../../hooks/useEndpointData");
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function LookupSettingInput({ _id, label, value, placeholder, readonly, autocomplete, disabled, required, lookupEndpoint, hasResetButton, onChangeValue, onResetButtonClick, }) {
    const handleChange = (value) => {
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(value);
    };
    const { value: options } = (0, useEndpointData_1.useEndpointData)(lookupEndpoint);
    const values = (options === null || options === void 0 ? void 0 : options.data) || [];
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { "data-qa-setting-id": _id, id: _id, value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: (value) => handleChange(String(value)), options: values.map(({ key, label }) => [key, label]) }) })] }));
}
exports.default = LookupSettingInput;
