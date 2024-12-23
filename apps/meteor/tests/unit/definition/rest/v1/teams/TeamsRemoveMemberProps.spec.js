"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('Teams (definition/rest/v1)', () => {
    describe('isTeamsRemoveMemberProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsRemoveMemberProps);
        });
        it('should return false if parameter is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({}));
        });
        it('should return false if teamId is is informed but missing userId', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId' }));
        });
        it('should return false if teamName is is informed but missing userId', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamName: 'teamName' }));
        });
        it('should return true if teamId and userId are informed', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId', userId: 'userId' }));
        });
        it('should return true if teamName and userId are informed', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamName: 'teamName', userId: 'userId' }));
        });
        it('should return false if teamName and userId are informed but rooms are empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamName: 'teamName', userId: 'userId', rooms: [] }));
        });
        it('should return true if teamName and userId are informed but rooms are undefined', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamName: 'teamName', userId: 'userId', rooms: undefined }));
        });
        it('should return false if teamId and userId are informed and rooms are empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId', userId: 'userId', rooms: [] }));
        });
        it('should return true if teamId and userId are informed but rooms are undefined', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId', userId: 'userId', rooms: undefined }));
        });
        it('should return false if teamId and userId are informed but rooms are empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId', userId: 'userId', rooms: [] }));
        });
        it('should return true if teamId and userId are informed and rooms are informed', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId', userId: 'userId', rooms: ['room'] }));
        });
        it('should return false if teamId and userId are informed and rooms are informed but rooms is not an array of strings', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({ teamId: 'teamId', userId: 'userId', rooms: [123] }));
        });
        it('should return false if teamName and userId are informed and rooms are informed but there is an extra property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({
                teamName: 'teamName',
                userId: 'userId',
                rooms: ['room'],
                extra: 'extra',
            }));
        });
        it('should return false if teamId and userId are informed and rooms are informed but there is an extra property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({
                teamId: 'teamId',
                userId: 'userId',
                rooms: ['room'],
                extra: 'extra',
            }));
        });
        it('should return false if teamName and userId are informed and rooms are informed but there is an extra property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsRemoveMemberProps)({
                teamName: 'teamName',
                userId: 'userId',
                rooms: ['room'],
                extra: 'extra',
            }));
        });
    });
});
