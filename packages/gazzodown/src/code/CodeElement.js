"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const PlainSpan_1 = __importDefault(require("../elements/PlainSpan"));
const CodeElement = ({ code }) => ((0, jsx_runtime_1.jsx)("code", { className: 'code-colors inline', children: (0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: code }) }));
exports.default = CodeElement;
