"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const accounts_base_1 = require("meteor/accounts-base");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const CurrentUserDisplay_1 = __importDefault(require("./CurrentUserDisplay"));
const Layout_1 = __importDefault(require("./Layout"));
const queueMicrotask_1 = require("../../../lib/utils/queueMicrotask");
const AuthorizationFormPage = ({ oauthApp, redirectUri, user }) => {
    var _a, _b;
    const token = (0, react_1.useMemo)(() => { var _a; return (_a = accounts_base_1.Accounts.storageLocation.getItem(accounts_base_1.Accounts.LOGIN_TOKEN_KEY)) !== null && _a !== void 0 ? _a : undefined; }, []);
    const formLabelId = (0, fuselage_hooks_1.useUniqueId)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const homeRoute = (0, ui_contexts_1.useRoute)('home');
    const handleCancelButtonClick = () => {
        (0, queueMicrotask_1.queueMicrotask)(() => {
            homeRoute.push();
        });
        window.close();
    };
    const logout = (0, ui_contexts_1.useLogout)();
    const handleLogoutButtonClick = () => {
        logout();
    };
    const submitRef = (0, react_1.useRef)(null);
    const hasAuthorized = (_b = (_a = user.oauth) === null || _a === void 0 ? void 0 : _a.authorizedClients) === null || _b === void 0 ? void 0 : _b.includes(oauthApp.clientId);
    (0, react_1.useEffect)(() => {
        var _a;
        if (hasAuthorized) {
            (_a = submitRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
    }, [oauthApp.clientId, hasAuthorized]);
    return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsxs)(layout_1.Form, { method: 'post', action: '', "aria-labelledby": formLabelId, children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { id: formLabelId, children: t('core.Authorize_access_to_your_account') }) }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Container, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withRichContent: true, children: [(0, jsx_runtime_1.jsx)(CurrentUserDisplay_1.default, { user: user }), (0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'core.OAuth_Full_Access_Warning', t: t, children: (0, jsx_runtime_1.jsx)("strong", { children: { appName: oauthApp.name } }) }) })] }), (0, jsx_runtime_1.jsx)("input", { type: 'hidden', name: 'access_token', value: token }), (0, jsx_runtime_1.jsx)("input", { type: 'hidden', name: 'client_id', value: oauthApp.clientId }), (0, jsx_runtime_1.jsx)("input", { type: 'hidden', name: 'redirect_uri', value: redirectUri }), (0, jsx_runtime_1.jsx)("input", { type: 'hidden', name: 'response_type', value: 'code' })] }), (0, jsx_runtime_1.jsx)(layout_1.Form.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { ref: submitRef, type: 'submit', primary: true, name: 'allow', value: 'yes', children: t('core.Authorize') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleCancelButtonClick, children: t('core.Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleLogoutButtonClick, children: t('core.Logout') })] }) })] }) }));
};
exports.default = AuthorizationFormPage;
