"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const PreviewEmojiElement_1 = __importDefault(require("./PreviewEmojiElement"));
const PreviewBigEmojiBlock = ({ emoji }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: emoji.map((emoji, index) => ((0, jsx_runtime_1.jsx)(PreviewEmojiElement_1.default, Object.assign({}, emoji), index))) }));
exports.default = PreviewBigEmojiBlock;
