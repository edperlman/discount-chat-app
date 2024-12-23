"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ChatContext_1 = require("../contexts/ChatContext");
const RoomContext_1 = require("../contexts/RoomContext");
const useChatMessagesInstance_1 = require("./hooks/useChatMessagesInstance");
const ChatProvider = ({ children, tmid }) => {
    const { _id: rid, encrypted } = (0, RoomContext_1.useRoom)();
    const value = (0, useChatMessagesInstance_1.useChatMessagesInstance)({ rid, tmid, encrypted });
    return (0, jsx_runtime_1.jsx)(ChatContext_1.ChatContext.Provider, { value: value, children: children });
};
exports.default = ChatProvider;
