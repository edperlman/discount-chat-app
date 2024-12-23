"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClassName = void 0;
const flatMap = (arr, mapFunc) => {
    const result = [];
    for (const [index, elem] of arr.entries()) {
        const x = mapFunc(elem, index, arr);
        // We allow mapFunc() to return non-Arrays
        if (Array.isArray(x)) {
            result.push(...x);
        }
        else {
            result.push(x);
        }
    }
    return result;
};
const createClassName = (styles, elementName, modifiers = {}, classes = []) => {
    return [
        styles[elementName],
        ...flatMap(Object.entries(modifiers), ([modifierKey, modifierValue]) => [
            modifierValue && styles[`${elementName}--${modifierKey}`],
            typeof modifierValue !== 'boolean' && styles[`${elementName}--${modifierKey}-${modifierValue}`],
        ]).filter((className) => !!className),
        ...classes.filter((className) => !!className),
    ].join(' ');
};
exports.createClassName = createClassName;
