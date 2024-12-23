"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCalendarEventUpdateProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const calendarEventUpdatePropsSchema = {
    type: 'object',
    properties: {
        eventId: {
            type: 'string',
            nullable: false,
        },
        startTime: {
            type: 'string',
            nullable: false,
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
    required: ['eventId', 'startTime', 'subject', 'description'],
    additionalProperties: false,
};
exports.isCalendarEventUpdateProps = ajv.compile(calendarEventUpdatePropsSchema);
