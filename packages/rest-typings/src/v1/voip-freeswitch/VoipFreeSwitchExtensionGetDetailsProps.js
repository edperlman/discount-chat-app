"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoipFreeSwitchExtensionGetDetailsProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const voipFreeSwitchExtensionGetDetailsPropsSchema = {
    type: 'object',
    properties: {
        extension: {
            type: 'string',
            nullable: false,
        },
        group: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['extension'],
    additionalProperties: false,
};
exports.isVoipFreeSwitchExtensionGetDetailsProps = ajv.compile(voipFreeSwitchExtensionGetDetailsPropsSchema);
