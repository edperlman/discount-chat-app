"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsLeaveProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const teamsLeavePropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                teamId: {
                    type: 'string',
                },
                rooms: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    minItems: 1,
                    uniqueItems: true,
                    nullable: true,
                },
            },
            required: ['teamId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                teamName: {
                    type: 'string',
                },
                rooms: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    minItems: 1,
                    uniqueItems: true,
                    nullable: true,
                },
            },
            required: ['teamName'],
            additionalProperties: false,
        },
    ],
};
exports.isTeamsLeaveProps = ajv.compile(teamsLeavePropsSchema);
