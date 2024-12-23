"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCardSkeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const VersionCardSkeleton = () => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28, width: 160 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 28, width: 150 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', width: 160, height: 28, alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 38, width: 28, mie: 12 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 20, width: 120 })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', width: 180, height: 28, alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 38, width: 28, mie: 12 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 20, width: 140 })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', width: 160, height: 28, alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 38, width: 28, mie: 12 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 20, width: 120 })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { height: 50, width: 160 })] }));
};
exports.VersionCardSkeleton = VersionCardSkeleton;
