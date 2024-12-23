"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ComposerVoIP = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, jsx_runtime_1.jsx)(ui_composer_1.MessageFooterCallout, { children: t('Composer_not_available_phone_calls') });
};
exports.default = ComposerVoIP;
