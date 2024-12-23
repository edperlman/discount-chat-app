"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsLeaveProps (definition/rest/v1)', () => {
    describe('isTeamsLeaveProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsLeaveProps);
        });
        it('should return false if neither teamName or teamId is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({}));
        });
        it('should return true if teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId' }));
        });
        it('should return true if teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName' }));
        });
        it('should return false if teamId and roomsToRemove are provided, but roomsToRemove is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId', rooms: [] }));
        });
        it('should return true if teamId are provided, but rooms are undefined', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId', rooms: undefined }));
        });
        it('should return false if teamName and rooms are provided, but rooms is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName', rooms: [] }));
        });
        it('should return true if teamName are provided, but rooms are undefined', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName', rooms: undefined }));
        });
        it('should return true if teamId and rooms are provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId', rooms: ['roomId'] }));
        });
        it('should return true if teamName and rooms are provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName', rooms: ['roomId'] }));
        });
        it('should return false if teamId and rooms are provided, but rooms is not an array', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId', rooms: {} }));
        });
        it('should return false if teamName and rooms are provided, but rooms is not an array', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName', rooms: {} }));
        });
        it('should return false if teamId and rooms are provided, but rooms is not an array of strings', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId', rooms: [1] }));
        });
        it('should return false if teamName and rooms are provided, but rooms is not an array of strings', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName', rooms: [1] }));
        });
        it('should return false if teamName and rooms are provided but an extra property is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamName: 'teamName', rooms: ['rooms'], extra: 'extra' }));
        });
        it('should return false if teamId and rooms are provided but an extra property is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsLeaveProps)({ teamId: 'teamId', rooms: ['rooms'], extra: 'extra' }));
        });
    });
});
