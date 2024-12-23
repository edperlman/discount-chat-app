"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFederationSearchPublicRoomsProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const federationSearchPublicRoomsPropsSchema = {
    type: 'object',
    properties: {
        serverName: {
            type: 'string',
            nullable: true,
        },
        roomName: {
            type: 'string',
            nullable: true,
        },
        count: {
            type: 'string',
            nullable: true,
        },
        pageToken: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
};
exports.isFederationSearchPublicRoomsProps = ajv.compile(federationSearchPublicRoomsPropsSchema);
