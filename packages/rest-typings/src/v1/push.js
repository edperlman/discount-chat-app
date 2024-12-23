"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPushGetProps = exports.isPushTokenProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const PushTokenPropsSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            nullable: true,
        },
        type: {
            type: 'string',
        },
        value: {
            type: 'string',
        },
        appName: {
            type: 'string',
        },
    },
    required: ['type', 'value', 'appName'],
    additionalProperties: false,
};
exports.isPushTokenProps = ajv.compile(PushTokenPropsSchema);
const PushGetPropsSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
        },
    },
    required: ['id'],
    additionalProperties: false,
};
exports.isPushGetProps = ajv.compile(PushGetPropsSchema);
