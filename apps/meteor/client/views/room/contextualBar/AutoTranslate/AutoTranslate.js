"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const RoomContext_1 = require("../../contexts/RoomContext");
const AutoTranslate = ({ language, languages, handleSwitch, translateEnable, handleChangeLanguage, handleClose, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'language' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Auto_Translate') }), handleClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { pbs: 24, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [room.encrypted && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { title: t('Automatic_translation_not_available'), type: 'warning', children: t('Automatic_translation_not_available_info') })), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: 'automatic-translation', children: t('Automatic_Translation') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: 'automatic-translation', onChange: handleSwitch, defaultChecked: translateEnable, disabled: room.encrypted && !translateEnable })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: 'translate-to', children: t('Translate_to') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { verticalAlign: 'middle', children: (0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: 'language', value: language, disabled: !translateEnable, onChange: (value) => handleChangeLanguage(String(value)), options: languages }) })] })] }) })] }));
};
exports.default = AutoTranslate;
