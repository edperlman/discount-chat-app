"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsUpdateMemberProps (definition/rest/v1)', () => {
    describe('isTeamsUpdateMemberProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsUpdateMemberProps);
        });
        it('should return false if the parameter is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({}));
        });
        it('should return false if teamId is provided but no member was provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({ teamId: '123' }));
        });
        it('should return false if teamName is provided but no member was provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({ teamName: '123' }));
        });
        it('should return false if member is provided but no teamId or teamName were provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123' } }));
        });
        it('should return false if member with role is provided but no teamId or teamName were provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123', roles: ['123'] } }));
        });
        it('should return true if member is provided and teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123' }, teamId: '123' }));
        });
        it('should return true if member is provided and teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123' }, teamName: '123' }));
        });
        it('should return true if member with role is provided and teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123', roles: ['123'] }, teamId: '123' }));
        });
        it('should return true if member with role is provided and teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123', roles: ['123'] }, teamName: '123' }));
        });
        it('should return false if teamName was provided and member contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123', invalid: '123' }, teamName: '123' }));
        });
        it('should return false if teamId was provided and member contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({ member: { userId: '123', invalid: '123' }, teamId: '123' }));
        });
        it('should return false if contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateMemberProps)({
                member: { userId: '123', roles: ['123'] },
                teamName: '123',
                invalid: true,
            }));
        });
    });
});
