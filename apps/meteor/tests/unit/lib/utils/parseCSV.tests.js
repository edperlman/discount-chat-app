"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const parseCSV_1 = require("../../../../lib/utils/parseCSV");
describe('Parse CSV', () => {
    it('should return an empty array for an empty string', () => {
        const result = (0, parseCSV_1.parseCSV)('');
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(0);
    });
    it('should return an array with one item', () => {
        const value = 'value';
        const result = (0, parseCSV_1.parseCSV)(value);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(1).and.eql([value]);
    });
    it('should trim surrounding spaces', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const csv = `${value1}, ${value2}`;
        const result = (0, parseCSV_1.parseCSV)(csv);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2).and.eql([value1, value2]);
    });
    it('should ignore empty items', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const csv = `${value1}, , , , ${value2}`;
        const result = (0, parseCSV_1.parseCSV)(csv);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2).and.eql([value1, value2]);
    });
    it('should not ignore empty items when requested', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const csv = `${value1}, , ${value2}`;
        const result = (0, parseCSV_1.parseCSV)(csv, false);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3).and.eql([value1, '', value2]);
    });
});
