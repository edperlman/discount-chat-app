"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCustomUserStatusListProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const CustomUserStatusListSchema = {
    type: 'object',
    properties: {
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
        name: {
            type: 'string',
            nullable: true,
        },
        _id: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isCustomUserStatusListProps = ajv.compile(CustomUserStatusListSchema);