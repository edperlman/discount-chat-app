"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLicensesInfoProps = exports.isLicensesAddProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const licensesAddPropsSchema = {
    type: 'object',
    properties: {
        license: {
            type: 'string',
        },
    },
    required: ['license'],
    additionalProperties: false,
};
exports.isLicensesAddProps = ajv.compile(licensesAddPropsSchema);
const licensesInfoPropsSchema = {
    type: 'object',
    properties: {
        loadValues: {
            type: 'boolean',
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isLicensesInfoProps = ajv.compile(licensesInfoPropsSchema);
