"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Login = (props) => {
    const setForceLogin = (0, ui_contexts_1.useSessionDispatch)('forceLogin');
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Sidebar.TopBar.Action, Object.assign({}, props, { primary: true, icon: 'login', title: t('Sign_in_to_start_talking'), onClick: () => setForceLogin(true) })));
};
exports.default = Login;
