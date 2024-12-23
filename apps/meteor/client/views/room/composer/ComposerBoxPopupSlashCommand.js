"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
function ComposerBoxPopupSlashCommand({ _id, description, params, disabled }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.OptionContent, { children: [_id, " ", (0, jsx_runtime_1.jsx)(fuselage_1.OptionDescription, { children: params })] }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: (0, jsx_runtime_1.jsx)(fuselage_1.OptionInput, { children: disabled ? t('Unavailable_in_encrypted_channels') : description }) })] }));
}
exports.default = ComposerBoxPopupSlashCommand;
