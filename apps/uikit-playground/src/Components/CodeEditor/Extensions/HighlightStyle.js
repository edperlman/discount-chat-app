"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const language_1 = require("@codemirror/language");
const highlight_1 = require("@lezer/highlight");
const highLightStyle = () => {
    const style = language_1.HighlightStyle.define([
        { tag: highlight_1.tags.literal, color: 'var(--RCPG-primary-color)' },
        { tag: highlight_1.tags.bool, color: 'var(--RCPG-tertary-color)' },
        { tag: highlight_1.tags.number, color: 'var(--RCPG-secondary-color)' },
        { tag: highlight_1.tags.null, color: 'var(--RCPG-tertary-color)' },
    ]);
    return (0, language_1.syntaxHighlighting)(style);
};
exports.default = highLightStyle();
