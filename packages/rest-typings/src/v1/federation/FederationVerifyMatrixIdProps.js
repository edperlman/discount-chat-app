"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFederationVerifyMatrixIdProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const FederationVerifyMatrixIdPropsSchema = {
    type: 'object',
    properties: {
        matrixIds: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            minItems: 1,
            maxItems: 15,
        },
    },
    additionalProperties: false,
    required: ['matrixIds'],
};
exports.isFederationVerifyMatrixIdProps = ajv.compile(FederationVerifyMatrixIdPropsSchema);
