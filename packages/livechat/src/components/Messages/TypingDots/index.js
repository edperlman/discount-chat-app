"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingDots = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const TypingDots = ({ text, className, style = {} }) => ((0, jsx_runtime_1.jsxs)("div", { "aria-label": text, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'typing-dots', {}, [className]), style: style, children: [(0, jsx_runtime_1.jsx)("span", { class: (0, createClassName_1.createClassName)(styles_scss_1.default, 'typing-dots__dot') }), (0, jsx_runtime_1.jsx)("span", { class: (0, createClassName_1.createClassName)(styles_scss_1.default, 'typing-dots__dot') }), (0, jsx_runtime_1.jsx)("span", { class: (0, createClassName_1.createClassName)(styles_scss_1.default, 'typing-dots__dot') })] }));
exports.TypingDots = TypingDots;
