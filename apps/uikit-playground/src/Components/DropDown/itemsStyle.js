"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelStyle = exports.itemStyle = void 0;
const css_in_js_1 = require("@rocket.chat/css-in-js");
const itemStyle = (layer, hover) => {
    const style = (0, css_in_js_1.css) `
    cursor: pointer !important;
    padding-left: ${10 + (layer - 1) * 16}px !important;
    background-color: ${hover
        ? 'var(--RCPG-primary-color) !important'
        : 'transparent !important'};
  `;
    return style;
};
exports.itemStyle = itemStyle;
const labelStyle = (layer, hover) => {
    let customStyle;
    const basicStyle = (0, css_in_js_1.css) `
    cursor: pointer !important;
    padding-left: 4px !important;
  `;
    switch (layer) {
        case 1:
            customStyle = (0, css_in_js_1.css) `
        font-weight: 700 !important;
        font-size: 14px !important;
        letter-spacing: 0.3px !important;
        color: ${hover ? '#fff !important' : '#999 !important'};
        text-transform: uppercase !important;
      `;
            break;
        case 2:
            customStyle = (0, css_in_js_1.css) `
        letter-spacing: 0.1px !important;
        font-size: 12px !important;
        color: ${hover ? '#fff !important' : '#555 !important'};
        text-transform: capitalize !important;
      `;
            break;
        default:
            customStyle = (0, css_in_js_1.css) `
        font-size: 12px !important;
        color: ${hover ? '#fff !important' : '#555 !important'};
        text-transform: capitalize !important;
      `;
            break;
    }
    return [customStyle, basicStyle];
};
exports.labelStyle = labelStyle;
