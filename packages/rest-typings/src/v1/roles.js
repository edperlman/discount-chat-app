"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRolesGetUsersInRoleProps = exports.isRoleRemoveUserFromRoleProps = exports.isRoleAddUserToRoleProps = exports.isRoleDeleteProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const roleDeletePropsSchema = {
    type: 'object',
    properties: {
        roleId: {
            type: 'string',
        },
    },
    required: ['roleId'],
    additionalProperties: false,
};
exports.isRoleDeleteProps = ajv.compile(roleDeletePropsSchema);
const roleAddUserToRolePropsSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        roleId: {
            type: 'string',
            nullable: true,
        },
        roleName: {
            type: 'string',
            nullable: true,
        },
        roomId: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isRoleAddUserToRoleProps = ajv.compile(roleAddUserToRolePropsSchema);
const roleRemoveUserFromRolePropsSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        roleId: {
            type: 'string',
            nullable: true,
        },
        roleName: {
            type: 'string',
            nullable: true,
        },
        roomId: {
            type: 'string',
            nullable: true,
        },
        scope: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isRoleRemoveUserFromRoleProps = ajv.compile(roleRemoveUserFromRolePropsSchema);
const RolesGetUsersInRolePropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
            nullable: true,
        },
        role: {
            type: 'string',
        },
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
    required: ['role'],
    additionalProperties: false,
};
exports.isRolesGetUsersInRoleProps = ajv.compile(RolesGetUsersInRolePropsSchema);
