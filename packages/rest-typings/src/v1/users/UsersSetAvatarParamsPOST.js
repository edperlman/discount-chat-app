"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserSetAvatarParamsPOST = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const UserSetAvatarParamsPostSchema = {
    type: 'object',
    properties: {
        avatarUrl: {
            type: 'string',
            nullable: true,
        },
        userId: {
            type: 'string',
            nullable: true,
        },
        username: {
            type: 'string',
            nullable: true,
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isUserSetAvatarParamsPOST = ajv.compile(UserSetAvatarParamsPostSchema);
