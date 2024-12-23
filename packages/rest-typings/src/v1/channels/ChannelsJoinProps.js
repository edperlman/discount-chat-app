"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsJoinProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsJoinPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                joinCode: {
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
                },
                joinCode: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['roomName'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsJoinProps = ajv.compile(channelsJoinPropsSchema);
