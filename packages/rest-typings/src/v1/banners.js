"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBannersDismissProps = exports.isBannersProps = exports.isBannersGetNewProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const BannersGetNewSchema = {
    type: 'object',
    properties: {
        platform: {
            type: 'string',
            enum: ['web', 'mobile'],
        },
        bid: {
            type: 'string',
        },
    },
    required: ['platform'],
    additionalProperties: false,
};
exports.isBannersGetNewProps = ajv.compile(BannersGetNewSchema);
const BannersSchema = {
    type: 'object',
    properties: {
        platform: {
            type: 'string',
            enum: ['web', 'mobile'],
        },
    },
    required: ['platform'],
    additionalProperties: false,
};
exports.isBannersProps = ajv.compile(BannersSchema);
const BannersDismissSchema = {
    type: 'object',
    properties: {
        bannerId: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['bannerId'],
    additionalProperties: false,
};
exports.isBannersDismissProps = ajv.compile(BannersDismissSchema);
