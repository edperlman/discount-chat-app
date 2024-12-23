"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConditionalBlocks = void 0;
const LayoutBlockType_1 = require("../blocks/LayoutBlockType");
const conditionsMatch = (conditions = undefined, filters = {}) => {
    if (!conditions) {
        return true;
    }
    if (Array.isArray(filters.engine) && !filters.engine.includes(conditions.engine)) {
        return false;
    }
    return true;
};
const resolveConditionalBlocks = (conditions) => (block) => {
    if (block.type !== LayoutBlockType_1.LayoutBlockType.CONDITIONAL) {
        return [block];
    }
    if (conditionsMatch(conditions, block.when)) {
        return block.render;
    }
    return [];
};
exports.resolveConditionalBlocks = resolveConditionalBlocks;
