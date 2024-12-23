"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSendInvitationEmailParams = exports.isFindOrCreateInviteParams = exports.isValidateInviteTokenProps = exports.isUseInviteTokenProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UseInviteTokenPropsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isUseInviteTokenProps = ajv.compile(UseInviteTokenPropsSchema);
const ValidateInviteTokenPropsSchema = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
        },
    },
    required: ['token'],
    additionalProperties: false,
};
exports.isValidateInviteTokenProps = ajv.compile(ValidateInviteTokenPropsSchema);
const FindOrCreateInviteParamsSchema = {
    type: 'object',
    properties: {
        rid: {
            type: 'string',
        },
        days: {
            type: 'integer',
        },
        maxUses: {
            type: 'integer',
        },
    },
    required: ['rid', 'days', 'maxUses'],
    additionalProperties: false,
};
exports.isFindOrCreateInviteParams = ajv.compile(FindOrCreateInviteParamsSchema);
const SendInvitationEmailParamsSchema = {
    type: 'object',
    properties: {
        emails: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['emails'],
    additionalProperties: false,
};
exports.isSendInvitationEmailParams = ajv.compile(SendInvitationEmailParamsSchema);
