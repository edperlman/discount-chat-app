"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExternal = exports.getBaseURI = void 0;
const getBaseURI = () => {
    if (document.baseURI) {
        return document.baseURI;
    }
    // Should be exactly one tag:
    //   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
    const base = document.getElementsByTagName('base');
    // Return location from BASE tag.
    if (base.length > 0) {
        return base[0].href;
    }
    // Else use implementation of documentURI:
    //   http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-baseURI
    return document.URL;
};
exports.getBaseURI = getBaseURI;
const isExternal = (href) => href.indexOf((0, exports.getBaseURI)()) !== 0;
exports.isExternal = isExternal;
