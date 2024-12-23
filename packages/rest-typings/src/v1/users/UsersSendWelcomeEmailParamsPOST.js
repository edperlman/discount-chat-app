"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsersSendWelcomeEmailProps = void 0;
const Ajv_1 = require("../Ajv");
const UsersSendWelcomeEmailParamsPostSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'basic_email',
        },
    },
    required: ['email'],
    additionalProperties: false,
};
exports.isUsersSendWelcomeEmailProps = Ajv_1.ajv.compile(UsersSendWelcomeEmailParamsPostSchema);
