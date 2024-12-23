"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsUpdateMemberProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const teamsUpdateMemberPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                teamId: {
                    type: 'string',
                },
                member: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                        },
                        roles: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            nullable: true,
                        },
                    },
                    required: ['userId'],
                    additionalProperties: false,
                },
            },
            required: ['teamId', 'member'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                teamName: {
                    type: 'string',
                },
                member: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                        },
                        roles: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            nullable: true,
                        },
                    },
                    required: ['userId'],
                    additionalProperties: false,
                },
            },
            required: ['teamName', 'member'],
            additionalProperties: false,
        },
    ],
};
exports.isTeamsUpdateMemberProps = ajv.compile(teamsUpdateMemberPropsSchema);
