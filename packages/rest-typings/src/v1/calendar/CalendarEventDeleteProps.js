"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCalendarEventDeleteProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default();
const calendarEventDeletePropsSchema = {
    type: 'object',
    properties: {
        eventId: {
            type: 'string',
        },
    },
    required: ['eventId'],
    additionalProperties: false,
};
exports.isCalendarEventDeleteProps = ajv.compile(calendarEventDeletePropsSchema);
