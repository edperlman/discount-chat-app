"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBlockElement = void 0;
const getBlockElementRenderer = (renderers, type) => {
    const renderer = renderers[type];
    if (renderer) {
        return renderer;
    }
    switch (type) {
        case 'datepicker':
            return renderers.datePicker;
        case 'static_select':
            return renderers.staticSelect;
        case 'multi_static_select':
            return renderers.multiStaticSelect;
        case 'plain_text_input':
            return renderers.plainInput;
        case 'linear_scale':
            return renderers.linearScale;
    }
};
const renderBlockElement = (renderers, context) => (blockElement, index) => {
    const renderer = getBlockElementRenderer(renderers, blockElement.type);
    if (!renderer) {
        return null;
    }
    return renderer.call(renderers, blockElement, context, index);
};
exports.renderBlockElement = renderBlockElement;
