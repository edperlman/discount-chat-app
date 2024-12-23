"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVoipFreeSwitchExtensionAssignProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const voipFreeSwitchExtensionAssignPropsSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            nullable: false,
        },
        extension: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['username'],
    additionalProperties: false,
};
exports.isVoipFreeSwitchExtensionAssignProps = ajv.compile(voipFreeSwitchExtensionAssignPropsSchema);
