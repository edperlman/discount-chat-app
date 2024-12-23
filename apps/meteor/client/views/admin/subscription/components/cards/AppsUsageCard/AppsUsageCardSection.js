"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const AppsUsageCardSection = ({ title, tip, appsCount, appsMaxCount, warningThreshold }) => {
    const percentage = appsMaxCount === 0 ? 100 : Math.round((appsCount * 100) / appsMaxCount);
    const warningThresholdCrossed = percentage >= warningThreshold;
    const labelId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'c1', mb: 12, title: tip, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexGrow: '1', justifyContent: 'space-between', mbe: 4, children: [(0, jsx_runtime_1.jsx)("div", { id: labelId, children: title }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: warningThresholdCrossed ? 'status-font-on-danger' : 'status-font-on-success', children: [appsCount, " / ", appsMaxCount] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.ProgressBar, { percentage: percentage, variant: warningThresholdCrossed ? 'danger' : 'success', role: 'progressbar', "aria-labelledby": labelId, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percentage })] }));
};
exports.default = AppsUsageCardSection;
