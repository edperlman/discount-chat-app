"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStatisticsListProps = exports.isStatisticsProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const StatisticsSchema = {
    type: 'object',
    properties: {
        refresh: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isStatisticsProps = ajv.compile(StatisticsSchema);
const StatisticsListSchema = {
    type: 'object',
    properties: {
        fields: {
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
        sort: {
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
exports.isStatisticsListProps = ajv.compile(StatisticsListSchema);
