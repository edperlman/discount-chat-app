"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGetUserReportsParams = void 0;
const Ajv_1 = require("../Ajv");
const ajvParams = {
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            nullable: false,
            minLength: 1,
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
    required: ['userId'],
    additionalProperties: false,
};
exports.isGetUserReportsParams = Ajv_1.ajv.compile(ajvParams);
