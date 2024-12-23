"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const web_ui_registration_1 = __importDefault(require("@rocket.chat/web-ui-registration"));
const react_1 = __importDefault(require("react"));
const errorHandling_1 = require("../../lib/errorHandling");
const PageLoading_1 = __importDefault(require("../root/PageLoading"));
const AuthorizationFormPage_1 = __importDefault(require("./components/AuthorizationFormPage"));
const ErrorPage_1 = __importDefault(require("./components/ErrorPage"));
const useOAuthAppQuery_1 = require("./hooks/useOAuthAppQuery");
const OAuthAuthorizationPage = () => {
    const user = (0, ui_contexts_1.useUser)();
    const clientId = (0, ui_contexts_1.useSearchParameter)('client_id');
    const redirectUri = (0, ui_contexts_1.useSearchParameter)('redirect_uri');
    const oauthAppQuery = (0, useOAuthAppQuery_1.useOAuthAppQuery)(clientId, {
        enabled: !!user,
    });
    if (!user) {
        return (0, jsx_runtime_1.jsx)(web_ui_registration_1.default, {});
    }
    if (oauthAppQuery.isLoading) {
        return (0, jsx_runtime_1.jsx)(PageLoading_1.default, {});
    }
    if (oauthAppQuery.isError) {
        return (0, jsx_runtime_1.jsx)(ErrorPage_1.default, { error: (0, errorHandling_1.getErrorMessage)(oauthAppQuery.error) });
    }
    return (0, jsx_runtime_1.jsx)(AuthorizationFormPage_1.default, { oauthApp: oauthAppQuery.data, redirectUri: redirectUri !== null && redirectUri !== void 0 ? redirectUri : '', user: user });
};
exports.default = OAuthAuthorizationPage;
