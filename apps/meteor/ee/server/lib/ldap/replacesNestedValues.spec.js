"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const replacesNestedValues_1 = require("./replacesNestedValues");
describe('LDAP replacesNestedValues', () => {
    it('should replace shallow values', () => {
        const result = (0, replacesNestedValues_1.replacesNestedValues)({
            a: 1,
        }, 'a', 2);
        (0, chai_1.expect)(result).to.eql({
            a: 2,
        });
    });
    it('should replace undefined values', () => {
        const result = (0, replacesNestedValues_1.replacesNestedValues)({}, 'a', 2);
        (0, chai_1.expect)(result).to.eql({
            a: 2,
        });
    });
    it('should replace nested values', () => {
        const result = (0, replacesNestedValues_1.replacesNestedValues)({
            a: {
                b: 1,
            },
        }, 'a.b', 2);
        (0, chai_1.expect)(result).to.eql({
            a: {
                b: 2,
            },
        });
    });
    it('should replace undefined nested values', () => {
        const result = (0, replacesNestedValues_1.replacesNestedValues)({
            a: {},
        }, 'a.b', 2);
        (0, chai_1.expect)(result).to.eql({
            a: {
                b: 2,
            },
        });
    });
    it('should fail if the value being replaced is not an object', () => {
        (0, chai_1.expect)(() => (0, replacesNestedValues_1.replacesNestedValues)({
            a: [],
        }, 'a.b', 2)).to.throw();
        (0, chai_1.expect)(() => (0, replacesNestedValues_1.replacesNestedValues)({
            a: 1,
        }, 'a.b', 2)).to.throw();
        (0, chai_1.expect)(() => (0, replacesNestedValues_1.replacesNestedValues)({
            a: { b: [] },
        }, 'a.b', 2)).to.throw();
    });
});
