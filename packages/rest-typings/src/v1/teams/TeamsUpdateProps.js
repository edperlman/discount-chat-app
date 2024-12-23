"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsUpdateProps = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const teamsUpdatePropsSchema = {
    type: 'object',
    properties: {
        updateRoom: {
            type: 'boolean',
            nullable: true,
        },
        teamId: {
            type: 'string',
            nullable: true,
        },
        teamName: {
            type: 'string',
            nullable: true,
        },
        data: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    nullable: true,
                },
                type: {
                    type: 'number',
                    enum: [core_typings_1.TEAM_TYPE.PUBLIC, core_typings_1.TEAM_TYPE.PRIVATE],
                },
            },
            additionalProperties: false,
            required: [],
            anyOf: [
                {
                    required: ['name'],
                },
                {
                    required: ['type'],
                },
            ],
        },
        name: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    oneOf: [
        {
            required: ['teamId', 'data'],
        },
        {
            required: ['teamName', 'data'],
        },
    ],
    additionalProperties: false,
};
exports.isTeamsUpdateProps = ajv.compile(teamsUpdatePropsSchema);
