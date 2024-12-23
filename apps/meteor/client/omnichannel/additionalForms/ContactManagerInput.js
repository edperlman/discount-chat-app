"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const AutoCompleteAgent_1 = __importDefault(require("../../components/AutoCompleteAgent"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const ContactManagerInput = ({ value: userId, onChange }) => {
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (!hasLicense) {
        return null;
    }
    const handleChange = (currentValue) => {
        if (currentValue === 'no-agent-selected') {
            return onChange('');
        }
        onChange(currentValue);
    };
    return (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { haveNoAgentsSelectedOption: true, value: userId, onChange: handleChange });
};
exports.default = ContactManagerInput;
