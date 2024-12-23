"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AppDetailsPageLoading = () => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mbe: 20, w: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', w: 'x120', h: 'x120', mie: 32 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', w: 'full', h: 'x32' }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', w: 'full', h: 'x32' }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', w: 'full', h: 'x32' })] })] }));
exports.default = AppDetailsPageLoading;
