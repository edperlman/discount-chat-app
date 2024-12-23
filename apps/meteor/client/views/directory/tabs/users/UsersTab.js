"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const UsersTable_1 = __importDefault(require("./UsersTable"));
const NotAuthorizedPage_1 = __importDefault(require("../../../notAuthorized/NotAuthorizedPage"));
const UsersTab = (props) => {
    const canViewOutsideRoom = (0, ui_contexts_1.usePermission)('view-outside-room');
    const canViewDM = (0, ui_contexts_1.usePermission)('view-d-room');
    if (canViewOutsideRoom && canViewDM) {
        return (0, jsx_runtime_1.jsx)(UsersTable_1.default, Object.assign({}, props));
    }
    return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
};
exports.default = UsersTab;
