"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomMessageFields = void 0;
const ajv_1 = __importDefault(require("ajv"));
const mem_1 = __importDefault(require("mem"));
const ajv = new ajv_1.default();
const customFieldsValidate = (0, mem_1.default)((customFieldsSetting) => {
    const schema = JSON.parse(customFieldsSetting);
    if (schema.type && schema.type !== 'object') {
        throw new Error('Invalid custom fields config');
    }
    return ajv.compile(Object.assign(Object.assign({}, schema), { type: 'object', additionalProperties: false }));
}, { maxAge: 1000 * 60 });
const validateCustomMessageFields = ({ customFields, messageCustomFieldsEnabled, messageCustomFields, }) => {
    // get the json schema for the custom fields of the message and validate it using ajv
    // if the validation fails, throw an error
    // if there are no custom fields, the message object remains unchanged
    if (messageCustomFieldsEnabled !== true) {
        throw new Error('Custom fields not enabled');
    }
    const validate = customFieldsValidate(messageCustomFields);
    if (!validate(customFields)) {
        throw new Error('Invalid custom fields');
    }
};
exports.validateCustomMessageFields = validateCustomMessageFields;
