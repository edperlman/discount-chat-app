"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsMessagesProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
const channelsMessagesPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        mentionIds: {
            type: 'string',
        },
        starredIds: {
            type: 'string',
        },
        pinned: {
            type: 'string',
        },
        query: {
            type: 'string',
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isChannelsMessagesProps = ajv.compile(channelsMessagesPropsSchema);
