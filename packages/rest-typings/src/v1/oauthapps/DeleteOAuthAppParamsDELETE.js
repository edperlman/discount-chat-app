"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeleteOAuthAppParams = void 0;
const Ajv_1 = require("../Ajv");
const DeleteOAuthAppParamsSchema = {
    type: 'object',
    properties: {
        appId: {
            type: 'string',
        },
    },
    required: ['appId'],
    additionalProperties: false,
};
exports.isDeleteOAuthAppParams = Ajv_1.ajv.compile(DeleteOAuthAppParamsSchema);
