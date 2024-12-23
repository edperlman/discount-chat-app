"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertTimeUnit_1 = require("./convertTimeUnit");
describe('timeUnitToMs function', () => {
    it('should correctly convert days to milliseconds', () => {
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, 1)).toBe(86400000);
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, 2)).toBe(172800000);
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, 0.5)).toBe(43200000);
    });
    it('should correctly convert hours to milliseconds', () => {
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.hours, 1)).toBe(3600000);
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.hours, 2)).toBe(7200000);
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.hours, 0.5)).toBe(1800000);
    });
    it('should correctly convert minutes to milliseconds', () => {
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.minutes, 1)).toBe(60000);
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.minutes, 2)).toBe(120000);
        expect((0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.minutes, 0.5)).toBe(30000);
    });
    it('should throw an error for invalid time units', () => {
        expect(() => (0, convertTimeUnit_1.timeUnitToMs)('invalidUnit', 1)).toThrow('timeUnitToMs - invalid time unit');
    });
    it('should throw an error for invalid timespan', () => {
        const errorMessage = 'timeUnitToMs - invalid timespan';
        expect(() => (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, NaN)).toThrow(errorMessage);
        expect(() => (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, Infinity)).toThrow(errorMessage);
        expect(() => (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, -Infinity)).toThrow(errorMessage);
        expect(() => (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, -1)).toThrow(errorMessage);
    });
});
describe('msToTimeUnit function', () => {
    it('should correctly convert milliseconds to days', () => {
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, 86400000)).toBe(1); // 1 day
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, 172800000)).toBe(2); // 2 days
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, 43200000)).toBe(0.5); // .5 days
    });
    it('should correctly convert milliseconds to hours', () => {
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.hours, 3600000)).toBe(1); // 1 hour
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.hours, 7200000)).toBe(2); // 2 hours
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.hours, 1800000)).toBe(0.5); // .5 hours
    });
    it('should correctly convert milliseconds to minutes', () => {
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.minutes, 60000)).toBe(1); // 1 min
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.minutes, 120000)).toBe(2); // 2 min
        expect((0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.minutes, 30000)).toBe(0.5); // .5 min
    });
    it('should throw an error for invalid time units', () => {
        expect(() => (0, convertTimeUnit_1.msToTimeUnit)('invalidUnit', 1)).toThrow('msToTimeUnit - invalid time unit');
    });
    it('should throw an error for invalid timespan', () => {
        const errorMessage = 'msToTimeUnit - invalid timespan';
        expect(() => (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, NaN)).toThrow(errorMessage);
        expect(() => (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, Infinity)).toThrow(errorMessage);
        expect(() => (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, -Infinity)).toThrow(errorMessage);
        expect(() => (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, -1)).toThrow(errorMessage);
    });
});
