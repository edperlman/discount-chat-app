"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const NotFoundState_1 = __importDefault(require("../../components/NotFoundState"));
const NotFoundPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, jsx_runtime_1.jsx)(NotFoundState_1.default, { title: t('Page_not_found'), subtitle: t('Page_not_exist_or_not_permission') });
};
exports.default = NotFoundPage;
