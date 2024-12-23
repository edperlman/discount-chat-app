"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersListStatusProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UsersListStatusParamsGetSchema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: ['active', 'deactivated'],
        },
        hasLoggedIn: {
            type: 'boolean',
            nullable: true,
        },
        type: {
            type: 'string',
            nullable: true,
        },
        roles: {
            type: 'array',
            items: {
                type: 'string',
            },
            nullable: true,
        },
        searchTerm: {
            type: 'string',
            nullable: true,
        },
        sort: {
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
    },
    additionalProperties: false,
};
exports.isUsersListStatusProps = ajv.compile(UsersListStatusParamsGetSchema);
