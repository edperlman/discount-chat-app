"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autocomplete_1 = require("@codemirror/autocomplete");
const commands_1 = require("@codemirror/commands");
const language_1 = require("@codemirror/language");
const lint_1 = require("@codemirror/lint");
const search_1 = require("@codemirror/search");
const view_1 = require("@codemirror/view");
const basicSetup = (() => [
    (0, view_1.lineNumbers)(),
    (0, commands_1.history)(),
    (0, language_1.foldGutter)(),
    (0, view_1.drawSelection)(),
    (0, view_1.dropCursor)(),
    (0, language_1.indentOnInput)(),
    view_1.EditorView.lineWrapping,
    (0, language_1.syntaxHighlighting)(language_1.defaultHighlightStyle, { fallback: true }),
    (0, language_1.bracketMatching)(),
    (0, autocomplete_1.closeBrackets)(),
    (0, view_1.rectangularSelection)(),
    (0, view_1.crosshairCursor)(),
    (0, search_1.highlightSelectionMatches)(),
    view_1.keymap.of([
        ...autocomplete_1.closeBracketsKeymap,
        ...commands_1.defaultKeymap,
        ...search_1.searchKeymap,
        ...commands_1.historyKeymap,
        ...language_1.foldKeymap,
        ...autocomplete_1.completionKeymap,
        ...lint_1.lintKeymap,
        commands_1.indentWithTab,
    ]),
])();
exports.default = basicSetup;
