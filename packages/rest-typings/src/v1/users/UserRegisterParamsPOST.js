"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserRegisterParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UserRegisterParamsPostSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        name: {
            type: 'string',
            nullable: true,
        },
        email: {
            type: 'string',
        },
        pass: {
            type: 'string',
        },
        secret: {
            type: 'string',
            nullable: true,
        },
        reason: {
            type: 'string',
            nullable: true,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
    },
    required: ['username', 'email', 'pass'],
    additionalProperties: false,
};
exports.isUserRegisterParamsPOST = ajv.compile(UserRegisterParamsPostSchema);
