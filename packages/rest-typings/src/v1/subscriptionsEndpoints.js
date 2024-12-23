"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSubscriptionsUnreadProps = exports.isSubscriptionsReadProps = exports.isSubscriptionsGetOneProps = exports.isSubscriptionsGetProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const SubscriptionsGetSchema = {
    type: 'object',
    properties: {
        updatedSince: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isSubscriptionsGetProps = ajv.compile(SubscriptionsGetSchema);
const SubscriptionsGetOneSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isSubscriptionsGetOneProps = ajv.compile(SubscriptionsGetOneSchema);
const SubscriptionsReadSchema = {
    anyOf: [
        {
            type: 'object',
            properties: {
                rid: {
                    type: 'string',
                },
                readThreads: {
                    type: 'boolean',
                    nullable: true,
                },
            },
            required: ['rid'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                readThreads: {
                    type: 'boolean',
                    nullable: true,
                },
            },
            required: ['roomId'],
            additionalProperties: false,
        },
    ],
};
exports.isSubscriptionsReadProps = ajv.compile(SubscriptionsReadSchema);
const SubscriptionsUnreadSchema = {
    anyOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
            },
            required: ['roomId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                firstUnreadMessage: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                    },
                    required: ['_id'],
                    additionalProperties: false,
                },
            },
            required: ['firstUnreadMessage'],
            additionalProperties: false,
        },
    ],
};
exports.isSubscriptionsUnreadProps = ajv.compile(SubscriptionsUnreadSchema);
