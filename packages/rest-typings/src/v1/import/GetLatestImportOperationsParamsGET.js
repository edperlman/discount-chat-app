"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGetLatestImportOperationsParamsGET = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const GetLatestImportOperationsParamsGETSchema = {
    type: 'object',
    properties: {},
    additionalProperties: false,
    required: [],
};
exports.isGetLatestImportOperationsParamsGET = ajv.compile(GetLatestImportOperationsParamsGETSchema);
