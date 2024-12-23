"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('FederationPublicRoomProps (definition/rest/v1)', () => {
    describe('isFederationSearchPublicRoomsProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isFederationSearchPublicRoomsProps);
        });
        it('should return false when provided anything that is not an FederationPublicRoomProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationSearchPublicRoomsProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isFederationSearchPublicRoomsProps)(123));
        });
        it('should accept a externalRoomId with nothing else', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isFederationSearchPublicRoomsProps)({
                serverName: 'server',
                roomName: 'roomName',
                count: '1',
                pageToken: 'token',
            }));
        });
        it('should return false when extra parameters are provided to FederationPublicRoomProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isFederationSearchPublicRoomsProps)({
                serverName: 'server',
                roomName: 'roomName',
                count: '1',
                pageToken: 'token',
                extra: 'extra',
            }));
        });
    });
});
