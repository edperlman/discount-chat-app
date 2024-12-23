"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('VideoConfInfoProps (definition/rest/v1)', () => {
    describe('isVideoConfInfoProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isVideoConfInfoProps);
        });
        it('should return false when provided anything that is not an VideoConfInfoProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)(new Error()));
        });
        it('should return false if callId is not provided to VideoConfInfoProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)({}));
        });
        it('should accept a callId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfInfoProps)({
                callId: 'callId',
            }));
        });
        it('should return false when extra parameters are provided to VideoConfInfoProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfInfoProps)({
                callId: 'callId',
                extra: 'extra',
            }));
        });
    });
});
