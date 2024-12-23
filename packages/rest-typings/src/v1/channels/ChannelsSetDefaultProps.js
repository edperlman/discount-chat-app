"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetDefaultProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetDefaultPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                default: {
                    type: 'string',
                },
            },
            required: ['roomId', 'default'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                default: {
                    type: 'default',
                },
            },
            required: ['roomName', 'default'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetDefaultProps = ajv.compile(channelsSetDefaultPropsSchema);
