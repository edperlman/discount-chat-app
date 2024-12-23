"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('VideoConfStartProps (definition/rest/v1)', () => {
    describe('isVideoConfStartProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isVideoConfStartProps);
        });
        it('should return false when provided anything that is not an VideoConfStartProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)(new Error()));
        });
        it('should return false if roomId is not provided to VideoConfStartProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)({}));
        });
        it('should accept a roomId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfStartProps)({
                roomId: 'roomId',
            }));
        });
        it('should accept the allowRinging parameter', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfStartProps)({
                roomId: 'roomId',
                allowRinging: true,
            }));
        });
        it('should accept a roomId with a title', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfStartProps)({
                roomId: 'roomId',
                title: 'extra',
            }));
        });
        it('should return false when extra parameters are provided to VideoConfStartProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfStartProps)({
                roomId: 'roomId',
                extra: 'extra',
            }));
        });
    });
});
