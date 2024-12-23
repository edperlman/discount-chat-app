"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsConvertToChannelProps (definition/rest/v1)', () => {
    describe('isTeamsConvertToChannelProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsConvertToChannelProps);
        });
        it('should return false if neither teamName or teamId is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsConvertToChannelProps)({}));
        });
        it('should return true if teamName is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsConvertToChannelProps)({ teamName: 'teamName' }));
        });
        it('should return true if teamId is provided', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsConvertToChannelProps)({ teamId: 'teamId' }));
        });
        it('should return false if both teamName and teamId are provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsConvertToChannelProps)({ teamName: 'teamName', teamId: 'teamId' }));
        });
        it('should return false if teamName is not a string', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsConvertToChannelProps)({ teamName: 1 }));
        });
        it('should return false if teamId is not a string', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsConvertToChannelProps)({ teamId: 1 }));
        });
        it('should return false if an additionalProperties is provided', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsConvertToChannelProps)({
                teamName: 'teamName',
                additionalProperties: 'additionalProperties',
            }));
        });
    });
});
