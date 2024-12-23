"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsGetAllUserMentionsByChannelProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
const channelsGetAllUserMentionsByChannelPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChannelsGetAllUserMentionsByChannelProps = ajv.compile(channelsGetAllUserMentionsByChannelPropsSchema);
