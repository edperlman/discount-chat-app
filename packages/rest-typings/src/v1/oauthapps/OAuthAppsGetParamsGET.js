"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOauthAppsGetParams = void 0;
const Ajv_1 = require("../Ajv");
const oauthAppsGetParamsSchema = {
    oneOf: [
        {
            type: 'object',
            properties: {
                _id: {
                    type: 'string',
                },
            },
            required: ['_id'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                clientId: {
                    type: 'string',
                },
            },
            required: ['clientId'],
            additionalProperties: false,
        },
        {
            type: 'object',
            properties: {
                appId: {
                    type: 'string',
                },
            },
            required: ['appId'],
            additionalProperties: false,
        },
    ],
};
exports.isOauthAppsGetParams = Ajv_1.ajv.compile(oauthAppsGetParamsSchema);
