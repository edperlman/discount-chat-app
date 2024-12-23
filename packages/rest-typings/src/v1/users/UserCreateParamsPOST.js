"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserCreateParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const userCreateParamsPostSchema = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        name: { type: 'string' },
        password: { type: 'string' },
        username: { type: 'string' },
        active: { type: 'boolean', nullable: true },
        bio: { type: 'string', nullable: true },
        nickname: { type: 'string', nullable: true },
        statusText: { type: 'string', nullable: true },
        roles: { type: 'array', items: { type: 'string' } },
        joinDefaultChannels: { type: 'boolean', nullable: true },
        requirePasswordChange: { type: 'boolean', nullable: true },
        setRandomPassword: { type: 'boolean', nullable: true },
        sendWelcomeEmail: { type: 'boolean', nullable: true },
        verified: { type: 'boolean', nullable: true },
        customFields: { type: 'object' },
        fields: { type: 'string', nullable: true },
    },
    additionalProperties: false,
    required: ['email', 'name', 'password', 'username'],
};
exports.isUserCreateParamsPOST = ajv.compile(userCreateParamsPostSchema);
