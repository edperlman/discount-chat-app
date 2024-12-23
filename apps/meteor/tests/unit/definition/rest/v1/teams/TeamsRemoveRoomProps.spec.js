"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsRemoveRoomProps (definition/rest/v1)', () => {
    describe('isTeamsRemoveRoomProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsRemoveRoomProps);
        });
        it('should return false if roomId is not provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveRoomProps)({}));
        });
        it('should return false if roomId is provided but no teamId or teamName were provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveRoomProps)({ roomId: 'roomId' }));
        });
        it('should return false if roomId is provided and teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveRoomProps)({ roomId: 'roomId', teamId: 'teamId' }));
        });
        it('should return true if roomId is provided and teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveRoomProps)({ roomId: 'roomId', teamName: 'teamName' }));
        });
        it('should return false if roomId and teamName are provided but an additional property is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveRoomProps)({ roomId: 'roomId', teamName: 'teamName', foo: 'bar' }));
        });
    });
});
