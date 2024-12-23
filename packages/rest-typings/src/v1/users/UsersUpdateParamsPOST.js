"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersUpdateParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UsersUpdateParamsPostSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            minLength: 1,
        },
        confirmRelinquish: {
            type: 'boolean',
        },
        data: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    nullable: true,
                },
                name: {
                    type: 'string',
                    nullable: true,
                },
                password: {
                    type: 'string',
                    nullable: true,
                },
                username: {
                    type: 'string',
                    nullable: true,
                },
                bio: {
                    type: 'string',
                    nullable: true,
                },
                nickname: {
                    type: 'string',
                    nullable: true,
                },
                statusText: {
                    type: 'string',
                    nullable: true,
                },
                active: {
                    type: 'boolean',
                    nullable: true,
                },
                roles: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    nullable: true,
                },
                requirePasswordChange: {
                    type: 'boolean',
                    nullable: true,
                },
                setRandomPassword: {
                    type: 'boolean',
                    nullable: true,
                },
                sendWelcomeEmail: {
                    type: 'boolean',
                    nullable: true,
                },
                verified: {
                    type: 'boolean',
                    nullable: true,
                },
                customFields: {
                    type: 'object',
                    nullable: true,
                },
                status: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: [],
            additionalProperties: false,
        },
    },
    required: ['userId', 'data'],
    additionalProperties: false,
};
exports.isUsersUpdateParamsPOST = ajv.compile(UsersUpdateParamsPostSchema);
