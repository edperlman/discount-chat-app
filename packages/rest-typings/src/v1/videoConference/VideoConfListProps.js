"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoConfListProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const videoConfListPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
            nullable: false,
        },
        offset: { type: 'number', nullable: true },
        count: { type: 'number', nullable: true },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isVideoConfListProps = ajv.compile(videoConfListPropsSchema);
