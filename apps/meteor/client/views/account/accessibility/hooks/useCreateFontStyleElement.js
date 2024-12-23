"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateFontStyleElement = void 0;
const react_1 = require("react");
const createStyleElement = (id) => {
    const styleElement = document.getElementById(id);
    if (styleElement) {
        return styleElement;
    }
    const newStyleElement = document.createElement('style');
    newStyleElement.setAttribute('id', id);
    return newStyleElement;
};
const useCreateFontStyleElement = () => {
    return (0, react_1.useMemo)(() => (fontSize) => {
        const styleElement = createStyleElement('rcx-font-size');
        const css = `html { font-size: ${fontSize}; }`;
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
    }, []);
};
exports.useCreateFontStyleElement = useCreateFontStyleElement;
