"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBodyParamsValidPermissionUpdate = exports.isPermissionsListAll = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const permissionListAllSchema = {
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
exports.isPermissionsListAll = ajv.compile(permissionListAllSchema);
const permissionUpdatePropsSchema = {
    type: 'object',
    properties: {
        permissions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    roles: {
                        type: 'array',
                        items: { type: 'string' },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
                required: ['_id', 'roles'],
            },
        },
    },
    required: ['permissions'],
    additionalProperties: false,
};
exports.isBodyParamsValidPermissionUpdate = ajv.compile(permissionUpdatePropsSchema);
