"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDmCreateProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
exports.isDmCreateProps = ajv.compile({
    oneOf: [
        {
            type: 'object',
            properties: {
                usernames: {
                    type: 'string',
                },
                excludeSelf: {
                    type: 'boolean',
                },
            },
            required: ['usernames'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                },
                excludeSelf: {
                    type: 'boolean',
                },
            },
            required: ['username'],
            additionalProperties: false,
        },
    ],
});
