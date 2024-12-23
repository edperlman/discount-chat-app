"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useFormatDate_1 = require("../../../hooks/useFormatDate");
const AuditFiltersDisplay = ({ users, room, startDate, endDate, filters }) => {
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'stretch', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: (users === null || users === void 0 ? void 0 : users.length) ? users.map((user) => `@${user}`).join(' : ') : `#${room}` }), startDate && endDate ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withTruncatedText: true, children: [formatDate(startDate), " ", t('Date_to'), " ", formatDate(endDate), " "] })) : null, filters ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, children: filters }) : null] }));
};
exports.default = AuditFiltersDisplay;
