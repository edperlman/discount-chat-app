"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AppsPageContentSkeleton = () => {
    const loadingRows = Array.from({ length: 3 }, (_, i) => (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 'x56', mbe: 8, width: '100%', variant: 'rect' }, i));
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pi: 24, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 36, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 'x28', width: 'x150', mbe: 20, variant: 'rect' }), loadingRows] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 36, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 'x28', width: 'x150', mbe: 20, variant: 'rect' }), loadingRows] }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 'x28', width: 'x150', mbe: 20, variant: 'rect' }), loadingRows] }));
};
exports.default = AppsPageContentSkeleton;
