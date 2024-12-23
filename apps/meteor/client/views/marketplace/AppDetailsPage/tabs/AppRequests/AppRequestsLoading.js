"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const AppRequestsLoading = () => {
    const appRequestsLoading = Array.from({ length: 5 }, (_, i) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', pb: 12, pie: 24, mbe: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'section', mie: 8, mbs: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', h: 'full', children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 'x36', width: 'x36' }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'section', display: 'flex', flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', mbe: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 'x16', width: 'x215' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 'x60', width: 'x516' })] })] }, i)));
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: appRequestsLoading });
};
exports.default = AppRequestsLoading;
