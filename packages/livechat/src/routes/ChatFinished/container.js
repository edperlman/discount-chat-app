"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_router_1 = require("preact-router");
const hooks_1 = require("preact/hooks");
const react_i18next_1 = require("react-i18next");
const store_1 = require("../../store");
const component_1 = __importDefault(require("./component"));
const ChatFinishedContainer = ({ ref, t }) => {
    const { config: { messages: { conversationFinishedMessage: greeting, conversationFinishedText: message }, }, } = (0, hooks_1.useContext)(store_1.StoreContext);
    const handleRedirect = () => {
        (0, preact_router_1.route)('/');
    };
    return (0, jsx_runtime_1.jsx)(component_1.default, { ref: ref, title: t('chat_finished'), greeting: greeting, message: message, onRedirectChat: handleRedirect });
};
exports.default = (0, react_i18next_1.withTranslation)()(ChatFinishedContainer);
