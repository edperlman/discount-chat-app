"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const PlanCardHeader_1 = __importDefault(require("./PlanCardHeader"));
const PlanCardCommunity = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { height: 'full', children: [(0, jsx_runtime_1.jsx)(PlanCardHeader_1.default, { name: t('Community') }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardBody, { flexDirection: 'column', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'card', size: 24, mie: 12 }), " ", t('free_per_month_user')] }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'cloud-plus', size: 24, mie: 12 }), " ", t('Self_managed_hosting')] })] })] }));
};
exports.default = PlanCardCommunity;
