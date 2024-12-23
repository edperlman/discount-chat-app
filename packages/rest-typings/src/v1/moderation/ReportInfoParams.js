"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReportInfoParams = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const ajvParams = {
    type: 'object',
    properties: {
        reportId: {
            type: 'string',
            nullable: false,
            minLength: 1,
        },
    },
    required: ['reportId'],
    additionalProperties: false,
};
exports.isReportInfoParams = ajv.compile(ajvParams);
