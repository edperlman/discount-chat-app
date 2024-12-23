"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const PlainSpan_1 = __importDefault(require("../elements/PlainSpan"));
const HeadingBlock = ({ children = [], level = 1 }) => {
    const HeadingTag = `h${level}`;
    return ((0, jsx_runtime_1.jsx)(HeadingTag, { children: children.map((block, index) => ((0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: block.value }, index))) }));
};
exports.default = HeadingBlock;
