"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsCreateProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsCreatePropsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        members: {
            type: 'array',
        },
        teams: {
            type: 'array',
        },
        readonly: {
            type: 'boolean',
        },
        extraData: {
            type: 'object',
            properties: {
                broadcast: {
                    type: 'boolean',
                },
                encrypted: {
                    type: 'boolean',
                },
                teamId: {
                    type: 'string',
                },
            },
            additionalProperties: false,
            nullable: true,
        },
    },
    required: ['name'],
    additionalProperties: false,
};
exports.isChannelsCreateProps = ajv.compile(channelsCreatePropsSchema);
