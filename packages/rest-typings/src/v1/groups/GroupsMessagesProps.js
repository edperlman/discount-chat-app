"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsMessagesProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const BaseProps_1 = require("./BaseProps");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const GroupsMessagesPropsSchema = (0, BaseProps_1.withGroupBaseProperties)({
    roomId: {
        type: 'string',
    },
    mentionIds: {
        type: 'string',
    },
    starredIds: {
        type: 'string',
    },
    pinned: {
        type: 'string',
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
    query: {
        type: 'string',
        nullable: true,
    },
});
exports.isGroupsMessagesProps = ajv.compile(GroupsMessagesPropsSchema);
