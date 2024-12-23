"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDmFileProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
exports.isDmFileProps = ajv.compile({
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
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
            required: ['username'],
            additionalProperties: false,
        },
    ],
});
