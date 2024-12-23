"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ParagraphBlock_1 = __importDefault(require("./ParagraphBlock"));
const QuoteBlock = ({ children }) => ((0, jsx_runtime_1.jsx)("blockquote", { children: children.map((paragraph, index) => ((0, jsx_runtime_1.jsx)(ParagraphBlock_1.default, { children: paragraph.value }, index))) }));
exports.default = QuoteBlock;
