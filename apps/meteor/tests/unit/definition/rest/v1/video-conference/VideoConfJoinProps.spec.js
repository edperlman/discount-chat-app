"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('VideoConfJoinProps (definition/rest/v1)', () => {
    describe('isVideoConfJoinProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isVideoConfJoinProps);
        });
        it('should return false when provided anything that is not an VideoConfJoinProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)(new Error()));
        });
        it('should return false if callId is not provided to VideoConfJoinProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)({}));
        });
        it('should accept a callId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfJoinProps)({
                callId: 'callId',
            }));
        });
        it('should return false when provided with an invalid state', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)({ callId: 'callId', state: 123 }));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)({ callId: 'callId', state: [] }));
        });
        it('should return false when extra parameters are provided to VideoConfJoinProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfJoinProps)({
                callId: 'callId',
                extra: 'extra',
            }));
        });
    });
});
