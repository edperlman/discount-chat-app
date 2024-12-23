"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceReactAriaIds = void 0;
const replaceReactAriaIds = (container) => {
    const selectors = ['id', 'for', 'aria-labelledby'];
    const ariaSelector = (el) => `[${el}^="react-aria"]`;
    const regexp = /react-aria\d+-\d+/g;
    const staticId = 'static-id';
    const attributesMap = {};
    container.querySelectorAll(selectors.map(ariaSelector).join(', ')).forEach((el, index) => {
        selectors.forEach((selector) => {
            const attr = el.getAttribute(selector);
            if (attr === null || attr === void 0 ? void 0 : attr.match(regexp)) {
                const newAttr = attributesMap[attr] || `${staticId}-${index}`;
                el.setAttribute(selector, newAttr);
                attributesMap[attr] = newAttr;
            }
        });
    });
    return container;
};
exports.replaceReactAriaIds = replaceReactAriaIds;
