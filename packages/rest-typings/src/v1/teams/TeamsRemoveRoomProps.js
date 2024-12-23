"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsRemoveRoomProps = exports.teamsRemoveRoomPropsSchema = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
exports.teamsRemoveRoomPropsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                teamId: {
                    type: 'string',
                },
                roomId: {
                    type: 'string',
                },
            },
            required: ['teamId', 'roomId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                teamName: {
                    type: 'string',
                },
                roomId: {
                    type: 'string',
                },
            },
            required: ['teamName', 'roomId'],
            additionalProperties: false,
        },
    ],
};
exports.isTeamsRemoveRoomProps = ajv.compile(exports.teamsRemoveRoomPropsSchema);
