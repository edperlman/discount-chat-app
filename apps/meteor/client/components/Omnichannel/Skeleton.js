"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSkeleton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const FormSkeleton = (props) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, Object.assign({ w: 'full', pb: 24 }, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 })] })));
exports.FormSkeleton = FormSkeleton;