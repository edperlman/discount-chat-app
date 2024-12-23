"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lookups_1 = require("./lookups");
describe('createLookupFunction', () => {
    it('should work', () => {
        expect((0, lookups_1.createLookupFunction)('a.x')({ a: { x: 1 } })).toStrictEqual([1]);
        expect((0, lookups_1.createLookupFunction)('a.x')({ a: { x: [1] } })).toStrictEqual([[1]]);
        expect((0, lookups_1.createLookupFunction)('a.x')({ a: 5 })).toStrictEqual([undefined]);
        expect((0, lookups_1.createLookupFunction)('a.x')({ a: [{ x: 1 }, { x: [2] }, { y: 3 }] })).toStrictEqual([1, [2], undefined]);
    });
});
