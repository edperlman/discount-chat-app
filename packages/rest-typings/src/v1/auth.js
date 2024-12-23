"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoginProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const loginPropsSchema = {
    type: 'object',
    properties: {
        user: { type: 'object', nullable: true },
        username: { type: 'string', nullable: true },
        password: {
            oneOf: [
                { type: 'string', nullable: true },
                { type: 'object', nullable: true },
            ],
        },
        email: { type: 'string', nullable: true },
        code: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: false,
};
exports.isLoginProps = ajv.compile(loginPropsSchema);
