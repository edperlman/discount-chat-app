"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDmCloseProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const DmClosePropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
    },
    required: ['roomId'],
    additionalProperties: false,
};
exports.isDmCloseProps = ajv.compile(DmClosePropsSchema);
