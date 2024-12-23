"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsFilesProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const BaseProps_1 = require("./BaseProps");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const GroupsFilesPropsSchema = (0, BaseProps_1.withGroupBaseProperties)({
    count: {
        type: 'number',
        nullable: true,
    },
    sort: {
        type: 'string',
        nullable: true,
    },
    query: {
        type: 'string',
        nullable: true,
    },
    offset: {
        type: 'number',
        nullable: true,
    },
});
exports.isGroupsFilesProps = ajv.compile(GroupsFilesPropsSchema);
