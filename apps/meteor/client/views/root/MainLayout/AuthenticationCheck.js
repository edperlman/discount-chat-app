"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const web_ui_registration_1 = __importDefault(require("@rocket.chat/web-ui-registration"));
const react_1 = __importDefault(require("react"));
const LoginPage_1 = __importDefault(require("./LoginPage"));
const UsernameCheck_1 = __importDefault(require("./UsernameCheck"));
/*
 * Anonymous and guest are similar in some way
 *
 * Anonymous is an old feature that allows the user to navigate as an anonymus user
 * by default the user dont need to do anything its hadled by the system but by behind the scenes a new    * user is registered
 *
 * Guest is only for certain locations, it shows a form asking if the user wants to stay as guest and if so
 * renders the page, without creating an user (not even an anonymous user)
 */
const AuthenticationCheck = ({ children, guest }) => {
    const uid = (0, ui_contexts_1.useUserId)();
    const allowAnonymousRead = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead');
    const forceLogin = (0, ui_contexts_1.useSession)('forceLogin');
    if (uid) {
        return (0, jsx_runtime_1.jsx)(UsernameCheck_1.default, { children: children });
    }
    if (!forceLogin && guest) {
        return (0, jsx_runtime_1.jsx)(web_ui_registration_1.default, { defaultRoute: 'guest', children: children });
    }
    if (!forceLogin && allowAnonymousRead) {
        return (0, jsx_runtime_1.jsx)(UsernameCheck_1.default, { children: children });
    }
    return (0, jsx_runtime_1.jsx)(LoginPage_1.default, {});
};
exports.default = AuthenticationCheck;
