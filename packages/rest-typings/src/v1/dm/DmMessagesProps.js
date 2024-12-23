"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDmMessagesProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
exports.isDmMessagesProps = ajv.compile({
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                mentionIds: {
                    type: 'string',
                },
                starredIds: {
                    type: 'string',
                },
                pinned: {
                    type: 'string',
                },
                fields: {
                    type: 'string',
                },
                query: {
                    type: 'string',
                },
                sort: {
                    type: 'string',
                },
                count: {
                    type: 'number',
                },
                offset: {
                    type: 'number',
                },
            },
            required: ['roomId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                },
                mentionIds: {
                    type: 'string',
                },
                starredIds: {
                    type: 'string',
                },
                pinned: {
                    type: 'string',
                },
                query: {
                    type: 'string',
                },
                fields: {
                    type: 'string',
                },
                sort: {
                    type: 'string',
                },
                count: {
                    type: 'number',
                },
                offset: {
                    type: 'number',
                },
            },
            required: ['username'],
            additionalProperties: false,
        },
    ],
});
