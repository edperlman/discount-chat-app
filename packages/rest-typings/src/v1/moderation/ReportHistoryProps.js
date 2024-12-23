"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReportHistoryProps = void 0;
const Ajv_1 = require("../Ajv");
const reportHistoryPropsSchema = {
    type: 'object',
    properties: {
        latest: {
            type: 'string',
            format: 'date-time',
            nullable: true,
        },
        oldest: {
            type: 'string',
            format: 'date-time',
            nullable: true,
        },
        selector: {
            type: 'string',
            nullable: true,
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
    additionalProperties: false,
};
exports.isReportHistoryProps = Ajv_1.ajv.compile(reportHistoryPropsSchema);
