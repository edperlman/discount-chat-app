"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetTypeProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetTypePropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                },
            },
            required: ['roomId', 'type'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                },
            },
            required: ['roomName', 'type'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetTypeProps = ajv.compile(channelsSetTypePropsSchema);
