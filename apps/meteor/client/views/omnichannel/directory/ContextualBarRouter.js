"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const CallsContextualBarDirectory_1 = __importDefault(require("./CallsContextualBarDirectory"));
const ChatsContextualBar_1 = __importDefault(require("./ChatsContextualBar"));
const ContactContextualBar_1 = __importDefault(require("./ContactContextualBar"));
const ContextualBarRouter = () => {
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    switch (tab) {
        case 'contacts':
            return (0, jsx_runtime_1.jsx)(ContactContextualBar_1.default, {});
        case 'chats':
            return (0, jsx_runtime_1.jsx)(ChatsContextualBar_1.default, {});
        case 'calls':
            return (0, jsx_runtime_1.jsx)(CallsContextualBarDirectory_1.default, {});
        default:
            return null;
    }
};
exports.default = ContextualBarRouter;
