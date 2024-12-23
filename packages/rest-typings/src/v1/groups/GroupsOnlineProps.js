"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsOnlineProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const groupsOnlinePropsSchema = {
    type: 'object',
    properties: {
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
exports.isGroupsOnlineProps = ajv.compile(groupsOnlinePropsSchema);
