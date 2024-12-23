"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_typings_1 = require("@rocket.chat/rest-typings");
const chai_1 = require("chai");
describe('TeamsUpdateMemberProps (definition/rest/v1)', () => {
    describe('isTeamsUpdateProps', () => {
        it('should be a function', () => {
            chai_1.assert.isFunction(rest_typings_1.isTeamsUpdateProps);
        });
        it('should return false when provided anything that is not an TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)(undefined));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)(null));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)(''));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)(123));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({}));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)([]));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)(new Date()));
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)(new Error()));
        });
        it('should return false when only teamName is provided to TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
            }));
        });
        it('should return false when only teamId is provided to TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
            }));
        });
        it('should return false when teamName and data are provided to TeamsUpdateProps but data is an empty object', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                data: {},
            }));
        });
        it('should return false when teamId and data are provided to TeamsUpdateProps but data is an empty object', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                data: {},
            }));
        });
        it('should return false when teamName and data are provided to TeamsUpdateProps but data is not an object', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                data: 'data',
            }));
        });
        it('should return false when teamId and data are provided to TeamsUpdateProps but data is not an object', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                data: 'data',
            }));
        });
        it('should return true when teamName and data.name are provided to TeamsUpdateProps', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                data: {
                    name: 'name',
                },
            }));
        });
        it('should return true when teamId and data.name are provided to TeamsUpdateProps', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                data: {
                    name: 'name',
                },
            }));
        });
        it('should return true when teamName and data.type are provided to TeamsUpdateProps', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                data: {
                    type: 0,
                },
            }));
        });
        it('should return true when teamId and data.type are provided to TeamsUpdateProps', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                data: {
                    type: 0,
                },
            }));
        });
        it('should return true when teamName and data.name and data.type are provided to TeamsUpdateProps', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                data: {
                    name: 'name',
                    type: 0,
                },
            }));
        });
        it('should return true when teamId and data.name and data.type are provided to TeamsUpdateProps', () => {
            chai_1.assert.isTrue((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                data: {
                    name: 'name',
                    type: 0,
                },
            }));
        });
        it('should return false when teamName, data.name, data.type are some more extra data  are provided to TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                data: {
                    name: 'name',
                    type: 0,
                    extra: 'extra',
                },
            }));
        });
        it('should return false when teamId, data.name, data.type are some more extra data  are provided to TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                data: {
                    name: 'name',
                    type: 0,
                    extra: 'extra',
                },
            }));
        });
        it('should return false when teamName, data.name, data.type are some more extra parameter are provided to TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamName: 'teamName',
                extra: 'extra',
                data: {
                    name: 'name',
                    type: 0,
                },
            }));
        });
        it('should return false when teamId, data.name, data.type are some more extra parameter are provided to TeamsUpdateProps', () => {
            chai_1.assert.isFalse((0, rest_typings_1.isTeamsUpdateProps)({
                teamId: 'teamId',
                extra: 'extra',
                data: {
                    name: 'name',
                    type: 0,
                },
            }));
        });
    });
});
