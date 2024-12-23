"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getLoginExpiration_1 = require("./getLoginExpiration");
describe('getLoginExpirationInDays', () => {
    it('should return 90 by default', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)()).toBe(90);
    });
    it('should return 90 when value is 0', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)(0)).toBe(90);
    });
    it('should return 90 when value is NaN', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)(NaN)).toBe(90);
    });
    it('should return 90 when value is negative', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)(-1)).toBe(90);
    });
    it('should return 90 when value is undefined', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)(undefined)).toBe(90);
    });
    it('should return 90 when value is not a number', () => {
        // @ts-expect-error - Testing
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)('90')).toBe(90);
    });
    it('should return the value passed when its valid', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInDays)(85)).toBe(85);
    });
});
describe('getLoginExpirationInMs', () => {
    it('should return 90 days in milliseconds when no value is passed', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInMs)()).toBe(90 * 24 * 60 * 60 * 1000);
    });
    it('should return the value passed when its valid', () => {
        expect((0, getLoginExpiration_1.getLoginExpirationInMs)(85)).toBe(85 * 24 * 60 * 60 * 1000);
    });
});
