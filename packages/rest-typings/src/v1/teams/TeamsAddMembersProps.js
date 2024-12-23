"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsAddMembersProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const teamsAddMembersPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                teamId: {
                    type: 'string',
                },
                members: {
                    type: 'array',
                    items: {
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
                    minItems: 1,
                    uniqueItems: true,
                },
            },
            required: ['teamId', 'members'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                teamName: {
                    type: 'string',
                },
                members: {
                    type: 'array',
                    items: {
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
                    minItems: 1,
                    uniqueItems: true,
                },
            },
            required: ['teamName', 'members'],
            additionalProperties: false,
        },
    ],
};
exports.isTeamsAddMembersProps = ajv.compile(teamsAddMembersPropsSchema);
