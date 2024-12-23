"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetDescriptionProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetDescriptionPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
            },
            required: ['roomId', 'description'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
            },
            required: ['roomName', 'description'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetDescriptionProps = ajv.compile(channelsSetDescriptionPropsSchema);
