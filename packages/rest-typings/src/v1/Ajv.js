"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajv = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({
    coerceTypes: true,
    allowUnionTypes: true,
});
exports.ajv = ajv;
(0, ajv_formats_1.default)(ajv);
ajv.addFormat('basic_email', /^[^@]+@[^@]+$/);
ajv.addFormat('rfc_email', /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
ajv.addKeyword({
    keyword: 'isNotEmpty',
    type: 'string',
    validate: (_schema, data) => typeof data === 'string' && !!data.trim(),
});
