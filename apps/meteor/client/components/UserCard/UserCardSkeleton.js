"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const UserCardDialog_1 = __importDefault(require("./UserCardDialog"));
const UserCardSkeleton = (props) => {
    return ((0, jsx_runtime_1.jsxs)(UserCardDialog_1.default, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { borderRadius: 'x4', width: 'x124', height: 'x124', variant: 'rect' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 0, display: 'flex', mbs: 12, alignItems: 'center', justifyContent: 'center', children: Array.from({ length: 3 }).map((_, i) => ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', height: 'x28', width: 'x28', borderRadius: 'x4', mi: 2 }, i))) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, mis: 16, width: '1px', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 4, withTruncatedText: true, display: 'flex', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }), Array.from({ length: 3 }).map((_, i) => ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { flexGrow: 1, mi: 2 }, i))), Array.from({ length: 2 }).map((_, i) => ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%' }, i)))] })] })));
};
exports.default = UserCardSkeleton;
