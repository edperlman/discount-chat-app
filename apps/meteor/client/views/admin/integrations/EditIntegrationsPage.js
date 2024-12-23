"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const EditIncomingWebhook_1 = __importDefault(require("./incoming/EditIncomingWebhook"));
const EditOutgoingWebhook_1 = __importDefault(require("./outgoing/EditOutgoingWebhook"));
const EditIntegrationsPage = () => {
    const type = (0, ui_contexts_1.useRouteParameter)('type');
    if (type === 'outgoing') {
        return (0, jsx_runtime_1.jsx)(EditOutgoingWebhook_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(EditIncomingWebhook_1.default, {});
};
exports.default = EditIntegrationsPage;
