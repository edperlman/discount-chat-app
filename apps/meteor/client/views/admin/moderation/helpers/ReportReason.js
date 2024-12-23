"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const useFormatDate_1 = require("../../../../hooks/useFormatDate");
const ReportReason = ({ ind, uinfo, msg, ts }) => {
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBlock: 10, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Tag, { variant: 'danger', children: ["Report #", ind] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { wordBreak: 'break-word', marginBlock: 5, fontSize: 'p2b', children: msg }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontWeight: '700', color: 'font-info', fontSize: 'micro', children: ["@", uinfo || 'rocket.cat'] }), ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontWeight: '700', color: 'font-annotation', fontSize: 'micro', children: formatDate(ts) })] })] }));
};
exports.default = ReportReason;
