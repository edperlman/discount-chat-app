"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsKickProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsKickPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                userId: {
                    type: 'string',
                },
            },
            required: ['roomId', 'userId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                userId: {
                    type: 'string',
                },
            },
            required: ['roomName', 'userId'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsKickProps = ajv.compile(channelsKickPropsSchema);
