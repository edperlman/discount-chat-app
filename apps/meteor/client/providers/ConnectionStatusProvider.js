"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = __importDefault(require("react"));
const useReactiveValue_1 = require("../hooks/useReactiveValue");
const getValue = () => (Object.assign(Object.assign({}, meteor_1.Meteor.status()), { reconnect: meteor_1.Meteor.reconnect }));
const ConnectionStatusProvider = ({ children }) => {
    const status = (0, useReactiveValue_1.useReactiveValue)(getValue);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.ConnectionStatusContext.Provider, { children: children, value: status });
};
exports.default = ConnectionStatusProvider;
