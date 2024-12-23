"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntegrationsListProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const integrationsListSchema = {
    type: 'object',
    properties: {
        count: {
            type: ['number', 'string'],
            nullable: true,
        },
        offset: {
            type: ['number', 'string'],
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        name: {
            type: 'string',
            nullable: true,
        },
        type: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isIntegrationsListProps = ajv.compile(integrationsListSchema);
