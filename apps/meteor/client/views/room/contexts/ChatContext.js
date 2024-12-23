"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = exports.ChatContext = void 0;
const react_1 = require("react");
exports.ChatContext = (0, react_1.createContext)(undefined);
const useChat = () => (0, react_1.useContext)(exports.ChatContext);
exports.useChat = useChat;
