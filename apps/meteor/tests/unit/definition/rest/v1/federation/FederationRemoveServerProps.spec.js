"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('FederationRemoveServerProps (definition/rest/v1)', () => {
    describe('isFederationRemoveServerProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isFederationRemoveServerProps);
        });
        it('should return false when provided anything that is not an FederationRemoveServerProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)(new Error()));
        });
        it('should return false if serverName is not provided to FederationRemoveServerProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)({}));
        });
        it('should accept a serverName with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isFederationRemoveServerProps)({
                serverName: 'serverName',
            }));
        });
        it('should return false when extra parameters are provided to FederationRemoveServerProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationRemoveServerProps)({
                serverName: 'serverName',
                extra: 'extra',
            }));
        });
    });
});
