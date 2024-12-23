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
const PreferencesUserPresenceSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register, control } = (0, react_hook_form_1.useFormContext)();
    const enableAutoAwayId = (0, fuselage_hooks_1.useUniqueId)();
    const idleTimeLimit = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('User_Presence'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enableAutoAwayId, children: t('Enable_Auto_Away') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'enableAutoAway', control: control, render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { ref: ref, id: enableAutoAwayId, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: idleTimeLimit, children: t('Idle_Time_Limit') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ id: idleTimeLimit }, register('idleTimeLimit'))) })] })] }) }));
};
exports.default = PreferencesUserPresenceSection;
