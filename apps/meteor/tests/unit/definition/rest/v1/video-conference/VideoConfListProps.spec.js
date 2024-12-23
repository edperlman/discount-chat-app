"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('VideoConfListProps (definition/rest/v1)', () => {
    describe('isVideoConfListProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isVideoConfListProps);
        });
        it('should return false when provided anything that is not an VideoConfListProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)(new Error()));
        });
        it('should return false if roomId is not provided to VideoConfListProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)({}));
        });
        it('should accept a roomId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfListProps)({
                roomId: 'roomId',
            }));
        });
        it('should accept the count and offset parameters', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isVideoConfListProps)({
                roomId: 'roomId',
                offset: 50,
                count: 25,
            }));
        });
        it('should return false when extra parameters are provided to VideoConfListProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isVideoConfListProps)({
                roomId: 'roomId',
                extra: 'extra',
            }));
        });
    });
});
