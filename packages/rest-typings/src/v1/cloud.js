"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCloudConfirmationPollProps = exports.isCloudCreateRegistrationIntentProps = exports.isCloudManualRegisterProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const CloudManualRegisterSchema = {
    type: 'object',
    properties: {
        cloudBlob: {
            type: 'string',
        },
    },
    required: ['cloudBlob'],
    additionalProperties: false,
};
exports.isCloudManualRegisterProps = ajv.compile(CloudManualRegisterSchema);
const CloudCreateRegistrationIntentSchema = {
    type: 'object',
    properties: {
        resend: {
            type: 'boolean',
        },
        email: {
            type: 'string',
        },
    },
    required: ['resend', 'email'],
    additionalProperties: false,
};
exports.isCloudCreateRegistrationIntentProps = ajv.compile(CloudCreateRegistrationIntentSchema);
const CloudConfirmationPollSchema = {
    type: 'object',
    properties: {
        deviceCode: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['deviceCode'],
    additionalProperties: false,
};
exports.isCloudConfirmationPollProps = ajv.compile(CloudConfirmationPollSchema);
