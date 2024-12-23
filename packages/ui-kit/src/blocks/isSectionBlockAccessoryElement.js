"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSectionBlockAccessoryElement = void 0;
const BlockElementType_1 = require("./BlockElementType");
const isSectionBlockAccessoryElement = (block) => {
    switch (block.type) {
        case BlockElementType_1.BlockElementType.BUTTON:
        case BlockElementType_1.BlockElementType.DATEPICKER:
        case BlockElementType_1.BlockElementType.IMAGE:
        case BlockElementType_1.BlockElementType.MULTI_STATIC_SELECT:
        case BlockElementType_1.BlockElementType.OVERFLOW:
        case BlockElementType_1.BlockElementType.STATIC_SELECT:
            return true;
        default:
            return false;
    }
};
exports.isSectionBlockAccessoryElement = isSectionBlockAccessoryElement;
