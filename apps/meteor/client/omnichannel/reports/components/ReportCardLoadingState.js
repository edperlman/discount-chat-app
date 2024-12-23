"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCardLoadingState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ReportCardLoadingState = () => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', height: '100%', width: '100%', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 1, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { style: { transform: 'none' }, height: '100%', mb: 8, mie: 16 }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28 })] })] }));
exports.ReportCardLoadingState = ReportCardLoadingState;
