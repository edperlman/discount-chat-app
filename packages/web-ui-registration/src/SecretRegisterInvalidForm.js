"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const VerticalTemplate_1 = __importDefault(require("./template/VerticalTemplate"));
const SecretRegisterInvalidForm = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(VerticalTemplate_1.default, { children: (0, jsx_runtime_1.jsx)("h2", { children: t('Invalid_secret_URL_message') }) }));
};
exports.default = SecretRegisterInvalidForm;
