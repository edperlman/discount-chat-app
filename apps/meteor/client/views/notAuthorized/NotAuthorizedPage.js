"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Page_1 = require("../../components/Page");
const NotAuthorizedPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { children: (0, jsx_runtime_1.jsx)(Page_1.PageContent, { pb: 24, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontScale: 'p2', color: 'default', children: t('You_are_not_authorized_to_view_this_page') }) }) }));
};
exports.default = NotAuthorizedPage;
