"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersInfoParamsGetProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UsersInfoParamsGetSchema = {
    anyOf: [
        {
            type: 'object',
            properties: {
                userId: {
                    type: 'string',
                },
                includeUserRooms: {
                    type: 'string',
                },
                fields: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['userId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                },
                includeUserRooms: {
                    type: 'string',
                },
                fields: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['username'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                importId: {
                    type: 'string',
                },
                includeUserRooms: {
                    type: 'string',
                },
                fields: {
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['importId'],
            additionalProperties: false,
        },
    ],
};
exports.isUsersInfoParamsGetProps = ajv.compile(UsersInfoParamsGetSchema);
