"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntegrationsGetProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const integrationsGetSchema = {
    type: 'object',
    properties: {
        integrationId: {
            type: 'string',
            nullable: false,
        },
        createdBy: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['integrationId'],
};
exports.isIntegrationsGetProps = ajv.compile(integrationsGetSchema);
