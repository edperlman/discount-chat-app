"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersSendConfirmationEmailParamsPOST = void 0;
// TO-DO: import Ajv instance instead of creating a new one
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
const UsersSendConfirmationEmailParamsPOSTSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
        },
    },
    required: ['email'],
    additionalProperties: false,
};
exports.isUsersSendConfirmationEmailParamsPOST = ajv.compile(UsersSendConfirmationEmailParamsPOSTSchema);
