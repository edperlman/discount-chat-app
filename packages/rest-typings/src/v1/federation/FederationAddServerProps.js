"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFederationAddServerProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const FederationAddServerPropsSchema = {
    type: 'object',
    properties: {
        serverName: {
            type: 'string',
        },
    },
    additionalProperties: false,
    required: ['serverName'],
};
exports.isFederationAddServerProps = ajv.compile(FederationAddServerPropsSchema);
