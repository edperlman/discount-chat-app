"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
describe('String utils', () => {
    it('should return an empty string when the specified string is empty', () => {
        (0, chai_1.expect)((0, stringUtils_1.truncate)('', 10)).to.be.equal('');
    });
    it('should truncate a larger string', () => {
        (0, chai_1.expect)((0, stringUtils_1.truncate)('this text has a few words', 9)).to.be.equal('this t...');
    });
    it('should not truncate a smaller string', () => {
        (0, chai_1.expect)((0, stringUtils_1.truncate)('this', 9)).to.be.equal('this');
    });
    it('should not truncate a string with the exact length', () => {
        (0, chai_1.expect)((0, stringUtils_1.truncate)('this', 4)).to.be.equal('this');
    });
});
