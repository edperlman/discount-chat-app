"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntegrationsRemoveProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const integrationsRemoveSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    nullable: false,
                    pattern: 'webhook-incoming',
                },
                integrationId: {
                    type: 'string',
                    nullable: false,
                },
            },
            required: ['type', 'integrationId'],
        },
        {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    nullable: false,
                    pattern: 'webhook-outgoing',
                },
                target_url: {
                    type: 'string',
                    nullable: false,
                },
            },
            required: ['type', 'target_url'],
        },
        {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    nullable: false,
                    pattern: 'webhook-outgoing',
                },
                integrationId: {
                    type: 'string',
                    nullable: false,
                },
            },
            required: ['type', 'integrationId'],
        },
    ],
};
exports.isIntegrationsRemoveProps = ajv.compile(integrationsRemoveSchema);
