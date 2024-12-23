"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ise2eSetUserPublicAndPrivateKeysParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const e2eSetUserPublicAndPrivateKeysParamsPOSTSchema = {
    type: 'object',
    properties: {
        public_key: {
            type: 'string',
        },
        private_key: {
            type: 'string',
        },
        force: {
            type: 'boolean',
        },
    },
    additionalProperties: false,
    required: ['public_key', 'private_key'],
};
exports.ise2eSetUserPublicAndPrivateKeysParamsPOST = ajv.compile(e2eSetUserPublicAndPrivateKeysParamsPOSTSchema);
