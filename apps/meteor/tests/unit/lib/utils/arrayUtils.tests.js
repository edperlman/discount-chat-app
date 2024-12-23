"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const arrayUtils_1 = require("../../../../lib/utils/arrayUtils");
describe('Array utils', () => {
    it('should return an array with one item', () => {
        const value = 'value';
        const result = (0, arrayUtils_1.ensureArray)(value);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(1).and.eql([value]);
    });
    it('should return a new array with the same items', () => {
        const value = ['value1', 'value2'];
        const result = (0, arrayUtils_1.ensureArray)(value);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2).and.eql(value).and.not.equal(value);
    });
});
