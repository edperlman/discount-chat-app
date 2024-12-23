"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileDocumentSelector = void 0;
const bson_1 = require("./bson");
const comparisons_1 = require("./comparisons");
const lookups_1 = require("./lookups");
const isArrayOfFields = (values) => values.every((value) => ['number', 'string', 'symbol'].includes(typeof value));
const $in = (operand, _options) => {
    let index = null;
    if (isArrayOfFields(operand)) {
        index = {};
        for (const operandElement of operand) {
            index[operandElement] = operandElement;
        }
    }
    return (value) => (0, comparisons_1.some)(value, (x) => {
        if (typeof x === 'string' && index !== null) {
            return !!index[x];
        }
        return operand.some((operandElement) => (0, comparisons_1.equals)(operandElement, x));
    });
};
const $nin = (operand, _options) => {
    const isIn = $in(operand, undefined);
    return (value) => {
        if (value === undefined) {
            return true;
        }
        return !isIn(value);
    };
};
const $all = (operand, _options) => (value) => {
    if (!Array.isArray(value)) {
        return false;
    }
    return operand.every((operandElement) => value.some((valueElement) => (0, comparisons_1.equals)(operandElement, valueElement)));
};
const $lt = (operand, _options) => (value) => (0, comparisons_1.flatSome)(value, (x) => (0, bson_1.compareBSONValues)(x, operand) < 0);
const $lte = (operand, _options) => (value) => (0, comparisons_1.flatSome)(value, (x) => (0, bson_1.compareBSONValues)(x, operand) <= 0);
const $gt = (operand, _options) => (value) => (0, comparisons_1.flatSome)(value, (x) => (0, bson_1.compareBSONValues)(x, operand) > 0);
const $gte = (operand, _options) => (value) => (0, comparisons_1.flatSome)(value, (x) => (0, bson_1.compareBSONValues)(x, operand) >= 0);
const $ne = (operand, _options) => (value) => !(0, comparisons_1.some)(value, (x) => (0, comparisons_1.equals)(x, operand));
const $exists = (operand, _options) => (value) => operand === (value !== undefined);
const $mod = ([divisor, remainder], _options) => (value) => (0, comparisons_1.flatSome)(value, (x) => Number(x) % divisor === remainder);
const $size = (operand, _options) => (value) => Array.isArray(value) && operand === value.length;
const $type = (operand, _options) => (value) => {
    if (value === undefined) {
        return false;
    }
    return (0, comparisons_1.flatSome)(value, (x) => (0, bson_1.getBSONType)(x) === operand);
};
const $regex = (operand, options) => {
    let regex;
    if (options !== undefined) {
        const regexSource = operand instanceof RegExp ? operand.source : operand;
        regex = new RegExp(regexSource, options);
    }
    else if (!(operand instanceof RegExp)) {
        regex = new RegExp(operand);
    }
    return (value) => {
        if (value === undefined) {
            return false;
        }
        return (0, comparisons_1.flatSome)(value, (x) => regex.test(String(x)));
    };
};
const $elemMatch = (operand, _options) => {
    const matcher = (0, exports.compileDocumentSelector)(operand);
    return (value) => {
        if (!Array.isArray(value)) {
            return false;
        }
        return value.some((x) => matcher(x));
    };
};
const $not = (operand, _options) => {
    const matcher = compileValueSelector(operand);
    return (value) => !matcher(value);
};
const dummyOperator = (_operand, _options) => (_value) => true;
const $options = dummyOperator;
const $near = dummyOperator;
const $geoIntersects = dummyOperator;
const valueOperators = {
    $in,
    $nin,
    $all,
    $lt,
    $lte,
    $gt,
    $gte,
    $ne,
    $exists,
    $mod,
    $size,
    $type,
    $regex,
    $elemMatch,
    $not,
    $options,
    $near,
    $geoIntersects,
};
const $and = (subSelector) => {
    const subSelectorFunctions = subSelector.map(exports.compileDocumentSelector);
    return (doc) => subSelectorFunctions.every((f) => f(doc));
};
const $or = (subSelector) => {
    const subSelectorFunctions = subSelector.map(exports.compileDocumentSelector);
    return (doc) => subSelectorFunctions.some((f) => f(doc));
};
const $nor = (subSelector) => {
    const subSelectorFunctions = subSelector.map(exports.compileDocumentSelector);
    return (doc) => subSelectorFunctions.every((f) => !f(doc));
};
const $where = (selectorValue) => {
    const fn = selectorValue instanceof Function ? selectorValue : Function(`return ${selectorValue}`);
    return (doc) => !!fn.call(doc);
};
const logicalOperators = {
    $and,
    $or,
    $nor,
    $where,
};
const isValueOperator = (operator) => operator in valueOperators;
const isLogicalOperator = (operator) => operator in logicalOperators;
const hasValueOperators = (valueSelector) => Object.keys(valueSelector).every((key) => key.slice(0, 1) === '$');
const compileUndefinedOrNullSelector = () => (value) => (0, comparisons_1.flatSome)(value, (x) => x === undefined || x === null);
const compilePrimitiveSelector = (primitive) => (value) => (0, comparisons_1.flatSome)(value, (x) => x === primitive);
const compileRegexSelector = (regex) => (value) => {
    if (value === undefined) {
        return false;
    }
    return (0, comparisons_1.flatSome)(value, (x) => regex.test(String(x)));
};
const compileArraySelector = (expected) => (value) => {
    if (!Array.isArray(value)) {
        return false;
    }
    return (0, comparisons_1.some)(value, (x) => (0, comparisons_1.equals)(expected, x));
};
const compileValueOperatorsSelector = (expression) => {
    const operatorFunctions = [];
    for (const operator of Object.keys(expression)) {
        if (!isValueOperator(operator)) {
            continue;
        }
        const operand = expression[operator];
        const operation = valueOperators[operator];
        operatorFunctions.push(operation(operand, expression.$options));
    }
    return (value) => operatorFunctions.every((f) => f(value));
};
const compileValueSelector = (valueSelector) => {
    if (valueSelector === undefined || valueSelector === null) {
        return compileUndefinedOrNullSelector();
    }
    if (!(0, comparisons_1.isObject)(valueSelector)) {
        return compilePrimitiveSelector(valueSelector);
    }
    if (valueSelector instanceof RegExp) {
        return compileRegexSelector(valueSelector);
    }
    if (Array.isArray(valueSelector)) {
        return compileArraySelector(valueSelector);
    }
    if (hasValueOperators(valueSelector)) {
        return compileValueOperatorsSelector(valueSelector);
    }
    return (value) => (0, comparisons_1.flatSome)(value, (x) => (0, comparisons_1.equals)(valueSelector, x));
};
const compileDocumentSelector = (docSelector) => {
    const perKeySelectors = Object.entries(docSelector).map(([key, subSelector]) => {
        if (subSelector === undefined) {
            return () => true;
        }
        if (isLogicalOperator(key)) {
            switch (key) {
                case '$and':
                    return $and(subSelector);
                case '$or':
                    return $or(subSelector);
                case '$nor':
                    return $nor(subSelector);
                case '$where':
                    return $where(subSelector);
            }
        }
        const lookUpByIndex = (0, lookups_1.createLookupFunction)(key);
        const valueSelectorFunc = compileValueSelector(subSelector);
        return (doc) => {
            const branchValues = lookUpByIndex(doc);
            return branchValues.some(valueSelectorFunc);
        };
    });
    return (doc) => perKeySelectors.every((f) => f(doc));
};
exports.compileDocumentSelector = compileDocumentSelector;
