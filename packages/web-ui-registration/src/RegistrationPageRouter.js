"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationPageRouter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const GuestForm_1 = __importDefault(require("./GuestForm"));
const LoginForm_1 = require("./LoginForm");
const RegisterSecretPageRouter_1 = __importDefault(require("./RegisterSecretPageRouter"));
const RegisterTemplate_1 = __importDefault(require("./RegisterTemplate"));
const ResetPasswordForm_1 = __importDefault(require("./ResetPasswordForm"));
const useLoginRouter_1 = require("./hooks/useLoginRouter");
const RegistrationPageRouter = ({ defaultRoute = 'login', children, }) => {
    const defaultRouteSession = (0, ui_contexts_1.useSession)('loginDefaultState');
    const [route, setLoginRoute] = (0, useLoginRouter_1.useLoginRouter)(defaultRouteSession || defaultRoute);
    if (route === 'guest') {
        return ((0, jsx_runtime_1.jsx)(RegisterTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(GuestForm_1.default, { setLoginRoute: setLoginRoute }) }));
    }
    if (route === 'login') {
        return ((0, jsx_runtime_1.jsx)(RegisterTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(LoginForm_1.LoginForm, { setLoginRoute: setLoginRoute }) }));
    }
    if (route === 'reset-password') {
        return ((0, jsx_runtime_1.jsx)(RegisterTemplate_1.default, { children: (0, jsx_runtime_1.jsx)(ResetPasswordForm_1.default, { setLoginRoute: setLoginRoute }) }));
    }
    if (route === 'secret-register' || route === 'register' || route === 'invite-register') {
        return (0, jsx_runtime_1.jsx)(RegisterSecretPageRouter_1.default, { origin: route, setLoginRoute: setLoginRoute });
    }
    if (route === 'anonymous') {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    return null;
};
exports.RegistrationPageRouter = RegistrationPageRouter;
exports.default = exports.RegistrationPageRouter;
