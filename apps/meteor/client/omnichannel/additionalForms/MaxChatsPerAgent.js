"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const MaxChatsPerAgent = ({ className }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control } = (0, react_hook_form_1.useFormContext)();
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const maxChatsField = (0, fuselage_hooks_1.useUniqueId)();
    if (!hasLicense) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { className: className, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: maxChatsField, children: t('Max_number_of_chats_per_agent') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'maxNumberSimultaneousChat', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ id: maxChatsField }, field)) }) })] }));
};
exports.default = MaxChatsPerAgent;
