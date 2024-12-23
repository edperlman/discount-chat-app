"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetReadOnlyProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetReadOnlyPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: { type: 'string' },
                readOnly: { type: 'boolean' },
            },
            required: ['roomId', 'readOnly'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: { type: 'string' },
                readOnly: { type: 'boolean' },
            },
            required: ['roomName', 'readOnly'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetReadOnlyProps = ajv.compile(channelsSetReadOnlyPropsSchema);
