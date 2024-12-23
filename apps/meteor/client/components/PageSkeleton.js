"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const Page_1 = require("./Page");
const PageSkeleton = () => ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x320', maxWidth: 'full' }), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'x80' }), disabled: true }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { marginBlock: 'none', marginInline: 'auto', width: 'full', maxWidth: 'x580', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'p', color: 'hint', fontScale: 'p2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '75%' })] }) }) })] }));
exports.default = PageSkeleton;
