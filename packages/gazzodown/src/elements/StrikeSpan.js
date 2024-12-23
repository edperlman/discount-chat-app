"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const BoldSpan_1 = __importDefault(require("./BoldSpan"));
const ItalicSpan_1 = __importDefault(require("./ItalicSpan"));
const LinkSpan_1 = __importDefault(require("./LinkSpan"));
const PlainSpan_1 = __importDefault(require("./PlainSpan"));
const CodeElement_1 = __importDefault(require("../code/CodeElement"));
const EmojiElement_1 = __importDefault(require("../emoji/EmojiElement"));
const ChannelMentionElement_1 = __importDefault(require("../mentions/ChannelMentionElement"));
const UserMentionElement_1 = __importDefault(require("../mentions/UserMentionElement"));
const StrikeSpan = ({ children }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children.map((block, index) => {
        if (block.type === 'LINK' ||
            block.type === 'PLAIN_TEXT' ||
            block.type === 'ITALIC' ||
            block.type === 'BOLD' ||
            block.type === 'INLINE_CODE') {
            return (0, jsx_runtime_1.jsx)("del", { children: renderBlockComponent(block, index) }, index);
        }
        return renderBlockComponent(block, index);
    }) }));
const renderBlockComponent = (block, index) => {
    switch (block.type) {
        case 'EMOJI':
            return (0, jsx_runtime_1.jsx)(EmojiElement_1.default, Object.assign({}, block), index);
        case 'MENTION_USER':
            return (0, jsx_runtime_1.jsx)(UserMentionElement_1.default, { mention: block.value.value }, index);
        case 'MENTION_CHANNEL':
            return (0, jsx_runtime_1.jsx)(ChannelMentionElement_1.default, { mention: block.value.value }, index);
        case 'PLAIN_TEXT':
            return (0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: block.value }, index);
        case 'LINK':
            return (0, jsx_runtime_1.jsx)(LinkSpan_1.default, { href: block.value.src.value, label: block.value.label }, index);
        case 'ITALIC':
            return (0, jsx_runtime_1.jsx)(ItalicSpan_1.default, { children: block.value }, index);
        case 'BOLD':
            return (0, jsx_runtime_1.jsx)(BoldSpan_1.default, { children: block.value }, index);
        case 'INLINE_CODE':
            return (0, jsx_runtime_1.jsx)(CodeElement_1.default, { code: block.value.value }, index);
        default:
            return null;
    }
};
exports.default = StrikeSpan;
