"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurfaceRenderer = void 0;
const LayoutBlockType_1 = require("../blocks/LayoutBlockType");
const TextObjectType_1 = require("../blocks/TextObjectType");
const isActionsBlockElement_1 = require("../blocks/isActionsBlockElement");
const isContextBlockElement_1 = require("../blocks/isContextBlockElement");
const isInputBlockElement_1 = require("../blocks/isInputBlockElement");
const isSectionBlockAccessoryElement_1 = require("../blocks/isSectionBlockAccessoryElement");
const isTextObject_1 = require("../blocks/isTextObject");
const isNotNull_1 = require("../isNotNull");
const BlockContext_1 = require("./BlockContext");
const renderBlockElement_1 = require("./renderBlockElement");
const renderLayoutBlock_1 = require("./renderLayoutBlock");
const renderTextObject_1 = require("./renderTextObject");
const resolveConditionalBlocks_1 = require("./resolveConditionalBlocks");
class SurfaceRenderer {
    constructor(allowedLayoutBlockTypes) {
        this.isAllowedLayoutBlock = (block) => this.allowedLayoutBlockTypes.has(block.type);
        this.allowedLayoutBlockTypes = new Set(allowedLayoutBlockTypes);
    }
    render(blocks, conditions) {
        if (!Array.isArray(blocks)) {
            return [];
        }
        return blocks
            .flatMap((0, resolveConditionalBlocks_1.resolveConditionalBlocks)(conditions))
            .filter(this.isAllowedLayoutBlock)
            .map((0, renderLayoutBlock_1.renderLayoutBlock)(this))
            .filter(isNotNull_1.isNotNull);
    }
    renderTextObject(textObject, index, context) {
        return (0, renderTextObject_1.renderTextObject)(this, context)(textObject, index);
    }
    renderActionsBlockElement(block, index) {
        if (this.allowedLayoutBlockTypes.has(LayoutBlockType_1.LayoutBlockType.ACTIONS) === false && !(0, isActionsBlockElement_1.isActionsBlockElement)(block)) {
            return null;
        }
        return (0, renderBlockElement_1.renderBlockElement)(this, BlockContext_1.BlockContext.ACTION)(block, index);
    }
    /** @deprecated */
    renderActions(element, _context, _, index) {
        return this.renderActionsBlockElement(element, index);
    }
    renderContextBlockElement(block, index) {
        if (this.allowedLayoutBlockTypes.has(LayoutBlockType_1.LayoutBlockType.CONTEXT) === false && !(0, isContextBlockElement_1.isContextBlockElement)(block)) {
            return null;
        }
        if ((0, isTextObject_1.isTextObject)(block)) {
            return (0, renderTextObject_1.renderTextObject)(this, BlockContext_1.BlockContext.CONTEXT)(block, index);
        }
        return (0, renderBlockElement_1.renderBlockElement)(this, BlockContext_1.BlockContext.CONTEXT)(block, index);
    }
    /** @deprecated */
    renderContext(element, _context, _, index) {
        return this.renderContextBlockElement(element, index);
    }
    renderInputBlockElement(block, index) {
        if (this.allowedLayoutBlockTypes.has(LayoutBlockType_1.LayoutBlockType.INPUT) === false && !(0, isInputBlockElement_1.isInputBlockElement)(block)) {
            return null;
        }
        return (0, renderBlockElement_1.renderBlockElement)(this, BlockContext_1.BlockContext.FORM)(block, index);
    }
    /** @deprecated */
    renderInputs(element, _context, _, index) {
        return this.renderInputBlockElement(element, index);
    }
    renderSectionAccessoryBlockElement(block, index) {
        if (this.allowedLayoutBlockTypes.has(LayoutBlockType_1.LayoutBlockType.SECTION) === false && !(0, isSectionBlockAccessoryElement_1.isSectionBlockAccessoryElement)(block)) {
            return null;
        }
        return (0, renderBlockElement_1.renderBlockElement)(this, BlockContext_1.BlockContext.SECTION)(block, index);
    }
    /** @deprecated */
    renderAccessories(element, _context, _, index) {
        return this.renderSectionAccessoryBlockElement(element, index);
    }
    /** @deprecated */
    plainText(element, context = BlockContext_1.BlockContext.NONE, index = 0) {
        return this[TextObjectType_1.TextObjectType.PLAIN_TEXT](element, context, index);
    }
    /** @deprecated */
    text(textObject, context = BlockContext_1.BlockContext.NONE, index = 0) {
        switch (textObject.type) {
            case TextObjectType_1.TextObjectType.PLAIN_TEXT:
                return this.plain_text(textObject, context, index);
            case TextObjectType_1.TextObjectType.MRKDWN:
                return this.mrkdwn(textObject, context, index);
            default:
                return null;
        }
    }
}
exports.SurfaceRenderer = SurfaceRenderer;
