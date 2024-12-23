"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsHistoryProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const BaseProps_1 = require("./BaseProps");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const groupsHistoryPropsSchema = (0, BaseProps_1.withGroupBaseProperties)({
    latest: {
        type: 'string',
        nullable: true,
    },
    oldest: {
        type: 'string',
        nullable: true,
    },
    inclusive: {
        type: 'string',
        nullable: true,
    },
    unreads: {
        type: 'string',
        nullable: true,
    },
    showThreadMessages: {
        type: 'string',
        nullable: true,
    },
    count: {
        type: 'number',
        nullable: true,
    },
    offset: {
        type: 'number',
        nullable: true,
    },
    sort: {
        type: 'string',
        nullable: true,
    },
});
exports.isGroupsHistoryProps = ajv.compile(groupsHistoryPropsSchema);
