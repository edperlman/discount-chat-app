"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const PasswordFieldSkeleton = () => ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 65, h: 20 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 232, h: 26 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 20, h: 20, variant: 'circle' })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 105, h: 26 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 20, h: 20, variant: 'circle' })] })] }));
exports.default = PasswordFieldSkeleton;
