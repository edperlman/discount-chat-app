"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeamsListChildrenProps = void 0;
const Ajv_1 = require("../Ajv");
const TeamsListChildrenPropsSchema = {
    type: 'object',
    properties: {
        teamId: { type: 'string' },
        teamName: { type: 'string' },
        type: { type: 'string', enum: ['channels', 'discussions'] },
        roomId: { type: 'string' },
        filter: { type: 'string' },
        offset: { type: 'number' },
        count: { type: 'number' },
        sort: { type: 'string' },
    },
    additionalProperties: false,
    oneOf: [{ required: ['teamId'] }, { required: ['teamName'] }, { required: ['roomId'] }],
};
exports.isTeamsListChildrenProps = Ajv_1.ajv.compile(TeamsListChildrenPropsSchema);
