"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCalendarEventCreateProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const calendarEventCreatePropsSchema = {
    type: 'object',
    properties: {
        startTime: {
            type: 'string',
            nullable: false,
        },
        externalId: {
            type: 'string',
            nullable: true,
        },
        subject: {
            type: 'string',
            nullable: false,
        },
        description: {
            type: 'string',
            nullable: false,
        },
        meetingUrl: {
            type: 'string',
            nullable: true,
        },
        reminderMinutesBeforeStart: {
            type: 'number',
            nullable: true,
        },
    },
    required: ['startTime', 'subject', 'description'],
    additionalProperties: false,
};
exports.isCalendarEventCreateProps = ajv.compile(calendarEventCreatePropsSchema);
