"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const OverviewSection_1 = __importDefault(require("./OverviewSection"));
const ServersSection_1 = __importDefault(require("./ServersSection"));
const Page_1 = require("../../../components/Page");
function FederationDashboardPage() {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Federation') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { margin: 24, children: [(0, jsx_runtime_1.jsx)(OverviewSection_1.default, {}), (0, jsx_runtime_1.jsx)(ServersSection_1.default, {})] }) })] }));
}
exports.default = FederationDashboardPage;
