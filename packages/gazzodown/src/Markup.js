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
const HeadingBlock_1 = __importDefault(require("./blocks/HeadingBlock"));
const OrderedListBlock_1 = __importDefault(require("./blocks/OrderedListBlock"));
const ParagraphBlock_1 = __importDefault(require("./blocks/ParagraphBlock"));
const QuoteBlock_1 = __importDefault(require("./blocks/QuoteBlock"));
const TaskListBlock_1 = __importDefault(require("./blocks/TaskListBlock"));
const UnorderedListBlock_1 = __importDefault(require("./blocks/UnorderedListBlock"));
const BigEmojiBlock_1 = __importDefault(require("./emoji/BigEmojiBlock"));
const KatexErrorBoundary_1 = __importDefault(require("./katex/KatexErrorBoundary"));
const CodeBlock = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./code/CodeBlock'))));
const KatexBlock = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./katex/KatexBlock'))));
const Markup = ({ tokens }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: tokens.map((block, index) => {
        switch (block.type) {
            case 'BIG_EMOJI':
                return (0, jsx_runtime_1.jsx)(BigEmojiBlock_1.default, { emoji: block.value }, index);
            case 'PARAGRAPH':
                return (0, jsx_runtime_1.jsx)(ParagraphBlock_1.default, { children: block.value }, index);
            case 'HEADING':
                return (0, jsx_runtime_1.jsx)(HeadingBlock_1.default, { level: block.level, children: block.value }, index);
            case 'UNORDERED_LIST':
                return (0, jsx_runtime_1.jsx)(UnorderedListBlock_1.default, { items: block.value }, index);
            case 'ORDERED_LIST':
                return (0, jsx_runtime_1.jsx)(OrderedListBlock_1.default, { items: block.value }, index);
            case 'TASKS':
                return (0, jsx_runtime_1.jsx)(TaskListBlock_1.default, { tasks: block.value }, index);
            case 'QUOTE':
                return (0, jsx_runtime_1.jsx)(QuoteBlock_1.default, { children: block.value }, index);
            case 'CODE':
                return (0, jsx_runtime_1.jsx)(CodeBlock, { language: block.language, lines: block.value }, index);
            case 'KATEX':
                return ((0, jsx_runtime_1.jsx)(KatexErrorBoundary_1.default, { code: block.value, children: (0, jsx_runtime_1.jsx)(KatexBlock, { code: block.value }) }, index));
            case 'LINE_BREAK':
                return (0, jsx_runtime_1.jsx)("br", {}, index);
            default:
                return null;
        }
    }) }));
exports.default = (0, react_1.memo)(Markup);
