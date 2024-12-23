"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareBSONValues = exports.getBSONType = void 0;
const getBSONType = (v) => {
    if (typeof v === 'number') {
        return 1 /* BSONType.Double */;
    }
    if (typeof v === 'string') {
        return 2 /* BSONType.String */;
    }
    if (typeof v === 'boolean') {
        return 8 /* BSONType.Boolean */;
    }
    if (Array.isArray(v)) {
        return 4 /* BSONType.Array */;
    }
    if (v === null) {
        return 10 /* BSONType.Null */;
    }
    if (v instanceof RegExp) {
        return 11 /* BSONType.Regex */;
    }
    if (typeof v === 'function') {
        return 13 /* BSONType.JavaScript */;
    }
    if (v instanceof Date) {
        return 9 /* BSONType.Date */;
    }
    if (v instanceof Uint8Array) {
        return 5 /* BSONType.BinData */;
    }
    return 3 /* BSONType.Object */;
};
exports.getBSONType = getBSONType;
const getBSONTypeOrder = (type) => {
    switch (type) {
        case 10 /* BSONType.Null */:
            return 0;
        case 1 /* BSONType.Double */:
        case 16 /* BSONType.Int */:
        case 18 /* BSONType.Long */:
            return 1;
        case 2 /* BSONType.String */:
        case 14 /* BSONType.Symbol */:
            return 2;
        case 3 /* BSONType.Object */:
            return 3;
        case 4 /* BSONType.Array */:
            return 4;
        case 5 /* BSONType.BinData */:
            return 5;
        case 7 /* BSONType.ObjectId */:
            return 6;
        case 8 /* BSONType.Boolean */:
            return 7;
        case 9 /* BSONType.Date */:
        case 17 /* BSONType.Timestamp */:
            return 8;
        case 11 /* BSONType.Regex */:
            return 9;
        case 13 /* BSONType.JavaScript */:
        case 15 /* BSONType.JavaScriptWithScope */:
            return 100;
        default:
            return -1;
    }
};
const compareBSONValues = (a, b) => {
    if (a === undefined) {
        return b === undefined ? 0 : -1;
    }
    if (b === undefined) {
        return 1;
    }
    const ta = (0, exports.getBSONType)(a);
    const oa = getBSONTypeOrder(ta);
    const tb = (0, exports.getBSONType)(b);
    const ob = getBSONTypeOrder(tb);
    if (oa !== ob) {
        return oa < ob ? -1 : 1;
    }
    if (ta !== tb) {
        throw Error('Missing type coercion logic in compareBSONValues');
    }
    switch (ta) {
        case 1 /* BSONType.Double */:
            return a - b;
        case 2 /* BSONType.String */:
            return a.localeCompare(b);
        case 3 /* BSONType.Object */:
            return (0, exports.compareBSONValues)(Array.prototype.concat.call([], ...Object.entries(a)), Array.prototype.concat.call([], ...Object.entries(b)));
        case 4 /* BSONType.Array */: {
            for (let i = 0;; i++) {
                if (i === a.length) {
                    return i === b.length ? 0 : -1;
                }
                if (i === b.length) {
                    return 1;
                }
                const s = (0, exports.compareBSONValues)(a[i], b[i]);
                if (s !== 0) {
                    return s;
                }
            }
        }
        case 5 /* BSONType.BinData */: {
            if (a.length !== b.length) {
                return a.length - b.length;
            }
            for (let i = 0; i < a.length; i++) {
                if (a[i] === b[i]) {
                    continue;
                }
                return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        }
        case 10 /* BSONType.Null */:
        case 6 /* BSONType.Undefined */:
            return 0;
        case 7 /* BSONType.ObjectId */:
            return a.toHexString().localeCompare(b.toHexString());
        case 8 /* BSONType.Boolean */:
            return Number(a) - Number(b);
        case 9 /* BSONType.Date */:
            return a.getTime() - b.getTime();
        case 11 /* BSONType.Regex */:
            throw Error('Sorting not supported on regular expression');
        case 13 /* BSONType.JavaScript */:
        case 15 /* BSONType.JavaScriptWithScope */:
            throw Error('Sorting not supported on Javascript code');
    }
    throw Error('Unknown type to sort');
};
exports.compareBSONValues = compareBSONValues;
