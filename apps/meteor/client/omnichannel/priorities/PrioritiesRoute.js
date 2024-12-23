"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const PrioritiesPage_1 = require("./PrioritiesPage");
const NotAuthorizedPage_1 = __importDefault(require("../../views/notAuthorized/NotAuthorizedPage"));
const PrioritiesRoute = () => {
    const canViewPriorities = (0, ui_contexts_1.usePermission)('manage-livechat-priorities');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const id = (0, ui_contexts_1.useRouteParameter)('id') || '';
    if (!canViewPriorities) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(PrioritiesPage_1.PrioritiesPage, { priorityId: id, context: context });
};
exports.default = PrioritiesRoute;
