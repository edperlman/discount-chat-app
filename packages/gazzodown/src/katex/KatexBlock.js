"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const katex_1 = __importDefault(require("katex"));
const react_1 = require("react");
require("katex/dist/katex.css");
const KatexBlock = ({ code }) => {
    const html = (0, react_1.useMemo)(() => katex_1.default.renderToString(code, {
        displayMode: true,
        macros: {
            '\\href': '\\@secondoftwo',
        },
        maxSize: 100,
    }), [code]);
    return (0, jsx_runtime_1.jsx)("div", { role: 'math', style: { overflowX: 'auto' }, "aria-label": code, dangerouslySetInnerHTML: { __html: html } });
};
exports.default = KatexBlock;
