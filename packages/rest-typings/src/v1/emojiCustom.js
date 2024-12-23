"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmojiCustomList = exports.isEmojiCustomDelete = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const emojiCustomDeletePropsSchema = {
    type: 'object',
    properties: {
        emojiId: {
            type: 'string',
        },
    },
    required: ['emojiId'],
    additionalProperties: false,
};
exports.isEmojiCustomDelete = ajv.compile(emojiCustomDeletePropsSchema);
const emojiCustomListSchema = {
    type: 'object',
    properties: {
        query: {
            type: 'string',
        },
        updatedSince: {
            type: 'string',
            nullable: true,
        },
        _updatedAt: {
            type: 'string',
        },
        _id: {
            type: 'string',
        },
    },
    required: [],
    additionalProperties: false,
};
exports.isEmojiCustomList = ajv.compile(emojiCustomListSchema);
