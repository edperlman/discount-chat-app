"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIntegrationsUpdateProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const integrationsUpdateSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    pattern: 'webhook-incoming',
                    nullable: false,
                },
                integrationId: {
                    type: 'string',
                    nullable: false,
                },
                channel: {
                    type: 'string',
                    nullable: false,
                },
                scriptEnabled: {
                    type: 'boolean',
                    nullable: false,
                },
                scriptEngine: {
                    type: 'string',
                    nullable: false,
                },
                overrideDestinationChannelEnabled: {
                    type: 'boolean',
                    nullable: true,
                },
                script: {
                    type: 'string',
                    nullable: true,
                },
                name: {
                    type: 'string',
                    nullable: false,
                },
                enabled: {
                    type: 'boolean',
                    nullable: false,
                },
                alias: {
                    type: 'string',
                    nullable: true,
                },
                avatar: {
                    type: 'string',
                    nullable: true,
                },
                emoji: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['integrationId', 'type', 'channel', 'scriptEnabled', 'name', 'enabled'],
            additionalProperties: true,
        },
        {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    pattern: 'webhook-outgoing',
                    nullable: false,
                },
                integrationId: {
                    type: 'string',
                    nullable: true,
                },
                target_url: {
                    type: 'string',
                    nullable: true,
                },
                username: {
                    type: 'string',
                    nullable: false,
                },
                channel: {
                    type: 'string',
                    nullable: false,
                },
                event: {
                    type: 'string',
                    nullable: false,
                },
                targetRoom: {
                    type: 'string',
                    nullable: true,
                },
                urls: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                    },
                    nullable: true,
                },
                triggerWords: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                    },
                    nullable: true,
                },
                triggerWordAnywhere: {
                    type: 'boolean',
                    nullable: true,
                },
                token: {
                    type: 'string',
                    nullable: true,
                },
                scriptEnabled: {
                    type: 'boolean',
                    nullable: false,
                },
                scriptEngine: {
                    type: 'string',
                    nullable: false,
                },
                script: {
                    type: 'string',
                    nullable: true,
                },
                runOnEdits: {
                    type: 'boolean',
                    nullable: true,
                },
                retryFailedCalls: {
                    type: 'boolean',
                    nullable: true,
                },
                retryCount: {
                    type: 'number',
                    nullable: true,
                },
                retryDelay: {
                    type: 'string',
                    nullable: true,
                },
                impersonateUser: {
                    type: 'boolean',
                    nullable: true,
                },
                name: {
                    type: 'string',
                    nullable: false,
                },
                enabled: {
                    type: 'boolean',
                    nullable: false,
                },
                alias: {
                    type: 'string',
                    nullable: true,
                },
                avatar: {
                    type: 'string',
                    nullable: true,
                },
                emoji: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['type', 'username', 'channel', 'event', 'scriptEnabled', 'name', 'enabled'],
            additionalProperties: false,
        },
    ],
};
exports.isIntegrationsUpdateProps = ajv.compile(integrationsUpdateSchema);
