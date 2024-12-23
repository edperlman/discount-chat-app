"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const UsersInRolePage_1 = __importDefault(require("./UsersInRolePage"));
const useRole_1 = require("../hooks/useRole");
const UsersInRolePageWithData = () => {
    const _id = (0, ui_contexts_1.useRouteParameter)('_id');
    const role = (0, useRole_1.useRole)(_id);
    if (!role) {
        return null;
    }
    return (0, jsx_runtime_1.jsx)(UsersInRolePage_1.default, { role: role });
};
exports.default = UsersInRolePageWithData;
