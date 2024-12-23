"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUploadImportFileParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UploadImportFileParamsPostSchema = {
    type: 'object',
    properties: {
        binaryContent: {
            type: 'string',
        },
        contentType: {
            type: 'string',
        },
        fileName: {
            type: 'string',
        },
        importerKey: {
            type: 'string',
        },
    },
    additionalProperties: false,
    required: ['binaryContent', 'contentType', 'fileName', 'importerKey'],
};
exports.isUploadImportFileParamsPOST = ajv.compile(UploadImportFileParamsPostSchema);
