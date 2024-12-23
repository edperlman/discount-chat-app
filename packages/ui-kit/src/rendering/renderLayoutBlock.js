"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLayoutBlock = void 0;
const BlockContext_1 = require("./BlockContext");
const getLayoutBlockRenderer = (renderers, type) => renderers[type];
const renderLayoutBlock = (renderers) => (layoutBlock, index) => {
    const renderer = getLayoutBlockRenderer(renderers, layoutBlock.type);
    if (!renderer) {
        return null;
    }
    return renderer.call(renderers, layoutBlock, BlockContext_1.BlockContext.BLOCK, index);
};
exports.renderLayoutBlock = renderLayoutBlock;
