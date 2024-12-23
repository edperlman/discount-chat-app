"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntegrationsHistoryProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
const integrationsHistorySchema = {
    type: 'object',
    properties: {
        id: { type: 'string', nullable: false, minLength: 1 },
        offset: { type: 'number', nullable: true },
        count: { type: 'number', nullable: true },
        sort: { type: 'string', nullable: true },
        query: { type: 'string', nullable: true },
    },
    required: ['id'],
    additionalProperties: false,
};
exports.isIntegrationsHistoryProps = ajv.compile(integrationsHistorySchema);
