"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFederationJoinExternalPublicRoomProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
ajv.addFormat('matrix-room-id', (externalRoomId) => Boolean((externalRoomId === null || externalRoomId === void 0 ? void 0 : externalRoomId.charAt(0)) === '!' && (externalRoomId === null || externalRoomId === void 0 ? void 0 : externalRoomId.includes(':'))));
const FederationJoinExternalPublicRoomPropsSchema = {
    type: 'object',
    properties: {
        externalRoomId: {
            type: 'string',
            format: 'matrix-room-id',
        },
        roomName: {
            type: 'string',
            nullable: true,
        },
        pageToken: {
            type: 'string',
            nullable: true,
        },
    },
    additionalProperties: false,
    required: ['externalRoomId'],
};
exports.isFederationJoinExternalPublicRoomProps = ajv.compile(FederationJoinExternalPublicRoomPropsSchema);
