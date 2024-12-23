"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const Page_1 = require("../../components/Page");
const ConferencePageError = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    const route = (0, ui_contexts_1.useRoute)('login');
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { background: 'tint', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Video_Conference') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Call_not_found') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Call_not_found_error') }), !user && ((0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => route.push(), children: t('Back_to_login') }) }))] }) })] }));
};
exports.default = ConferencePageError;
