"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOauthAppsAddParams = void 0;
const Ajv_1 = require("../Ajv");
const OauthAppsAddParamsSchema = {
    type: 'object',
    properties: {
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
    required: ['name', 'active', 'redirectUri'],
    additionalProperties: false,
};
exports.isOauthAppsAddParams = Ajv_1.ajv.compile(OauthAppsAddParamsSchema);
