"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsModeratorsProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsModeratorsPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: { type: 'string' },
                userId: {
                    type: 'string',
                    nullable: true,
                },
                username: {
                    type: 'string',
                    nullable: true,
                },
                user: {
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
                roomName: { type: 'string' },
                userId: {
                    type: 'string',
                    nullable: true,
                },
                username: {
                    type: 'string',
                    nullable: true,
                },
                user: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['roomName'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsModeratorsProps = ajv.compile(channelsModeratorsPropsSchema);
