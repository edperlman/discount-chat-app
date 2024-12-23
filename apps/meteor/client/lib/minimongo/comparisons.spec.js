"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparisons_1 = require("./comparisons");
describe('equals', () => {
    it('should return true if two numbers are equal', () => {
        expect((0, comparisons_1.equals)(1, 1)).toBe(true);
    });
    it('should return false if arguments are null or undefined', () => {
        expect((0, comparisons_1.equals)(undefined, null)).toBe(false);
        expect((0, comparisons_1.equals)(null, undefined)).toBe(false);
    });
    it('should return false if arguments arent objects and they are not the same', () => {
        expect((0, comparisons_1.equals)('not', 'thesame')).toBe(false);
    });
    it('should return true if date objects provided have the same value', () => {
        const currentDate = new Date();
        expect((0, comparisons_1.equals)(currentDate, currentDate)).toBe(true);
    });
    it('should return true if 2 equal UInt8Array are provided', () => {
        const arr1 = new Uint8Array([1, 2]);
        const arr2 = new Uint8Array([1, 2]);
        expect((0, comparisons_1.equals)(arr1, arr2)).toBe(true);
    });
    it('should return true if 2 equal arrays are provided', () => {
        const arr1 = [1, 2, 4];
        const arr2 = [1, 2, 4];
        expect((0, comparisons_1.equals)(arr1, arr2)).toBe(true);
    });
    it('should return false if 2 arrays with different length are provided', () => {
        const arr1 = [1, 4, 5];
        const arr2 = [1, 4, 5, 7];
        expect((0, comparisons_1.equals)(arr1, arr2)).toBe(false);
    });
    it('should return true if the objects provided are "equal"', () => {
        const obj = { a: 1 };
        const obj2 = obj;
        expect((0, comparisons_1.equals)(obj, obj2)).toBe(true);
    });
    it('should return true if both objects have the same keys', () => {
        const obj = { a: 1 };
        const obj2 = { a: 1 };
        expect((0, comparisons_1.equals)(obj, obj2)).toBe(true);
    });
});
describe('isObject', () => {
    it('should return true if value is an object or function', () => {
        const obj = {};
        const func = (a) => a;
        expect((0, comparisons_1.isObject)(obj)).toBe(true);
        expect((0, comparisons_1.isObject)(func)).toBe(true);
    });
    it('should return false for other data types', () => {
        expect((0, comparisons_1.isObject)(1)).toBe(false);
        expect((0, comparisons_1.isObject)(true)).toBe(false);
        expect((0, comparisons_1.isObject)('212')).toBe(false);
    });
});
describe('flatSome', () => {
    it('should run .some on array', () => {
        const arr = [1, 2, 4, 6, 9];
        const isEven = (v) => v % 2 === 0;
        expect((0, comparisons_1.flatSome)(arr, isEven)).toBe(true);
    });
    it('should run the function on the value when its not an array', () => {
        const val = 1;
        const isEven = (v) => v % 2 === 0;
        expect((0, comparisons_1.flatSome)(val, isEven)).toBe(false);
    });
});
describe('some', () => {
    it('should run .some on array', () => {
        const arr = [1, 2, 4, 6, 9];
        const isEven = (v) => {
            if (Array.isArray(v)) {
                return false;
            }
            return v % 2 === 0;
        };
        expect((0, comparisons_1.some)(arr, isEven)).toBe(true);
    });
    it('should run the function on the value when its not an array', () => {
        const val = 1;
        const isEven = (v) => {
            if (Array.isArray(v)) {
                return false;
            }
            return v % 2 === 0;
        };
        expect((0, comparisons_1.some)(val, isEven)).toBe(false);
    });
});
describe('isEmptyArray', () => {
    it('should return true if array is empty', () => {
        expect((0, comparisons_1.isEmptyArray)([])).toBe(true);
    });
    it('should return false if value is not an array', () => {
        expect((0, comparisons_1.isEmptyArray)(1)).toBe(false);
    });
    it('should return false if array is not empty', () => {
        expect((0, comparisons_1.isEmptyArray)([1, 2])).toBe(false);
    });
});
