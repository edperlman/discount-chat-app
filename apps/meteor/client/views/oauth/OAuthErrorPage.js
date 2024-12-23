"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ErrorPage_1 = __importDefault(require("./components/ErrorPage"));
const OAuthErrorPage = () => {
    const errorType = (0, ui_contexts_1.useRouteParameter)('error');
    const { t } = (0, react_i18next_1.useTranslation)();
    switch (errorType) {
        case '404':
            return (0, jsx_runtime_1.jsx)(ErrorPage_1.default, { error: t('core.Invalid_OAuth_client') });
        case 'invalid_redirect_uri':
            return (0, jsx_runtime_1.jsx)(ErrorPage_1.default, { error: t('core.Redirect_URL_does_not_match') });
        default:
            return (0, jsx_runtime_1.jsx)(ErrorPage_1.default, { error: t('core.Error_something_went_wrong') });
    }
};
exports.default = OAuthErrorPage;
