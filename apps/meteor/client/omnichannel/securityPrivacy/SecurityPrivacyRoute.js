"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const SecurityPrivacyPage_1 = __importDefault(require("./SecurityPrivacyPage"));
const SettingsProvider_1 = __importDefault(require("../../providers/SettingsProvider"));
const EditableSettingsProvider_1 = __importDefault(require("../../views/admin/settings/EditableSettingsProvider"));
const SecurityPrivacyRoute = () => {
    return ((0, jsx_runtime_1.jsx)(SettingsProvider_1.default, { privileged: true, children: (0, jsx_runtime_1.jsx)(EditableSettingsProvider_1.default, { children: (0, jsx_runtime_1.jsx)(SecurityPrivacyPage_1.default, {}) }) }));
};
exports.default = SecurityPrivacyRoute;
