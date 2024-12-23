"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetPurposeProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetPurposePropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                purpose: {
                    type: 'string',
                },
            },
            required: ['roomId', 'purpose'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                purpose: {
                    type: 'string',
                },
            },
            required: ['roomName', 'purpose'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetPurposeProps = ajv.compile(channelsSetPurposePropsSchema);
