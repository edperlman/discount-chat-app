"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageText = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const compat_1 = require("preact/compat");
const createClassName_1 = require("../../../helpers/createClassName");
const isBigEmoji_1 = __importDefault(require("../../../lib/emoji/isBigEmoji"));
const shortnameToUnicode_1 = __importDefault(require("../../../lib/emoji/shortnameToUnicode"));
const MarkdownBlock_1 = __importDefault(require("../../MarkdownBlock"));
const styles_scss_1 = __importDefault(require("./styles.scss"));
exports.MessageText = (0, compat_1.memo)(({ text, system, className, style = {} }) => {
    const bigEmoji = (0, isBigEmoji_1.default)(text);
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'message-text', { system, bigEmoji }, [className]), style: style, children: (0, jsx_runtime_1.jsx)(MarkdownBlock_1.default, { text: (0, shortnameToUnicode_1.default)(text), emoticons: true }) }));
});
