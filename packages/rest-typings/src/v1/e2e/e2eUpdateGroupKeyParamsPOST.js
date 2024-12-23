"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ise2eUpdateGroupKeyParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const e2eUpdateGroupKeyParamsPOSTSchema = {
    type: 'object',
    properties: {
        uid: {
            type: 'string',
        },
        rid: {
            type: 'string',
        },
        key: {
            type: 'string',
        },
    },
    additionalProperties: false,
    required: ['uid', 'rid', 'key'],
};
exports.ise2eUpdateGroupKeyParamsPOST = ajv.compile(e2eUpdateGroupKeyParamsPOSTSchema);
