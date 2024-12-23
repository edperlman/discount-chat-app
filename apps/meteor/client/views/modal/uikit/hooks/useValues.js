"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValues = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = require("react");
const hasElementInBlock = (block) => 'element' in block;
const hasElementsInBlock = (block) => 'elements' in block;
const hasInitialValueAndActionId = (element) => 'initialValue' in element && 'actionId' in element && typeof element.actionId === 'string' && !!(element === null || element === void 0 ? void 0 : element.initialValue);
const extractValue = (element, obj, blockId) => {
    if (hasInitialValueAndActionId(element)) {
        obj[element.actionId] = { value: element.initialValue, blockId };
    }
};
const reduceBlocks = (obj, block) => {
    if (hasElementInBlock(block)) {
        extractValue(block.element, obj, block.blockId);
    }
    if (hasElementsInBlock(block)) {
        for (const element of block.elements) {
            extractValue(element, obj, block.blockId);
        }
    }
    return obj;
};
const useValues = (blocks) => {
    const reducer = (0, fuselage_hooks_1.useMutableCallback)((values, { actionId, payload }) => (Object.assign(Object.assign({}, values), { [actionId]: payload })));
    const initializer = (0, fuselage_hooks_1.useMutableCallback)((blocks) => {
        const obj = {};
        return blocks.reduce(reduceBlocks, obj);
    });
    return (0, react_1.useReducer)(reducer, blocks, initializer);
};
exports.useValues = useValues;
