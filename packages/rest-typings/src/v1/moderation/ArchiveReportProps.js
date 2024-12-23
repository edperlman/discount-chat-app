"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArchiveReportProps = void 0;
const Ajv_1 = require("../Ajv");
const archiveReportPropsSchema = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
        },
        msgId: {
            type: 'string',
        },
        reason: {
            type: 'string',
            nullable: true,
        },
        action: {
            type: 'string',
            nullable: true,
        },
    },
    oneOf: [{ required: ['msgId'] }, { required: ['userId'] }],
    additionalProperties: false,
};
exports.isArchiveReportProps = Ajv_1.ajv.compile(archiveReportPropsSchema);
