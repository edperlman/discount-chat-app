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
const PreferencesHighlightsSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register } = (0, react_hook_form_1.useFormContext)();
    const highlightsId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Highlights'), children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: highlightsId, children: t('Highlights_List') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: highlightsId }, register('highlights'), { rows: 4 })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Highlights_How_To') })] }) }) }));
};
exports.default = PreferencesHighlightsSection;
