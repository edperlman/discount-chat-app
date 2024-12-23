"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoipFreeSwitchExtensionGetInfoProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const voipFreeSwitchExtensionGetInfoPropsSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            nullable: false,
        },
    },
    required: ['userId'],
    additionalProperties: false,
};
exports.isVoipFreeSwitchExtensionGetInfoProps = ajv.compile(voipFreeSwitchExtensionGetInfoPropsSchema);
