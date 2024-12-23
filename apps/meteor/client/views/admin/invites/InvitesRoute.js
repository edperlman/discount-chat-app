"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const InvitesPage_1 = __importDefault(require("./InvitesPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const InvitesRoute = () => {
    const canCreateInviteLinks = (0, ui_contexts_1.usePermission)('create-invite-links');
    if (!canCreateInviteLinks) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(InvitesPage_1.default, {});
};
exports.default = InvitesRoute;
