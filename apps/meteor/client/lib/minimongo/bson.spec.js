"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("./bson");
describe('getBSONType', () => {
    it('should work', () => {
        expect((0, bson_1.getBSONType)(1)).toBe(1 /* BSONType.Double */);
        expect((0, bson_1.getBSONType)('xyz')).toBe(2 /* BSONType.String */);
        expect((0, bson_1.getBSONType)({})).toBe(3 /* BSONType.Object */);
        expect((0, bson_1.getBSONType)([])).toBe(4 /* BSONType.Array */);
        expect((0, bson_1.getBSONType)(new Uint8Array())).toBe(5 /* BSONType.BinData */);
        expect((0, bson_1.getBSONType)(undefined)).toBe(3 /* BSONType.Object */);
        expect((0, bson_1.getBSONType)(null)).toBe(10 /* BSONType.Null */);
        expect((0, bson_1.getBSONType)(false)).toBe(8 /* BSONType.Boolean */);
        expect((0, bson_1.getBSONType)(/.*/)).toBe(11 /* BSONType.Regex */);
        expect((0, bson_1.getBSONType)(() => true)).toBe(13 /* BSONType.JavaScript */);
        expect((0, bson_1.getBSONType)(new Date(0))).toBe(9 /* BSONType.Date */);
    });
});
describe('compareBSONValues', () => {
    it('should work for the same types', () => {
        expect((0, bson_1.compareBSONValues)(2, 3)).toBe(-1);
        expect((0, bson_1.compareBSONValues)('xyz', 'abc')).toBe(1);
        expect((0, bson_1.compareBSONValues)({}, {})).toBe(0);
        expect((0, bson_1.compareBSONValues)(true, false)).toBe(1);
        expect((0, bson_1.compareBSONValues)(new Date(0), new Date(1))).toBe(-1);
    });
    it('should work for different types', () => {
        expect((0, bson_1.compareBSONValues)(2, null)).toBe(1);
        expect((0, bson_1.compareBSONValues)('xyz', {})).toBe(-1);
        expect((0, bson_1.compareBSONValues)(false, 3)).toBe(1);
    });
});
