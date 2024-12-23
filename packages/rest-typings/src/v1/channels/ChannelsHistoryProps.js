"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsHistoryProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
const channelsHistoryPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                    minLength: 1,
                },
                latest: {
                    type: 'string',
                    minLength: 1,
                    nullable: true,
                },
                showThreadMessages: {
                    type: 'string',
                    enum: ['false', 'true'],
                    nullable: true,
                },
                oldest: {
                    type: 'string',
                    minLength: 1,
                    nullable: true,
                },
                inclusive: {
                    type: 'string',
                    enum: ['false', 'true'],
                    nullable: true,
                },
                unreads: {
                    type: 'string',
                    enum: ['true', 'false'],
                    nullable: true,
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
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                    minLength: 1,
                },
                latest: {
                    type: 'string',
                    minLength: 1,
                    nullable: true,
                },
                showThreadMessages: {
                    type: 'string',
                    enum: ['false', 'true'],
                    nullable: true,
                },
                oldest: {
                    type: 'string',
                    minLength: 1,
                    nullable: true,
                },
                inclusive: {
                    type: 'string',
                    enum: ['false', 'true'],
                    nullable: true,
                },
                unreads: {
                    type: 'string',
                    enum: ['true', 'false'],
                    nullable: true,
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
            required: ['roomName'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsHistoryProps = ajv.compile(channelsHistoryPropsSchema);
