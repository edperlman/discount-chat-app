"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const highlight_js_1 = __importDefault(require("highlight.js"));
const react_1 = require("react");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const CodeBlock = ({ lines = [], language }) => {
    const ref = (0, react_1.useRef)(null);
    const { highlightRegex } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const code = (0, react_1.useMemo)(() => lines.map((line) => line.value.value).join('\n'), [lines]);
    const content = (0, react_1.useMemo)(() => {
        var _a;
        const regex = highlightRegex === null || highlightRegex === void 0 ? void 0 : highlightRegex();
        if (regex) {
            const chunks = code.split(regex);
            const head = (_a = chunks.shift()) !== null && _a !== void 0 ? _a : '';
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: head }), chunks.map((chunk, i) => {
                        if (i % 2 === 0) {
                            return ((0, jsx_runtime_1.jsx)("mark", { className: 'highlight-text', children: chunk }, i));
                        }
                        return (0, jsx_runtime_1.jsx)(react_1.Fragment, { children: chunk }, i);
                    })] }));
        }
        return code;
    }, [code, highlightRegex]);
    (0, react_1.useLayoutEffect)(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        highlight_js_1.default.highlightElement(element);
        if (!element.classList.contains('hljs')) {
            element.classList.add('hljs');
        }
    }, [language, content]);
    return ((0, jsx_runtime_1.jsxs)("pre", { role: 'region', children: [(0, jsx_runtime_1.jsx)("span", { className: 'copyonly', children: "```" }), (0, jsx_runtime_1.jsx)("code", { ref: ref, className: ((!language || language === 'none') && 'code-colors') || `code-colors language-${language}`, children: content }, language + code), (0, jsx_runtime_1.jsx)("span", { className: 'copyonly', children: "```" })] }));
};
exports.default = CodeBlock;
