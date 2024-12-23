"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const useDocumentTitle_1 = require("./useDocumentTitle");
const DEFAULT_TITLE = 'Default Title';
const EXAMPLE_TITLE = 'Example Title';
it('should return the default title', () => {
    const { result } = (0, react_1.renderHook)(() => (0, useDocumentTitle_1.useDocumentTitle)(DEFAULT_TITLE), { legacyRoot: true });
    expect(result.current.title).toBe(DEFAULT_TITLE);
});
it('should return the default title and empty key value if refocus param is false', () => {
    const { result } = (0, react_1.renderHook)(() => (0, useDocumentTitle_1.useDocumentTitle)(DEFAULT_TITLE, false), { legacyRoot: true });
    expect(result.current.title).toBe(DEFAULT_TITLE);
    expect(result.current.key).toBe('');
});
it('should return the default title and the example title concatenated', () => {
    const { result } = (0, react_1.renderHook)(() => {
        (0, useDocumentTitle_1.useDocumentTitle)(DEFAULT_TITLE);
        return (0, useDocumentTitle_1.useDocumentTitle)(EXAMPLE_TITLE);
    }, { legacyRoot: true });
    expect(result.current.title).toBe(`${EXAMPLE_TITLE} - ${DEFAULT_TITLE}`);
});
