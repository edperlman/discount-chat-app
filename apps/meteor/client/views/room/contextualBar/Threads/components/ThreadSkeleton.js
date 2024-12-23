"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const ThreadSkeleton = () => {
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { p: 24, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '32px', height: '32px', variant: 'rect' }), " ", (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}), Array(5)
                .fill(5)
                .map((_, index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}, index)))] }));
};
exports.default = ThreadSkeleton;
