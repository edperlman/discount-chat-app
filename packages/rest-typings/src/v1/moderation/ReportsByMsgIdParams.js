"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReportsByMsgIdParams = void 0;
const Ajv_1 = require("../Ajv");
const schema = {
    type: 'object',
    properties: {
        msgId: {
            type: 'string',
            minLength: 1,
        },
        selector: {
            type: 'string',
        },
        count: {
            type: 'integer',
            nullable: true,
        },
        offset: {
            type: 'integer',
            nullable: true,
        },
        sort: {
            type: 'string',
            nullable: true,
        },
    },
    required: ['msgId'],
    additionalProperties: false,
};
exports.isReportsByMsgIdParams = Ajv_1.ajv.compile(schema);
