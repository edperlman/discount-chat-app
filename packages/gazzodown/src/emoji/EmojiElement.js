"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Emoji_1 = __importDefault(require("./Emoji"));
const EmojiElement = (emoji) => (0, jsx_runtime_1.jsx)(Emoji_1.default, Object.assign({}, emoji));
exports.default = (0, react_1.memo)(EmojiElement);
