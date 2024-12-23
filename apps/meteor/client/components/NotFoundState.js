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
const NotFoundState = ({ title, subtitle }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const handleGoHomeClick = () => {
        router.navigate('/home');
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', height: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'magnifier' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: title }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: subtitle }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: handleGoHomeClick, children: t('Homepage') }) }) })] }) }));
};
exports.default = NotFoundState;
