"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validateSetting_1 = require("../../../../../../app/settings/server/functions/validateSetting");
describe('validateSettings', () => {
    it('should validate the type string', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'string', 'value')).to.not.throw();
    });
    it('should throw an error expecting string receiving int', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'string', 10)).to.throw();
    });
    it('should validate the type int', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'int', 10)).to.not.throw();
    });
    it('should throw an error expecting int receiving string', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'int', '10')).to.throw();
    });
    it('should validate the type boolean', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'boolean', true)).to.not.throw();
    });
    it('should throw an error expecting boolean receiving string', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'boolean', 'true')).to.throw();
    });
    it('should validate the type date', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'date', new Date())).to.not.throw();
    });
    it('should throw an error expecting date receiving string', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'date', '2019-01-01')).to.throw();
    });
    it('should validate the type multiSelect', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'multiSelect', [])).to.not.throw();
    });
    it('should throw an error expecting multiSelect receiving string', () => {
        (0, chai_1.expect)(() => (0, validateSetting_1.validateSetting)('test', 'multiSelect', '[]')).to.throw();
    });
});
