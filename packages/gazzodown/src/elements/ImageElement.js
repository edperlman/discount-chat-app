"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const flattenMarkup = (markup) => {
    switch (markup.type) {
        case 'PLAIN_TEXT':
            return markup.value;
        case 'ITALIC':
        case 'BOLD':
        case 'STRIKE':
            return markup.value.map(flattenMarkup).join('');
        case 'INLINE_CODE':
            return flattenMarkup(markup.value);
        case 'LINK': {
            const label = flattenMarkup(markup.value.label);
            const href = markup.value.src.value;
            return label ? `${label} (${href})` : href;
        }
        default:
            return '';
    }
};
const style = {
    maxWidth: '100%',
};
const ImageElement = ({ src, alt }) => {
    const plainAlt = (0, react_1.useMemo)(() => flattenMarkup(alt), [alt]);
    return ((0, jsx_runtime_1.jsx)("a", { href: src, target: '_blank', rel: 'noopener noreferrer', title: plainAlt, children: (0, jsx_runtime_1.jsx)("img", { src: src, "data-title": src, alt: plainAlt, style: style }) }));
};
exports.default = ImageElement;
