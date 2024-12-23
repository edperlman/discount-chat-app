"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const JumpToMessageAction_1 = __importDefault(require("./actions/JumpToMessageAction"));
const DirectItems = ({ message, subscription }) => {
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: !!subscription && (0, jsx_runtime_1.jsx)(JumpToMessageAction_1.default, { id: 'jump-to-pin-message', message: message }) });
};
exports.default = DirectItems;
