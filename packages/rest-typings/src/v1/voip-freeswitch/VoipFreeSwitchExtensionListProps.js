"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoipFreeSwitchExtensionListProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const voipFreeSwitchExtensionListPropsSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            nullable: true,
        },
        type: {
            type: 'string',
            enum: ['available', 'free', 'allocated', 'all'],
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isVoipFreeSwitchExtensionListProps = ajv.compile(voipFreeSwitchExtensionListPropsSchema);
