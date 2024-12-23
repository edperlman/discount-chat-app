"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Emoji_1 = __importDefault(require("./Emoji"));
const PreviewEmojiElement = (emoji) => (0, jsx_runtime_1.jsx)(Emoji_1.default, Object.assign({ preview: true }, emoji));
exports.default = PreviewEmojiElement;
