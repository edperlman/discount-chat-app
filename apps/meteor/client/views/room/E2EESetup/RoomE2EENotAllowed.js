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
const DOCS_URL = 'https://go.rocket.chat/i/e2ee-guide';
const RoomE2EENotAllowed = ({ title, subTitle, action, btnText, icon }) => {
    const router = (0, ui_contexts_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleGoHomeClick = () => {
        router.navigate('/home');
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', height: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: icon, variation: 'primary' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: title }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: subTitle }), action && ((0, jsx_runtime_1.jsxs)(fuselage_1.StatesActions, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, role: 'link', onClick: handleGoHomeClick, children: t('Back_to_home') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { primary: true, onClick: action, role: 'button', children: btnText })] })), (0, jsx_runtime_1.jsx)(fuselage_1.StatesLink, { target: '_blank', href: DOCS_URL, children: t('Learn_more_about_E2EE') })] }) }));
};
exports.default = RoomE2EENotAllowed;
