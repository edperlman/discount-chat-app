"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsMessageHighlight = void 0;
const react_1 = require("react");
const MessageHighlightContext = (0, react_1.createContext)({});
const useIsMessageHighlight = (_id) => (0, react_1.useContext)(MessageHighlightContext).highlightMessageId === _id;
exports.useIsMessageHighlight = useIsMessageHighlight;
exports.default = MessageHighlightContext;
