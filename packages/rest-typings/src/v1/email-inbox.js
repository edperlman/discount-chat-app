"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailInboxSearch = exports.isEmailInbox = exports.isEmailInboxList = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const EmailInboxListPropsSchema = {
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
    },
    required: [],
    additionalProperties: false,
};
exports.isEmailInboxList = ajv.compile(EmailInboxListPropsSchema);
const EmailInboxPropsSchema = {
    type: 'object',
    properties: {
        _id: {
            type: 'string',
            nullable: true,
        },
        name: {
            type: 'string',
        },
        email: {
            type: 'string',
        },
        active: {
            type: 'boolean',
        },
        description: {
            type: 'string',
        },
        senderInfo: {
            type: 'string',
        },
        department: {
            type: 'string',
        },
        smtp: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                },
                port: {
                    type: 'number',
                },
                secure: {
                    type: 'boolean',
                },
                server: {
                    type: 'string',
                },
                username: {
                    type: 'string',
                },
            },
            required: ['password', 'port', 'secure', 'server', 'username'],
            additionalProperties: false,
        },
        imap: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                },
                port: {
                    type: 'number',
                },
                secure: {
                    type: 'boolean',
                },
                server: {
                    type: 'string',
                },
                username: {
                    type: 'string',
                },
            },
            required: ['password', 'port', 'secure', 'server', 'username'],
            additionalProperties: false,
        },
    },
    required: ['name', 'email', 'active', 'description', 'senderInfo', 'department', 'smtp', 'imap'],
    additionalProperties: false,
};
exports.isEmailInbox = ajv.compile(EmailInboxPropsSchema);
const EmailInboxSearchPropsSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
        },
    },
    required: ['email'],
    additionalProperties: false,
};
exports.isEmailInboxSearch = ajv.compile(EmailInboxSearchPropsSchema);
