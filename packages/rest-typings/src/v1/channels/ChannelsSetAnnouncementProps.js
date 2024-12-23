"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChannelsSetAnnouncementProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const channelsSetAnnouncementPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                roomId: {
                    type: 'string',
                },
                announcement: {
                    type: 'string',
                },
            },
            required: ['roomId', 'announcement'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                roomName: {
                    type: 'string',
                },
                announcement: {
                    type: 'string',
                },
            },
            required: ['roomName', 'announcement'],
            additionalProperties: false,
        },
    ],
};
exports.isChannelsSetAnnouncementProps = ajv.compile(channelsSetAnnouncementPropsSchema);
