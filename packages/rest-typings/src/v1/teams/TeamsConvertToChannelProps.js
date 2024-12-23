"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsConvertToChannelProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const teamsConvertToTeamsPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomsToRemove: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                teamId: {
                    type: 'string',
                },
            },
            required: ['teamId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomsToRemove: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                teamName: {
                    type: 'string',
                },
            },
            required: ['teamName'],
            additionalProperties: false,
        },
    ],
};
exports.isTeamsConvertToChannelProps = ajv.compile(teamsConvertToTeamsPropsSchema);
