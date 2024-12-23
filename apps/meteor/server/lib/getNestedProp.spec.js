"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const getNestedProp_1 = require("./getNestedProp");
describe('LDAP getNestedProp', () => {
    it('should find shallow values', () => {
        const customFields = {
            foo: 'bar',
        };
        (0, chai_1.expect)((0, getNestedProp_1.getNestedProp)(customFields, 'foo')).to.equal('bar');
    });
    it('should find deep values', () => {
        const customFields = {
            foo: {
                bar: 'baz',
            },
        };
        (0, chai_1.expect)((0, getNestedProp_1.getNestedProp)(customFields, 'foo.bar')).to.equal('baz');
    });
});
