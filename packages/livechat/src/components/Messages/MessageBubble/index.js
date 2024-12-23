"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBubble = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const createClassName_1 = require("../../../helpers/createClassName");
const styles_scss_1 = __importDefault(require("./styles.scss"));
exports.MessageBubble = (0, compat_1.memo)(({ inverse, nude, quoted, className, style = {}, children, system = false }) => ((0, jsx_runtime_1.jsx)("div", { "data-qa": 'message-bubble', className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-bubble', { inverse, nude, quoted, system }, [className]), style: style, children: (0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-bubble__inner'), children: children }) })));
