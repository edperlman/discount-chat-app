"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDnsResolveSrvProps = exports.isDnsResolveTxtProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const dnsResolveTxtPropsSchema = {
    type: 'object',
    properties: {
        url: {
            type: 'string',
        },
    },
    required: ['url'],
    additionalProperties: false,
};
exports.isDnsResolveTxtProps = ajv.compile(dnsResolveTxtPropsSchema);
const DnsResolveSrvSchema = {
    type: 'object',
    properties: {
        url: {
            type: 'string',
        },
    },
    required: ['url'],
    additionalProperties: false,
};
exports.isDnsResolveSrvProps = ajv.compile(DnsResolveSrvSchema);
