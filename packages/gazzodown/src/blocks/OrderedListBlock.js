"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const InlineElements_1 = __importDefault(require("../elements/InlineElements"));
const OrderedListBlock = ({ items }) => ((0, jsx_runtime_1.jsx)("ol", { children: items.map(({ value, number }, index) => ((0, jsx_runtime_1.jsx)("li", { value: number, children: (0, jsx_runtime_1.jsx)(InlineElements_1.default, { children: value }) }, index))) }));
exports.default = OrderedListBlock;
