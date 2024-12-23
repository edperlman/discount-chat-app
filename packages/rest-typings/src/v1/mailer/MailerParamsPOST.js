"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMailerProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const MailerPropsSchema = {
    type: 'object',
    properties: {
        from: {
            type: 'string',
        },
        subject: {
            type: 'string',
        },
        body: {
            type: 'string',
        },
        dryrun: {
            type: 'boolean',
            nullable: true,
        },
        query: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['from', 'subject', 'body'],
    additionalProperties: false,
};
exports.isMailerProps = ajv.compile(MailerPropsSchema);
