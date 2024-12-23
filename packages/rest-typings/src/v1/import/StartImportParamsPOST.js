"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStartImportParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const RecordListSchema = {
    type: 'object',
    properties: {
        all: { type: 'boolean' },
        list: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: [],
};
const StartImportParamsPostSchema = {
    type: 'object',
    properties: {
        input: {
            type: 'object',
            properties: {
                users: RecordListSchema,
                channels: RecordListSchema,
                contacts: RecordListSchema,
            },
            required: [],
        },
    },
    additionalProperties: false,
    required: ['input'],
};
exports.isStartImportParamsPOST = ajv.compile(StartImportParamsPostSchema);
