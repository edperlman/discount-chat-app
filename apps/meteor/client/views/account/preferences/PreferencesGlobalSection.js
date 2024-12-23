"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const PreferencesGlobalSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const userDontAskAgainList = (0, ui_contexts_1.useUserPreference)('dontAskAgainList') || [];
    const options = userDontAskAgainList.map(({ action, label }) => [action, label]);
    const { control } = (0, react_hook_form_1.useFormContext)();
    const dontAskAgainListId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Global'), children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: dontAskAgainListId, children: t('Dont_ask_me_again_list') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'dontAskAgainList', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.MultiSelect, { id: dontAskAgainListId, placeholder: t('Nothing_found'), value: value, onChange: onChange, options: options })) }) })] }) }) }));
};
exports.default = PreferencesGlobalSection;
