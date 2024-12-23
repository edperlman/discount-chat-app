"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const MarkupInteractionContext_1 = require("../MarkupInteractionContext");
const PlainSpan = ({ text }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { highlightRegex, markRegex } = (0, react_1.useContext)(MarkupInteractionContext_1.MarkupInteractionContext);
    const content = (0, react_1.useMemo)(() => {
        var _a, _b;
        if (highlightRegex) {
            const chunks = text.split(highlightRegex());
            const head = (_a = chunks.shift()) !== null && _a !== void 0 ? _a : '';
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: head }), chunks.map((chunk, i) => {
                        if (i % 2 === 0) {
                            return ((0, jsx_runtime_1.jsx)("mark", { title: t('Highlighted_chosen_word'), className: 'highlight-text', children: chunk }, i));
                        }
                        return (0, jsx_runtime_1.jsx)(react_1.Fragment, { children: chunk }, i);
                    })] }));
        }
        if (markRegex) {
            const chunks = text.split(markRegex());
            const head = (_b = chunks.shift()) !== null && _b !== void 0 ? _b : '';
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: head }), chunks.map((chunk, i) => {
                        if (i % 2 === 0) {
                            return (0, jsx_runtime_1.jsx)("mark", { children: chunk }, i);
                        }
                        return (0, jsx_runtime_1.jsx)(react_1.Fragment, { children: chunk }, i);
                    })] }));
        }
        return text;
    }, [highlightRegex, markRegex, text, t]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: content });
};
exports.default = (0, react_1.memo)(PlainSpan);
