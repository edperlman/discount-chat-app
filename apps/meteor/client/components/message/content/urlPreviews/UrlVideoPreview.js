"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const style = { maxWidth: '100%' };
const UrlVideoPreview = ({ url, originalType }) => ((0, jsx_runtime_1.jsxs)("video", { controls: true, style: style, children: [(0, jsx_runtime_1.jsx)("source", { src: url, type: originalType }), "Your browser doesn't support the video element.", (0, jsx_runtime_1.jsx)("track", { kind: 'captions' })] }));
exports.default = UrlVideoPreview;
