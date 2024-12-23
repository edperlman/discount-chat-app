"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const AutoCompleteTagsMultiple_1 = __importDefault(require("../tags/AutoCompleteTagsMultiple"));
const CurrentChatTags = ({ value, handler, department, viewAll }) => {
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (!hasLicense) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(AutoCompleteTagsMultiple_1.default, { onChange: handler, value: value, department: department, viewAll: viewAll });
};
exports.default = CurrentChatTags;
