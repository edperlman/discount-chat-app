"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImportAddUsersParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const ImportAddUsersParamsPostSchema = {
    type: 'object',
    properties: {
        users: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    username: { type: 'string', nullable: true },
                    emails: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    importIds: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    name: { type: 'string', nullable: true },
                    utcOffset: { type: 'number', nullable: true },
                    avatarUrl: { type: 'string', nullable: true },
                    deleted: { type: 'boolean', nullable: true },
                    statusText: { type: 'string', nullable: true },
                    roles: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        nullable: true,
                    },
                    type: { type: 'string', nullable: true },
                    bio: { type: 'string', nullable: true },
                    password: { type: 'string', nullable: true },
                },
                required: ['emails', 'importIds'],
            },
        },
    },
    additionalProperties: false,
    required: ['users'],
};
exports.isImportAddUsersParamsPOST = ajv.compile(ImportAddUsersParamsPostSchema);
