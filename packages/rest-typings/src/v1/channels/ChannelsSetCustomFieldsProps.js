"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetCustomFieldsProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetCustomFieldsPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                customFields: {
                    type: 'object',
                },
            },
            required: ['roomId', 'customFields'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                customFields: {
                    type: 'object',
                },
            },
            required: ['roomName', 'customFields'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetCustomFieldsProps = ajv.compile(channelsSetCustomFieldsPropsSchema);
