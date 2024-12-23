"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const projectionAllowsAttribute_1 = require("./projectionAllowsAttribute");
describe('projectionAllowsAttribute', () => {
    it('should return true if there are no options', () => {
        (0, chai_1.expect)((0, projectionAllowsAttribute_1.projectionAllowsAttribute)('attributeName')).to.be.equal(true);
    });
    it('should return true if there is no projection', () => {
        (0, chai_1.expect)((0, projectionAllowsAttribute_1.projectionAllowsAttribute)('attributeName', {})).to.be.equal(true);
    });
    it('should return true if the field is projected', () => {
        (0, chai_1.expect)((0, projectionAllowsAttribute_1.projectionAllowsAttribute)('attributeName', { projection: { attributeName: 1 } })).to.be.equal(true);
    });
    it('should return false if the field is disallowed by projection', () => {
        (0, chai_1.expect)((0, projectionAllowsAttribute_1.projectionAllowsAttribute)('attributeName', { projection: { attributeName: 0 } })).to.be.equal(false);
    });
    it('should return false if the field is not projected and others are', () => {
        (0, chai_1.expect)((0, projectionAllowsAttribute_1.projectionAllowsAttribute)('attributeName', { projection: { anotherAttribute: 1 } })).to.be.equal(false);
    });
    it('should return true if the field is not projected and others are disallowed', () => {
        (0, chai_1.expect)((0, projectionAllowsAttribute_1.projectionAllowsAttribute)('attributeName', { projection: { anotherAttribute: 0 } })).to.be.equal(true);
    });
});
