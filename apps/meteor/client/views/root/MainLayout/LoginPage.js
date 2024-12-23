"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const web_ui_registration_1 = __importDefault(require("@rocket.chat/web-ui-registration"));
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useIframeLogin_1 = require("./useIframeLogin");
const LoggedOutBanner_1 = __importDefault(require("../../../components/deviceManagement/LoggedOutBanner"));
const LoginPage = ({ defaultRoute, children }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const showForcedLogoutBanner = (0, ui_contexts_1.useSession)('force_logout');
    const iframeLoginUrl = (0, useIframeLogin_1.useIframeLogin)();
    if (iframeLoginUrl) {
        return (0, jsx_runtime_1.jsx)("iframe", { title: t('Login'), src: iframeLoginUrl, style: { height: '100%', width: '100%' } });
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showForcedLogoutBanner && (0, jsx_runtime_1.jsx)(LoggedOutBanner_1.default, {}), (0, jsx_runtime_1.jsx)(web_ui_registration_1.default, { defaultRoute: defaultRoute, children: children })] }));
};
exports.default = LoginPage;
