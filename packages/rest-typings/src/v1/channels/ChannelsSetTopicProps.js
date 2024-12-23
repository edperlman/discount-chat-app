"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetTopicProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetTopicPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                topic: {
                    type: 'string',
                },
            },
            required: ['roomId', 'topic'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                topic: {
                    type: 'string',
                },
            },
            required: ['roomName', 'topic'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetTopicProps = ajv.compile(channelsSetTopicPropsSchema);
