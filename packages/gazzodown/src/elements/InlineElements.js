"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const BoldSpan_1 = __importDefault(require("./BoldSpan"));
const ImageElement_1 = __importDefault(require("./ImageElement"));
const ItalicSpan_1 = __importDefault(require("./ItalicSpan"));
const LinkSpan_1 = __importDefault(require("./LinkSpan"));
const PlainSpan_1 = __importDefault(require("./PlainSpan"));
const StrikeSpan_1 = __importDefault(require("./StrikeSpan"));
const Timestamp_1 = __importDefault(require("./Timestamp"));
const CodeElement_1 = __importDefault(require("../code/CodeElement"));
const ColorElement_1 = __importDefault(require("../colors/ColorElement"));
const EmojiElement_1 = __importDefault(require("../emoji/EmojiElement"));
const KatexErrorBoundary_1 = __importDefault(require("../katex/KatexErrorBoundary"));
const ChannelMentionElement_1 = __importDefault(require("../mentions/ChannelMentionElement"));
const UserMentionElement_1 = __importDefault(require("../mentions/UserMentionElement"));
const KatexElement = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../katex/KatexElement'))));
const InlineElements = ({ children }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children.map((child, index) => {
        switch (child.type) {
            case 'BOLD':
                return (0, jsx_runtime_1.jsx)(BoldSpan_1.default, { children: child.value }, index);
            case 'STRIKE':
                return (0, jsx_runtime_1.jsx)(StrikeSpan_1.default, { children: child.value }, index);
            case 'ITALIC':
                return (0, jsx_runtime_1.jsx)(ItalicSpan_1.default, { children: child.value }, index);
            case 'LINK':
                return ((0, jsx_runtime_1.jsx)(LinkSpan_1.default, { href: child.value.src.value, label: Array.isArray(child.value.label) ? child.value.label : [child.value.label] }, index));
            case 'PLAIN_TEXT':
                return (0, jsx_runtime_1.jsx)(PlainSpan_1.default, { text: child.value }, index);
            case 'IMAGE':
                return (0, jsx_runtime_1.jsx)(ImageElement_1.default, { src: child.value.src.value, alt: child.value.label }, index);
            case 'MENTION_USER':
                return (0, jsx_runtime_1.jsx)(UserMentionElement_1.default, { mention: child.value.value }, index);
            case 'MENTION_CHANNEL':
                return (0, jsx_runtime_1.jsx)(ChannelMentionElement_1.default, { mention: child.value.value }, index);
            case 'INLINE_CODE':
                return (0, jsx_runtime_1.jsx)(CodeElement_1.default, { code: child.value.value }, index);
            case 'EMOJI':
                return (0, jsx_runtime_1.jsx)(EmojiElement_1.default, Object.assign({}, child), index);
            case 'COLOR':
                return (0, jsx_runtime_1.jsx)(ColorElement_1.default, Object.assign({}, child.value), index);
            case 'INLINE_KATEX':
                return ((0, jsx_runtime_1.jsx)(KatexErrorBoundary_1.default, { code: child.value, children: (0, jsx_runtime_1.jsx)(KatexElement, { code: child.value }) }, index));
            case 'TIMESTAMP': {
                return (0, jsx_runtime_1.jsx)(Timestamp_1.default, { children: child }, index);
            }
            default: {
                if ('fallback' in child) {
                    return (0, jsx_runtime_1.jsx)(InlineElements, { children: [child.fallback] }, index);
                }
                return null;
            }
        }
    }) }));
exports.default = InlineElements;
