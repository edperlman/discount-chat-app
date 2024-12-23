"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModerationDeleteMsgHistoryParams = void 0;
const Ajv_1 = require("../Ajv");
const ajvParams = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            nullable: false,
            minLength: 1,
        },
        reason: {
            type: 'string',
        },
    },
    required: ['userId'],
    additionalProperties: false,
};
exports.isModerationDeleteMsgHistoryParams = Ajv_1.ajv.compile(ajvParams);
