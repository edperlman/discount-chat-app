"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersUpdateOwnBasicInfoParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UsersUpdateOwnBasicInfoParamsPostSchema = {
    type: 'object',
    properties: {
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
                username: {
                    type: 'string',
                    nullable: true,
                },
                nickname: {
                    type: 'string',
                    nullable: true,
                },
                bio: {
                    type: 'string',
                    nullable: true,
                },
                statusType: {
                    type: 'string',
                    nullable: true,
                },
                statusText: {
                    type: 'string',
                    nullable: true,
                },
                currentPassword: {
                    type: 'string',
                    nullable: true,
                },
                newPassword: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: [],
            additionalProperties: false,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
    },
    required: ['data'],
    additionalProperties: false,
};
exports.isUsersUpdateOwnBasicInfoParamsPOST = ajv.compile(UsersUpdateOwnBasicInfoParamsPostSchema);
