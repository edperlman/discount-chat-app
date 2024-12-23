"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const LoadingIndicator = ({ variation }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'loading__animation', children: [(0, jsx_runtime_1.jsx)("div", { className: ['loading__animation__bounce', variation && `loading__animation__bounce--${variation}`].filter(Boolean).join(' ') }), (0, jsx_runtime_1.jsx)("div", { className: ['loading__animation__bounce', variation && `loading__animation__bounce--${variation}`].filter(Boolean).join(' ') }), (0, jsx_runtime_1.jsx)("div", { className: ['loading__animation__bounce', variation && `loading__animation__bounce--${variation}`].filter(Boolean).join(' ') })] }));
};
exports.default = LoadingIndicator;
