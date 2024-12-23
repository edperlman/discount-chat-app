"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModerationReportUserPost = void 0;
const Ajv_1 = require("../Ajv");
const reportUserPropsSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
        },
        description: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['userId', 'description'],
    additionalProperties: false,
};
exports.isModerationReportUserPost = Ajv_1.ajv.compile(reportUserPropsSchema);
