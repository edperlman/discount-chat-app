"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAutotranslateTranslateMessageParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const AutotranslateTranslateMessageParamsPostSchema = {
    type: 'object',
    properties: {
        messageId: {
            type: 'string',
        },
        targetLanguage: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['messageId'],
    additionalProperties: false,
};
exports.isAutotranslateTranslateMessageParamsPOST = ajv.compile(AutotranslateTranslateMessageParamsPostSchema);
