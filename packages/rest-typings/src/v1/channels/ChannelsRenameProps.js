"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsRenameProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsRenamePropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
            },
            required: ['roomId', 'name'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
            },
            required: ['roomName', 'name'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsRenameProps = ajv.compile(channelsRenamePropsSchema);
