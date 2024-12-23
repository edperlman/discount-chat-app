"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const session_1 = require("meteor/session");
const react_1 = __importDefault(require("react"));
const createReactiveSubscriptionFactory_1 = require("../lib/createReactiveSubscriptionFactory");
const contextValue = {
    query: (0, createReactiveSubscriptionFactory_1.createReactiveSubscriptionFactory)((name) => session_1.Session.get(name)),
    dispatch: (name, value) => {
        session_1.Session.set(name, value);
    },
};
const SessionProvider = ({ children }) => (0, jsx_runtime_1.jsx)(ui_contexts_1.SessionContext.Provider, { children: children, value: contextValue });
exports.default = SessionProvider;
