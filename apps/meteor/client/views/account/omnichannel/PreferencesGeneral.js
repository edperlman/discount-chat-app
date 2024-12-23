"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesGeneral = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const PreferencesGeneral = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register } = (0, react_hook_form_1.useFormContext)();
    const omnichannelHideAfterClosing = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { marginBlockEnd: '1.5rem', paddingInline: '0.5rem', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: omnichannelHideAfterClosing, children: t('Omnichannel_hide_conversation_after_closing') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: omnichannelHideAfterClosing }, register('omnichannelHideConversationAfterClosing')))] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Omnichannel_hide_conversation_after_closing_description') })] }) }));
};
exports.PreferencesGeneral = PreferencesGeneral;
