"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupsConvertToTeamProps = void 0;
const ajv_1 = __importDefault(require("ajv"));
const BaseProps_1 = require("./BaseProps");
const ajv = new ajv_1.default({
    coerceTypes: true,
});
const GroupsConvertToTeamPropsSchema = (0, BaseProps_1.withGroupBaseProperties)();
exports.isGroupsConvertToTeamProps = ajv.compile(GroupsConvertToTeamPropsSchema);
