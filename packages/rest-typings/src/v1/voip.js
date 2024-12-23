"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoipRoomCloseProps = exports.isVoipRoomsProps = exports.isVoipCallServerCheckConnectionProps = exports.isVoipManagementServerCheckConnectionProps = exports.isVoipRoomProps = exports.isVoipEventsProps = exports.isOmnichannelAgentsAvailableProps = exports.isOmnichannelAgentExtensionDELETEProps = exports.isOmnichannelAgentExtensionPOSTProps = exports.isOmnichannelAgentExtensionGETProps = exports.isOmnichannelExtensionProps = exports.isOmnichannelExtensionsProps = exports.isVoipQueuesGetMembershipSubscriptionProps = exports.isVoipQueuesGetQueuedCallsForThisExtensionProps = exports.isConnectorExtensionGetRegistrationInfoByUserIdProps = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const ConnectorExtensionGetRegistrationInfoByUserIdSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
        },
    },
    required: ['id'],
    additionalProperties: false,
};
exports.isConnectorExtensionGetRegistrationInfoByUserIdProps = ajv.compile(ConnectorExtensionGetRegistrationInfoByUserIdSchema);
const VoipQueuesGetQueuedCallsForThisExtensionSchema = {
    type: 'object',
    properties: {
        extension: {
            type: 'string',
        },
    },
    required: ['extension'],
    additionalProperties: false,
};
exports.isVoipQueuesGetQueuedCallsForThisExtensionProps = ajv.compile(VoipQueuesGetQueuedCallsForThisExtensionSchema);
const VoipQueuesGetMembershipSubscriptionSchema = {
    type: 'object',
    properties: {
        extension: {
            type: 'string',
        },
    },
    required: ['extension'],
    additionalProperties: false,
};
exports.isVoipQueuesGetMembershipSubscriptionProps = ajv.compile(VoipQueuesGetMembershipSubscriptionSchema);
const OmnichannelExtensionsSchema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            nullable: true,
        },
        agentId: {
            type: 'string',
            nullable: true,
        },
        queues: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        extension: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
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
exports.isOmnichannelExtensionsProps = ajv.compile(OmnichannelExtensionsSchema);
const OmnichannelExtensionSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                userId: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    enum: ['free', 'allocated', 'available'],
                },
            },
            required: ['userId', 'type'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                    enum: ['free', 'allocated', 'available'],
                },
            },
            required: ['username', 'type'],
            additionalProperties: false,
        },
    ],
};
exports.isOmnichannelExtensionProps = ajv.compile(OmnichannelExtensionSchema);
const OmnichannelAgentExtensionGETSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isOmnichannelAgentExtensionGETProps = ajv.compile(OmnichannelAgentExtensionGETSchema);
const OmnichannelAgentExtensionPOSTSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                userId: {
                    type: 'string',
                },
                extension: {
                    type: 'string',
                },
            },
            required: ['userId', 'extension'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                },
                extension: {
                    type: 'string',
                },
            },
            required: ['username', 'extension'],
            additionalProperties: false,
        },
    ],
};
exports.isOmnichannelAgentExtensionPOSTProps = ajv.compile(OmnichannelAgentExtensionPOSTSchema);
const OmnichannelAgentExtensionDELETESchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isOmnichannelAgentExtensionDELETEProps = ajv.compile(OmnichannelAgentExtensionDELETESchema);
const OmnichannelAgentsAvailableSchema = {
    type: 'object',
    properties: {
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
        text: {
            type: 'string',
            nullable: true,
        },
        includeExtension: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isOmnichannelAgentsAvailableProps = ajv.compile(OmnichannelAgentsAvailableSchema);
const VoipEventsSchema = {
    type: 'object',
    properties: {
        event: {
            type: 'string',
            enum: Object.values(core_typings_1.VoipClientEvents),
        },
        rid: {
            type: 'string',
        },
        comment: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['event', 'rid'],
    additionalProperties: false,
};
exports.isVoipEventsProps = ajv.compile(VoipEventsSchema);
const VoipRoomSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                },
                agentId: {
                    type: 'string',
                },
                direction: {
                    type: 'string',
                    enum: ['inbound', 'outbound'],
                },
            },
            required: ['token', 'agentId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                rid: {
                    type: 'string',
                },
                token: {
                    type: 'string',
                },
            },
            required: ['rid', 'token'],
            additionalProperties: false,
        },
    ],
};
exports.isVoipRoomProps = ajv.compile(VoipRoomSchema);
const VoipManagementServerCheckConnectionSchema = {
    type: 'object',
    properties: {
        host: {
            type: 'string',
        },
        port: {
            type: 'string',
        },
        username: {
            type: 'string',
        },
        password: {
            type: 'string',
        },
    },
    required: ['host', 'port', 'username', 'password'],
    additionalProperties: false,
};
exports.isVoipManagementServerCheckConnectionProps = ajv.compile(VoipManagementServerCheckConnectionSchema);
const VoipCallServerCheckConnectionSchema = {
    type: 'object',
    properties: {
        websocketUrl: {
            type: 'string',
        },
        host: {
            type: 'string',
        },
        port: {
            type: 'string',
        },
        path: {
            type: 'string',
        },
    },
    required: ['websocketUrl', 'host', 'port', 'path'],
    additionalProperties: false,
};
exports.isVoipCallServerCheckConnectionProps = ajv.compile(VoipCallServerCheckConnectionSchema);
const VoipRoomsSchema = {
    type: 'object',
    properties: {
        agents: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        open: {
            type: 'string',
            enum: ['true', 'false'],
            nullable: true,
        },
        createdAt: {
            type: 'string',
            nullable: true,
        },
        closedAt: {
            type: 'string',
            nullable: true,
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        queue: {
            type: 'string',
            nullable: true,
        },
        visitorId: {
            type: 'string',
            nullable: true,
        },
        direction: {
            type: 'string',
            enum: ['inbound', 'outbound'],
            nullable: true,
        },
        roomName: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'number',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        sort: {
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
exports.isVoipRoomsProps = ajv.compile(VoipRoomsSchema);
const VoipRoomCloseSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        token: {
            type: 'string',
        },
        options: {
            type: 'object',
            properties: {
                comment: {
                    type: 'string',
                    nullable: true,
                },
                tags: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
            },
        },
    },
    required: ['rid', 'token'],
    additionalProperties: false,
};
exports.isVoipRoomCloseProps = ajv.compile(VoipRoomCloseSchema);
