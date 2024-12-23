"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsMembersProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const BaseProps_1 = require("./BaseProps");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const GroupsMembersPropsSchema = (0, BaseProps_1.withGroupBaseProperties)({
    offset: {
        type: 'number',
        nullable: true,
    },
    count: {
        type: 'number',
        nullable: true,
    },
    filter: {
        type: 'string',
        nullable: true,
    },
    status: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
    },
});
exports.isGroupsMembersProps = ajv.compile(GroupsMembersPropsSchema);
