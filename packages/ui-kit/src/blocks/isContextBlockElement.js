"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContextBlockElement = void 0;
const BlockElementType_1 = require("./BlockElementType");
const TextObjectType_1 = require("./TextObjectType");
const isContextBlockElement = (block) => {
    switch (block.type) {
        case BlockElementType_1.BlockElementType.IMAGE:
        case TextObjectType_1.TextObjectType.PLAIN_TEXT:
        case TextObjectType_1.TextObjectType.MARKDOWN:
            return true;
        default:
            return false;
    }
};
exports.isContextBlockElement = isContextBlockElement;
