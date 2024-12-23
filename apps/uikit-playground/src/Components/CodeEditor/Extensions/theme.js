"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const view_1 = require("@codemirror/view");
const gutters = view_1.EditorView.theme({
    '.cm-gutters': {
        backgroundColor: 'transparent',
        border: 'none',
        userSelect: 'none',
        minWidth: '32px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    '.cm-activeLineGutter': {
        backgroundColor: 'transparent',
    },
});
const selection = view_1.EditorView.theme({
    '.cm-selectionBackground': {
        backgroundColor: 'var(--RCPG-secondary-color) !important',
        opacity: 0.3,
    },
    '.cm-selectionMatch': {
        backgroundColor: '#74808930 !important',
    },
    '.cm-matchingBracket': {
        backgroundColor: 'transparent !important',
        border: '1px solid #1d74f580',
    },
});
const line = view_1.EditorView.theme({
    '.cm-activeLine': {
        backgroundColor: 'transparent !important',
    },
});
exports.default = [gutters, selection, line];
