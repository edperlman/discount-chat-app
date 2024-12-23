"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const AccountSecurityPage_1 = __importDefault(require("./AccountSecurityPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const AccountSecurityRoute = () => {
    const isTwoFactorEnabled = (0, ui_contexts_1.useSetting)('Accounts_TwoFactorAuthentication_Enabled');
    const isE2EEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable');
    const allowPasswordChange = (0, ui_contexts_1.useSetting)('Accounts_AllowPasswordChange');
    const canViewSecurity = isTwoFactorEnabled || isE2EEnabled || allowPasswordChange;
    if (!canViewSecurity) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(AccountSecurityPage_1.default, {});
};
exports.default = AccountSecurityRoute;
