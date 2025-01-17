"use strict";
/**
 * Transforms a `data` source object to another object,
 * essentially applying a to -> from mapping provided by
 * `map`. It does not mutate the `data` object.
 *
 * It also inserts in the `transformedObject` a new property
 * called `_unmappedProperties_` which contains properties from
 * the original `data` that have not been mapped to its transformed
 * counterpart. E.g.:
 *
 * ```javascript
 * const data = { _id: 'abcde123456', size: 10 };
 * const map = Object.freeze({ id: '_id' });
 *
 * transformMappedData(data, map);
 * // { id: 'abcde123456', _unmappedProperties_: { size: 10 } }
 * ```
 *
 * In order to compute the unmapped properties, this function will
 * ignore any property on `data` that has been named on the "from" part
 * of the `map`, and will consider properties not mentioned as unmapped.
 *
 * You can also define the "from" part as a function, so you can derive a
 * new value for your property from the original `data`. This function will
 * receive a copy of the original `data` for it to calculate the value
 * for its "to" field. Please note that in this case `transformMappedData`
 * will not be able to determine the source field from your map, so it won't
 * ignore any field you've used to derive your new value. For that, you're
 * going to need to delete the value from the received parameter. E.g:
 *
 * ```javascript
 * const data = { _id: 'abcde123456', size: 10 };
 *
 * // It will look like the `size` property is not mapped
 * const map = {
 *     id: '_id',
 *     newSize: (data) => data.size + 10
 * };
 *
 * transformMappedData(data, map);
 * // { id: 'abcde123456', newSize: 20, _unmappedProperties_: { size: 10 } }
 *
 * // You need to explicitly remove it from the original `data`
 * const map = Object.freeze({
 *     id: '_id',
 *     newSize: (data) => {
 *         const result = data.size + 10;
 *         delete data.size;
 *         return result;
 *     }
 * });
 *
 * transformMappedData(data, map);
 * // { id: 'abcde123456', newSize: 20, _unmappedProperties_: {} }
 * ```
 *
 * @param Object data The data to be transformed
 * @param Object map The map with transformations to be applied
 *
 * @returns Object The data after transformations have been applied
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformMappedData = void 0;
const transformMappedData = (data, map) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const originalData = structuredClone(data);
    const transformedData = {};
    try {
        for (var _d = true, _e = __asyncValues(Object.entries(map)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const [to, from] = _c;
            if (typeof from === 'function') {
                const result = yield from(originalData);
                if (typeof result !== 'undefined') {
                    transformedData[to] = result;
                }
            }
            else if (typeof from === 'string') {
                if (typeof originalData[from] !== 'undefined') {
                    transformedData[to] = originalData[from];
                }
                delete originalData[from];
            }
            else if (typeof from === 'object' && 'from' in from) {
                const { from: fromName } = from;
                if (from.list) {
                    if (Array.isArray(originalData[fromName])) {
                        if ('map' in from && from.map) {
                            if (typeof originalData[fromName] === 'object') {
                                transformedData[to] = yield Promise.all(originalData[fromName].map((item) => (0, exports.transformMappedData)(item, from.map)));
                            }
                        }
                        else {
                            transformedData[to] = [...originalData[fromName]];
                        }
                    }
                    else if (originalData[fromName] !== undefined && originalData[fromName] !== null) {
                        transformedData[to] = [originalData[fromName]];
                    }
                }
                else {
                    transformedData[to] = yield (0, exports.transformMappedData)(originalData[fromName], from.map);
                }
                delete originalData[fromName];
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Object.assign(Object.assign({}, transformedData), { _unmappedProperties_: originalData });
});
exports.transformMappedData = transformMappedData;
