"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsConvertToTeamProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsConvertToTeamPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                channelId: { type: 'string' },
            },
            required: ['channelId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                channelName: { type: 'string' },
            },
            required: ['channelName'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsConvertToTeamProps = ajv.compile(channelsConvertToTeamPropsSchema);
