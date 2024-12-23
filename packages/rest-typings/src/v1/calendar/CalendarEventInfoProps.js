"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCalendarEventInfoProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const calendarEventInfoPropsSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            nullable: false,
        },
    },
    required: ['id'],
    additionalProperties: false,
};
exports.isCalendarEventInfoProps = ajv.compile(calendarEventInfoPropsSchema);
