"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
describe('convertFromDaysToMilliseconds', () => {
    it('should throw an error when a non number is passed', () => {
        // @ts-expect-error - Testing
        expect(() => (0, converter_1.convertFromDaysToMilliseconds)('90')).toThrow();
    });
    it('should return the value passed when its valid', () => {
        expect((0, converter_1.convertFromDaysToMilliseconds)(85)).toBe(85 * 24 * 60 * 60 * 1000);
    });
    it('should fail if anything but an integer is passed', () => {
        expect(() => (0, converter_1.convertFromDaysToMilliseconds)(85.5)).toThrow();
        expect(() => (0, converter_1.convertFromDaysToMilliseconds)(-2.3)).toThrow();
    });
});
