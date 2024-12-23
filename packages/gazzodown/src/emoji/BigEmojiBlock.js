"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const BigEmojiElement_1 = __importDefault(require("./BigEmojiElement"));
const BigEmojiBlock = ({ emoji }) => ((0, jsx_runtime_1.jsx)("div", { role: 'presentation', children: emoji.map((emoji, index) => ((0, jsx_runtime_1.jsx)(BigEmojiElement_1.default, Object.assign({}, emoji), index))) }));
exports.default = BigEmojiBlock;
