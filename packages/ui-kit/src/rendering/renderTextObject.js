"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTextObject = void 0;
const getTextObjectRenderer = (renderers, type) => {
    var _a;
    const renderer = renderers[type];
    if (renderer) {
        return renderer;
    }
    switch (type) {
        case 'plain_text':
            return ((_a = renderers.plainText) !== null && _a !== void 0 ? _a : renderers.text);
        case 'mrkdwn':
            return renderers.text;
    }
};
const renderTextObject = (renderers, context) => (textObject, index) => {
    const renderer = getTextObjectRenderer(renderers, textObject.type);
    if (!renderer) {
        return null;
    }
    return renderer.call(renderers, textObject, context, index);
};
exports.renderTextObject = renderTextObject;
