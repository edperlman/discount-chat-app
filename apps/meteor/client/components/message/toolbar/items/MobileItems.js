"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ForwardMessageAction_1 = __importDefault(require("./actions/ForwardMessageAction"));
const JumpToMessageAction_1 = __importDefault(require("./actions/JumpToMessageAction"));
const QuoteMessageAction_1 = __importDefault(require("./actions/QuoteMessageAction"));
const ReactionMessageAction_1 = __importDefault(require("./actions/ReactionMessageAction"));
const ReplyInThreadMessageAction_1 = __importDefault(require("./actions/ReplyInThreadMessageAction"));
const MobileItems = ({ message, room, subscription }) => {
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ReactionMessageAction_1.default, { message: message, room: room, subscription: subscription }), (0, jsx_runtime_1.jsx)(QuoteMessageAction_1.default, { message: message, subscription: subscription }), (0, jsx_runtime_1.jsx)(ReplyInThreadMessageAction_1.default, { message: message, room: room, subscription: subscription }), (0, jsx_runtime_1.jsx)(ForwardMessageAction_1.default, { message: message }), (0, jsx_runtime_1.jsx)(JumpToMessageAction_1.default, { id: 'jump-to-message', message: message })] }));
};
exports.default = MobileItems;
