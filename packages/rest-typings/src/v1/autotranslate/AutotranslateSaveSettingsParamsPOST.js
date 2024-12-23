"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAutotranslateSaveSettingsParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const AutotranslateSaveSettingsParamsPostSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        field: {
            enum: ['autoTranslate', 'autoTranslateLanguage'],
        },
        value: {
            anyOf: [{ type: 'boolean' }, { type: 'string' }],
        },
        defaultLanguage: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['roomId', 'field', 'value'],
    additionalProperties: false,
};
exports.isAutotranslateSaveSettingsParamsPOST = ajv.compile(AutotranslateSaveSettingsParamsPostSchema);
