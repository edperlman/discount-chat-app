"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Header_1 = require("../../../components/Header");
const HeaderSkeleton = () => {
    return ((0, jsx_runtime_1.jsxs)(Header_1.Header, { children: [(0, jsx_runtime_1.jsx)(Header_1.HeaderAvatar, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: 36, height: 36 }) }), (0, jsx_runtime_1.jsxs)(Header_1.HeaderContent, { children: [(0, jsx_runtime_1.jsx)(Header_1.HeaderContentRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '10%' }) }), (0, jsx_runtime_1.jsx)(Header_1.HeaderContentRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '30%' }) })] })] }));
};
exports.default = HeaderSkeleton;
