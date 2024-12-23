"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const CannedResponsesPage_1 = __importDefault(require("./CannedResponsesPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../views/notAuthorized/NotAuthorizedPage"));
const CannedResponsesRoute = () => {
    const canViewCannedResponses = (0, ui_contexts_1.usePermission)('manage-livechat-canned-responses');
    if (!canViewCannedResponses) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(CannedResponsesPage_1.default, {});
};
exports.default = CannedResponsesRoute;
