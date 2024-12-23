"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('FederationJoinExternalPublicRoomProps (definition/rest/v1)', () => {
    describe('isFederationJoinExternalPublicRoomProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isFederationJoinExternalPublicRoomProps);
        });
        it('should return false when provided anything that is not an FederationJoinExternalPublicRoomProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)(new Error()));
        });
        it('should return false if externalRoomId is not provided to FederationJoinExternalPublicRoomProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)({}));
        });
        it('should return false if externalRoomId was provided in the wrong format FederationJoinExternalPublicRoomProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)({
                externalRoomId: 'wrongFormatId',
            }));
        });
        it('should accept a externalRoomId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)({
                externalRoomId: '!externalRoomId:server.com',
            }));
        });
        it('should return false when extra parameters are provided to FederationJoinExternalPublicRoomProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationJoinExternalPublicRoomProps)({
                externalRoomId: '!externalRoomId:server.com',
                extra: 'extra',
            }));
        });
    });
});
