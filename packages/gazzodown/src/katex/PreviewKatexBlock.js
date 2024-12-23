"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("katex/dist/katex.css");
const PreviewKatexBlock = ({ code }) => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: code });
exports.default = PreviewKatexBlock;
