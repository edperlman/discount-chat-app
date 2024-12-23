"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('VideoConfCancelProps (definition/rest/v1)', () => {
    describe('isVideoConfCancelProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isVideoConfCancelProps);
        });
        it('should return false when provided anything that is not an VideoConfCancelProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)(new Error()));
        });
        it('should return false if callId is not provided to VideoConfCancelProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)({}));
        });
        it('should accept a callId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfCancelProps)({
                callId: 'callId',
            }));
        });
        it('should return false when extra parameters are provided to VideoConfCancelProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfCancelProps)({
                callId: 'callId',
                extra: 'extra',
            }));
        });
    });
});
