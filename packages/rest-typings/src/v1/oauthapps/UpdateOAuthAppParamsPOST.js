"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpdateOAuthAppParams = void 0;
const Ajv_1 = require("../Ajv");
const UpdateOAuthAppParamsSchema = {
    type: 'object',
    properties: {
        appId: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        active: {
            type: 'boolean',
        },
        redirectUri: {
            type: 'string',
        },
    },
    required: ['appId', 'name', 'active', 'redirectUri'],
    additionalProperties: false,
};
exports.isUpdateOAuthAppParams = Ajv_1.ajv.compile(UpdateOAuthAppParamsSchema);
