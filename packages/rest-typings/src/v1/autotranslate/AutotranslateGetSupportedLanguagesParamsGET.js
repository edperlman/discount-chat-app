"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAutotranslateGetSupportedLanguagesParamsGET = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const AutotranslateGetSupportedLanguagesParamsGETSchema = {
    type: 'object',
    properties: {
        targetLanguage: {
            type: 'string',
        },
    },
    required: ['targetLanguage'],
    additionalProperties: false,
};
exports.isAutotranslateGetSupportedLanguagesParamsGET = ajv.compile(AutotranslateGetSupportedLanguagesParamsGETSchema);
