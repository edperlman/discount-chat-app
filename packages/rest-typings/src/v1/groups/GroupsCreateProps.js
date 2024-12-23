"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsCreateProps = void 0;
const _2019_1 = __importDefault(require("ajv/dist/2019"));
const ajv = new _2019_1.default({
    coerceTypes: true,
});
const GroupsCreatePropsSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        members: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
        },
        readOnly: {
            type: 'boolean',
            nullable: true,
        },
        customFields: {
            type: 'object',
            nullable: true,
        },
        extraData: {
            type: 'object',
            properties: {
                broadcast: {
                    type: 'boolean',
                },
                encrypted: {
                    type: 'boolean',
                },
                federated: {
                    type: 'boolean',
                    nullable: true,
                },
                teamId: {
                    type: 'string',
                    nullable: true,
                },
                topic: {
                    type: 'string',
                    nullable: true,
                },
            },
            dependentSchemas: {
                extraData: { required: ['broadcast', 'encrypted'] },
            },
            additionalProperties: false,
            nullable: true,
        },
    },
    required: ['name'],
    additionalProperties: false,
};
exports.isGroupsCreateProps = ajv.compile(GroupsCreatePropsSchema);
