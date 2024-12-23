"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoConfStartProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const videoConfStartPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
            nullable: false,
        },
        title: {
            type: 'string',
            nullable: true,
        },
        allowRinging: {
            type: 'boolean',
            nullable: true,
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isVideoConfStartProps = ajv.compile(videoConfStartPropsSchema);
