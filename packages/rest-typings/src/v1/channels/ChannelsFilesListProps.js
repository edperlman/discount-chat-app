"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsFilesListProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const channelsFilesListPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
            nullable: true,
        },
        roomName: {
            type: 'string',
            nullable: true,
        },
        offset: {
            type: 'number',
            nullable: true,
        },
        count: {
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
        typeGroup: {
            type: 'string',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    oneOf: [{ required: ['roomId'] }, { required: ['roomName'] }],
    required: [],
    additionalProperties: false,
};
exports.isChannelsFilesListProps = ajv.compile(channelsFilesListPropsSchema);
