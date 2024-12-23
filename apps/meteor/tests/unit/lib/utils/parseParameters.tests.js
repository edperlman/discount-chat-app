"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const parseParameters_1 = require("../../../../lib/utils/parseParameters");
describe('Parse Parameters', () => {
    it('should return an empty array for an empty string', () => {
        const result = (0, parseParameters_1.parseParameters)('');
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(0);
    });
    it('should return an array with one item', () => {
        const value = 'value';
        const result = (0, parseParameters_1.parseParameters)(value);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(1).and.eql([value]);
    });
    it('should return an array with three items', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const value3 = 'value3';
        const parameters = `${value1} ${value2} ${value3}`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3).and.eql([value1, value2, value3]);
    });
    it('should ignore extra spaces by default', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const parameters = `     ${value1}      ${value2}    `;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2).and.eql([value1, value2]);
    });
    it('should NOT ignore extra spaces when requested', () => {
        const value1 = '';
        const value2 = '';
        const value3 = 'value3';
        const value4 = '';
        const value5 = '';
        const value6 = 'value6';
        const value7 = '';
        const value8 = '';
        const parameters = `${value1} ${value2} ${value3} ${value4} ${value5} ${value6} ${value7} ${value8}`;
        const result = (0, parseParameters_1.parseParameters)(parameters, false);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(8).and.eql([value1, value2, value3, value4, value5, value6, value7, value8]);
    });
    it('should return an array with one item without quotes', () => {
        const value = 'value';
        const result = (0, parseParameters_1.parseParameters)(`"${value}"`);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(1).and.eql([value]);
    });
    it('should return an array with three items without quotes', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const value3 = 'value3';
        const result = (0, parseParameters_1.parseParameters)(`"${value1}" "${value2}" "${value3}"`);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3).and.eql([value1, value2, value3]);
    });
    it('should not trim spaces inside quotes', () => {
        const value1 = 'value1 ';
        const value2 = '   value2';
        const value3 = '   value3     ';
        const parameters = `"${value1}" "${value2}" "${value3}"`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3).and.eql([value1, value2, value3]);
    });
    it('should split parameters even without spaces', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const value3 = 'value3';
        const value4 = 'value4';
        const parameters = `"${value1}""${value2}""${value3}" "${value4}"`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(4).and.eql([value1, value2, value3, value4]);
    });
    it('should split parameters by both spaces and quotes in the same line', () => {
        const value1 = 'value1';
        const value2 = 'value2';
        const parameters = `"${value1}" ${value2}`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2).and.eql([value1, value2]);
    });
    it('should unescape quotes inside values', () => {
        const value1 = `this is \\"value1\\" here`;
        const value2 = `\\"value2\\"`;
        const parameters = `"${value1}" "${value2}"`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2);
        (0, chai_1.expect)(result[0]).to.be.equal(value1.replace(/\\\"/g, '"'));
        (0, chai_1.expect)(result[1]).to.be.equal(value2.replace(/\\\"/g, '"'));
    });
    it('should not ignore empty quoted parameters', () => {
        const value1 = 'value1';
        const value2 = '';
        const value3 = 'value3';
        const parameters = `"${value1}" "${value2}" "${value3}"`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3).and.eql([value1, value2, value3]);
    });
    it('should accept line breaks inside quotes', () => {
        const value1 = `value1
		is multiline`;
        const value2 = 'value2\nhas a multine too';
        const value3 = 'value3\rhas a carriage return';
        const parameters = `"${value1}" "${value2}" "${value3}"`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3);
        (0, chai_1.expect)(result[0]).to.be.equal(value1);
        (0, chai_1.expect)(result[1]).to.be.equal(value2);
        (0, chai_1.expect)(result[2]).to.be.equal(value3);
    });
    it('should split on line breaks without quotes', () => {
        const value1 = `value1`;
        const value2 = 'value2';
        const value3 = 'value3';
        const parameters = `${value1}
${value2}
${value3}`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3);
        (0, chai_1.expect)(result[0]).to.be.equal(value1);
        (0, chai_1.expect)(result[1]).to.be.equal(value2);
        (0, chai_1.expect)(result[2]).to.be.equal(value3);
    });
    it('should accept tabs inside quotes', () => {
        const value1 = `value1		is tabbed`;
        const value2 = 'value2';
        const parameters = `"${value1}" "${value2}"`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(2);
        (0, chai_1.expect)(result[0]).to.be.equal(value1);
        (0, chai_1.expect)(result[1]).to.be.equal(value2);
    });
    it('should split on tabs without quotes', () => {
        const value1 = `value1`;
        const value2 = 'value2';
        const value3 = 'value3';
        const parameters = `${value1}		${value2}	${value3}`;
        const result = (0, parseParameters_1.parseParameters)(parameters);
        (0, chai_1.expect)(result).to.be.an('Array').with.lengthOf(3);
        (0, chai_1.expect)(result[0]).to.be.equal(value1);
        (0, chai_1.expect)(result[1]).to.be.equal(value2);
        (0, chai_1.expect)(result[2]).to.be.equal(value3);
    });
});
