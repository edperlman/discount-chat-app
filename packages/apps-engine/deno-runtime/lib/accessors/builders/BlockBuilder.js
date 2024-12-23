"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockBuilder = void 0;
const uuid_1 = require("uuid");
const AppObjectRegistry_ts_1 = require("../../../AppObjectRegistry.ts");
const require_ts_1 = require("../../../lib/require.ts");
const { BlockType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/uikit/blocks/Blocks.js');
const { BlockElementType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/uikit/blocks/Elements.js');
const { TextObjectType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/uikit/blocks/Objects.js');
/**
 * @deprecated please prefer the rocket.chat/ui-kit components
 */
class BlockBuilder {
    constructor() {
        this.blocks = [];
        this.appId = String(AppObjectRegistry_ts_1.AppObjectRegistry.get('id'));
    }
    addSectionBlock(block) {
        this.addBlock(Object.assign({ type: BlockType.SECTION }, block));
        return this;
    }
    addImageBlock(block) {
        this.addBlock(Object.assign({ type: BlockType.IMAGE }, block));
        return this;
    }
    addDividerBlock() {
        this.addBlock({ type: BlockType.DIVIDER });
        return this;
    }
    addActionsBlock(block) {
        this.addBlock(Object.assign({ type: BlockType.ACTIONS }, block));
        return this;
    }
    addContextBlock(block) {
        this.addBlock(Object.assign({ type: BlockType.CONTEXT }, block));
        return this;
    }
    addInputBlock(block) {
        this.addBlock(Object.assign({ type: BlockType.INPUT }, block));
        return this;
    }
    addConditionalBlock(innerBlocks, condition) {
        const render = innerBlocks instanceof BlockBuilder ? innerBlocks.getBlocks() : innerBlocks;
        this.addBlock({
            type: BlockType.CONDITIONAL,
            render,
            when: condition,
        });
        return this;
    }
    getBlocks() {
        return this.blocks;
    }
    newPlainTextObject(text, emoji = false) {
        return {
            type: TextObjectType.PLAINTEXT,
            text,
            emoji,
        };
    }
    newMarkdownTextObject(text) {
        return {
            type: TextObjectType.MARKDOWN,
            text,
        };
    }
    newButtonElement(info) {
        return this.newInteractiveElement(Object.assign({ type: BlockElementType.BUTTON }, info));
    }
    newImageElement(info) {
        return Object.assign({ type: BlockElementType.IMAGE }, info);
    }
    newOverflowMenuElement(info) {
        return this.newInteractiveElement(Object.assign({ type: BlockElementType.OVERFLOW_MENU }, info));
    }
    newPlainTextInputElement(info) {
        return this.newInputElement(Object.assign({ type: BlockElementType.PLAIN_TEXT_INPUT }, info));
    }
    newStaticSelectElement(info) {
        return this.newSelectElement(Object.assign({ type: BlockElementType.STATIC_SELECT }, info));
    }
    newMultiStaticElement(info) {
        return this.newSelectElement(Object.assign({ type: BlockElementType.MULTI_STATIC_SELECT }, info));
    }
    newInteractiveElement(element) {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }
        return element;
    }
    newInputElement(element) {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }
        return element;
    }
    newSelectElement(element) {
        if (!element.actionId) {
            element.actionId = this.generateActionId();
        }
        return element;
    }
    addBlock(block) {
        if (!block.blockId) {
            block.blockId = this.generateBlockId();
        }
        block.appId = this.appId;
        this.blocks.push(block);
    }
    generateBlockId() {
        return (0, uuid_1.v1)();
    }
    generateActionId() {
        return (0, uuid_1.v1)();
    }
}
exports.BlockBuilder = BlockBuilder;
