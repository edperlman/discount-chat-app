"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AddonChip = ({ app }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!app.addon) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'secondary', title: t('Requires_subscription_add-on'), children: t('Add-on') }));
};
exports.default = AddonChip;
