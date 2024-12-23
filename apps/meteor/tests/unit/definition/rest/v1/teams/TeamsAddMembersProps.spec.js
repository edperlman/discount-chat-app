"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsAddMemberProps (definition/rest/v1)', () => {
    describe('isTeamsAddMembersProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsAddMembersProps);
        });
        it('should return false if the parameter is empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({}));
        });
        it('should return false if teamId is provided but no member was provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({ teamId: '123' }));
        });
        it('should return false if teamName is provided but no member was provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({ teamName: '123' }));
        });
        it('should return false if members is provided but no teamId or teamName were provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({ members: [{ userId: '123' }] }));
        });
        it('should return false if teamName was provided but members are empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({ teamName: '123', members: [] }));
        });
        it('should return false if teamId was provided but members are empty', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({ teamId: '123', members: [] }));
        });
        it('should return false if members with role is provided but no teamId or teamName were provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({ members: [{ userId: '123', roles: ['123'] }] }));
        });
        it('should return true if members is provided and teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsAddMembersProps)({ members: [{ userId: '123' }], teamId: '123' }));
        });
        it('should return true if members is provided and teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsAddMembersProps)({ members: [{ userId: '123' }], teamName: '123' }));
        });
        it('should return true if members with role is provided and teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsAddMembersProps)({ members: [{ userId: '123', roles: ['123'] }], teamId: '123' }));
        });
        it('should return true if members with role is provided and teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsAddMembersProps)({ members: [{ userId: '123', roles: ['123'] }], teamName: '123' }));
        });
        it('should return false if teamName was provided and members contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({
                teamName: '123',
                members: [{ userId: '123', roles: ['123'], invalid: true }],
            }));
        });
        it('should return false if teamId was provided and members contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({
                teamId: '123',
                members: [{ userId: '123', roles: ['123'], invalid: true }],
            }));
        });
        it('should return false if teamName informed but contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({
                member: [{ userId: '123', roles: ['123'] }],
                teamName: '123',
                invalid: true,
            }));
        });
        it('should return false if teamId informed but contains an invalid property', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsAddMembersProps)({
                member: [{ userId: '123', roles: ['123'] }],
                teamId: '123',
                invalid: true,
            }));
        });
    });
});
