"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BoldSpan_1 = __importDefault(require("./BoldSpan"));
const ItalicSpan_1 = __importDefault(require("./ItalicSpan"));
const StrikeSpan_1 = __importDefault(require("./StrikeSpan"));
const PreviewCodeElement_1 = __importDefault(require("../code/PreviewCodeElement"));
const PreviewColorElement_1 = __importDefault(require("../colors/PreviewColorElement"));
const PreviewEmojiElement_1 = __importDefault(require("../emoji/PreviewEmojiElement"));
const KatexErrorBoundary_1 = __importDefault(require("../katex/KatexErrorBoundary"));
const PreviewKatexElement_1 = __importDefault(require("../katex/PreviewKatexElement"));
const PreviewChannelMentionElement_1 = __importDefault(require("../mentions/PreviewChannelMentionElement"));
const PreviewUserMentionElement_1 = __importDefault(require("../mentions/PreviewUserMentionElement"));
const PreviewInlineElements = ({ children }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children.map((child, index) => {
        switch (child.type) {
            case 'BOLD':
                return (0, jsx_runtime_1.jsx)(BoldSpan_1.default, { children: child.value }, index);
            case 'STRIKE':
                return (0, jsx_runtime_1.jsx)(StrikeSpan_1.default, { children: child.value }, index);
            case 'ITALIC':
                return (0, jsx_runtime_1.jsx)(ItalicSpan_1.default, { children: child.value }, index);
            case 'LINK':
                return ((0, jsx_runtime_1.jsx)(PreviewInlineElements, { children: Array.isArray(child.value.label) ? child.value.label : [child.value.label] }, index));
            case 'PLAIN_TEXT':
                return (0, jsx_runtime_1.jsx)(react_1.Fragment, { children: child.value }, index);
            case 'IMAGE':
                return (0, jsx_runtime_1.jsx)(PreviewInlineElements, { children: [child.value.label] }, index);
            case 'MENTION_USER':
                return (0, jsx_runtime_1.jsx)(PreviewUserMentionElement_1.default, { mention: child.value.value }, index);
            case 'MENTION_CHANNEL':
                return (0, jsx_runtime_1.jsx)(PreviewChannelMentionElement_1.default, { mention: child.value.value }, index);
            case 'INLINE_CODE':
                return (0, jsx_runtime_1.jsx)(PreviewCodeElement_1.default, { code: child.value.value }, index);
            case 'EMOJI':
                return (0, jsx_runtime_1.jsx)(PreviewEmojiElement_1.default, Object.assign({}, child), index);
            case 'COLOR':
                return (0, jsx_runtime_1.jsx)(PreviewColorElement_1.default, Object.assign({}, child.value), index);
            case 'INLINE_KATEX':
                return ((0, jsx_runtime_1.jsx)(KatexErrorBoundary_1.default, { code: child.value, children: (0, jsx_runtime_1.jsx)(PreviewKatexElement_1.default, { code: child.value }) }, index));
            default:
                return null;
        }
    }) }));
exports.default = PreviewInlineElements;
