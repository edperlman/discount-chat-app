"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDmHistoryProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const DmHistoryPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
            minLength: 1,
        },
        latest: {
            type: 'string',
            minLength: 1,
        },
        showThreadMessages: {
            type: 'string',
            enum: ['false', 'true'],
        },
        oldest: {
            type: 'string',
            minLength: 1,
        },
        inclusive: {
            type: 'string',
            enum: ['false', 'true'],
        },
        unreads: {
            type: 'string',
            enum: ['true', 'false'],
        },
        count: {
            type: 'number',
        },
        offset: {
            type: 'number',
        },
        sort: {
            type: 'string',
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isDmHistoryProps = ajv.compile(DmHistoryPropsSchema);
