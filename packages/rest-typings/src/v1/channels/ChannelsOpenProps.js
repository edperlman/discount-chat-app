"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsOpenProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsOpenPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                query: {
                    type: 'string',
                    nullable: true,
                },
                sort: {
                    type: 'object',
                    properties: {
                        ts: {
                            type: 'number',
                            enum: [1, -1],
                        },
                    },
                    required: ['ts'],
                    additionalProperties: false,
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
                query: {
                    type: 'string',
                    nullable: true,
                },
                sort: {
                    type: 'object',
                    properties: {
                        ts: {
                            type: 'number',
                            enum: [1, -1],
                        },
                    },
                    required: ['ts'],
                    additionalProperties: false,
                    nullable: true,
                },
            },
            required: ['roomName'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsOpenProps = ajv.compile(channelsOpenPropsSchema);
