"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoConfJoinProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const videoConfJoinPropsSchema = {
    type: 'object',
    properties: {
        callId: {
            type: 'string',
            nullable: false,
        },
        state: {
            type: 'object',
            nullable: true,
            properties: {
                mic: {
                    type: 'boolean',
                    nullable: true,
                },
                cam: {
                    type: 'boolean',
                    nullable: true,
                },
            },
            additionalProperties: false,
        },
    },
    required: ['callId'],
    additionalProperties: false,
};
exports.isVideoConfJoinProps = ajv.compile(videoConfJoinPropsSchema);
