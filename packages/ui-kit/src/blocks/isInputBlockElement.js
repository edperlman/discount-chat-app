"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInputBlockElement = void 0;
const BlockElementType_1 = require("./BlockElementType");
const isInputBlockElement = (block) => {
    switch (block.type) {
        case BlockElementType_1.BlockElementType.CHANNELS_SELECT:
        case BlockElementType_1.BlockElementType.CONVERSATIONS_SELECT:
        case BlockElementType_1.BlockElementType.DATEPICKER:
        case BlockElementType_1.BlockElementType.LINEAR_SCALE:
        case BlockElementType_1.BlockElementType.MULTI_STATIC_SELECT:
        case BlockElementType_1.BlockElementType.PLAIN_TEXT_INPUT:
        case BlockElementType_1.BlockElementType.STATIC_SELECT:
        case BlockElementType_1.BlockElementType.USERS_SELECT:
            return true;
        default:
            return false;
    }
};
exports.isInputBlockElement = isInputBlockElement;
