"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('FederationAddServerProps (definition/rest/v1)', () => {
    describe('isFederationAddServerProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isFederationAddServerProps);
        });
        it('should return false when provided anything that is not an FederationAddServerProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)(new Error()));
        });
        it('should return false if serverName is not provided to FederationAddServerProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)({}));
        });
        it('should accept a serverName with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isFederationAddServerProps)({
                serverName: 'serverName',
            }));
        });
        it('should return false when extra parameters are provided to FederationAddServerProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationAddServerProps)({
                serverName: 'serverName',
                extra: 'extra',
            }));
        });
    });
});
