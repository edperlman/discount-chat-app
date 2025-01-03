"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDmKickProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const DmKickPropsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string',
        },
        userId: {
            type: 'string',
        },
    },
    required: ['roomId', 'userId'],
    additionalProperties: false,
};
exports.isDmKickProps = ajv.compile(DmKickPropsSchema);