"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validateCustomMessageFields_1 = require("../../../../../../app/lib/server/lib/validateCustomMessageFields");
describe('validateCustomMessageFields', () => {
    describe('When not enabled', () => {
        it('should not allow to pass custom fields', () => {
            const customFields = {
                test: 'test',
            };
            (0, chai_1.expect)(() => (0, validateCustomMessageFields_1.validateCustomMessageFields)({ customFields, messageCustomFieldsEnabled: false, messageCustomFields: '' })).to.throw('Custom fields not enabled');
        });
    });
    describe('When enabled', () => {
        it('should not allow to pass invalid custom fields config', () => {
            const customFields = {
                test: 'test',
            };
            (0, chai_1.expect)(() => (0, validateCustomMessageFields_1.validateCustomMessageFields)({ customFields, messageCustomFieldsEnabled: true, messageCustomFields: '' })).to.throw('Unexpected end of JSON input');
        });
        it('should not allow to pass a property not present in config', () => {
            const customFields = {
                test: 'test',
            };
            const messageCustomFields = JSON.stringify({
                properties: {
                    priority: {
                        type: 'string',
                    },
                },
                additionalProperties: true,
            });
            (0, chai_1.expect)(() => (0, validateCustomMessageFields_1.validateCustomMessageFields)({ customFields, messageCustomFieldsEnabled: true, messageCustomFields })).to.throw('Invalid custom fields');
        });
        it('should not allow to pass an invalid custom field value', () => {
            const customFields = {
                test: 123,
            };
            const messageCustomFields = JSON.stringify({
                properties: {
                    priority: {
                        type: 'string',
                    },
                },
                additionalProperties: true,
            });
            (0, chai_1.expect)(() => (0, validateCustomMessageFields_1.validateCustomMessageFields)({ customFields, messageCustomFieldsEnabled: true, messageCustomFields })).to.throw('Invalid custom fields');
        });
        it('should not allow to pass anything different from an object', () => {
            const customFields = [1, 2];
            const messageCustomFields = JSON.stringify({
                type: 'array',
                items: [{ type: 'integer' }, { type: 'integer' }],
            });
            (0, chai_1.expect)(() => (0, validateCustomMessageFields_1.validateCustomMessageFields)({ customFields, messageCustomFieldsEnabled: true, messageCustomFields })).to.throw('Invalid custom fields config');
        });
        it('should allow to pass a valid custom fields config', () => {
            const customFields = {
                test: 'test',
            };
            const messageCustomFields = JSON.stringify({
                properties: {
                    test: {
                        type: 'string',
                    },
                },
            });
            (0, chai_1.expect)(() => (0, validateCustomMessageFields_1.validateCustomMessageFields)({ customFields, messageCustomFieldsEnabled: true, messageCustomFields })).to.not.throw();
        });
    });
});
