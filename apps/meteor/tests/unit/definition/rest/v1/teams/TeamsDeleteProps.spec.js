"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsDeleteProps (definition/rest/v1)', () => {
    describe('isTeamsDeleteProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsDeleteProps);
        });
        it('should return false if neither teamName or teamId is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({}));
        });
        it('should return true if teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsDeleteProps)({ teamId: 'teamId' }));
        });
        it('should return true if teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsDeleteProps)({ teamName: 'teamName' }));
        });
        it('should return false if teamId and roomsToRemove are provided, but roomsToRemove is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamId: 'teamId', roomsToRemove: [] }));
        });
        it('should return false if teamName and roomsToRemove are provided, but roomsToRemove is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamName: 'teamName', roomsToRemove: [] }));
        });
        it('should return true if teamId and roomsToRemove are provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsDeleteProps)({ teamId: 'teamId', roomsToRemove: ['roomId'] }));
        });
        it('should return true if teamName and roomsToRemove are provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsDeleteProps)({ teamName: 'teamName', roomsToRemove: ['roomId'] }));
        });
        it('should return false if teamId and roomsToRemove are provided, but roomsToRemove is not an array', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamId: 'teamId', roomsToRemove: {} }));
        });
        it('should return false if teamName and roomsToRemove are provided, but roomsToRemove is not an array', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamName: 'teamName', roomsToRemove: {} }));
        });
        it('should return false if teamId and roomsToRemove are provided, but roomsToRemove is not an array of strings', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamId: 'teamId', roomsToRemove: [1] }));
        });
        it('should return false if teamName and roomsToRemove are provided, but roomsToRemove is not an array of strings', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamName: 'teamName', roomsToRemove: [1] }));
        });
        it('should return false if teamName and rooms are provided but an extra property is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({
                teamName: 'teamName',
                roomsToRemove: ['roomsToRemove'],
                extra: 'extra',
            }));
        });
        it('should return false if teamId and rooms are provided but an extra property is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsDeleteProps)({ teamId: 'teamId', roomsToRemove: ['roomsToRemove'], extra: 'extra' }));
        });
    });
});
