"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PreviewCodeBlock_1 = __importDefault(require("./code/PreviewCodeBlock"));
const PreviewInlineElements_1 = __importDefault(require("./elements/PreviewInlineElements"));
const PreviewBigEmojiBlock_1 = __importDefault(require("./emoji/PreviewBigEmojiBlock"));
const KatexErrorBoundary_1 = __importDefault(require("./katex/KatexErrorBoundary"));
const PreviewKatexBlock_1 = __importDefault(require("./katex/PreviewKatexBlock"));
const isOnlyBigEmojiBlock = (tokens) => tokens.length === 1 && tokens[0].type === 'BIG_EMOJI';
const PreviewMarkup = ({ tokens }) => {
    if (isOnlyBigEmojiBlock(tokens)) {
        return (0, jsx_runtime_1.jsx)(PreviewBigEmojiBlock_1.default, { emoji: tokens[0].value });
    }
    const firstBlock = tokens.find((block) => block.type !== 'LINE_BREAK');
    if (!firstBlock) {
        return null;
    }
    switch (firstBlock.type) {
        case 'PARAGRAPH':
            return (0, jsx_runtime_1.jsx)(PreviewInlineElements_1.default, { children: firstBlock.value });
        case 'HEADING':
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: firstBlock.value.map((plain) => plain.value).join('') });
        case 'UNORDERED_LIST':
        case 'ORDERED_LIST': {
            const firstItem = firstBlock.value[0];
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [firstItem.number ? `${firstItem.number}.` : '-', " ", (0, jsx_runtime_1.jsx)(PreviewInlineElements_1.default, { children: firstItem.value })] }));
        }
        case 'TASKS': {
            const firstTask = firstBlock.value[0];
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [firstTask.status ? '\u2611' : '\u2610', " ", (0, jsx_runtime_1.jsx)(PreviewInlineElements_1.default, { children: firstTask.value })] }));
        }
        case 'QUOTE': {
            const firstParagraph = firstBlock.value[0];
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["> ", (0, jsx_runtime_1.jsx)(PreviewInlineElements_1.default, { children: firstParagraph.value })] }));
        }
        case 'CODE': {
            return (0, jsx_runtime_1.jsx)(PreviewCodeBlock_1.default, { language: firstBlock.language, lines: firstBlock.value });
        }
        case 'KATEX':
            return ((0, jsx_runtime_1.jsx)(KatexErrorBoundary_1.default, { code: firstBlock.value, children: (0, jsx_runtime_1.jsx)(PreviewKatexBlock_1.default, { code: firstBlock.value }) }));
        default:
            return null;
    }
};
exports.default = (0, react_1.memo)(PreviewMarkup);
