"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const MessageToolbarItem = ({ id, icon, title, disabled, qa, onClick }) => {
    const hiddenActions = (0, ui_contexts_1.useLayoutHiddenActions)().messageToolbox;
    if (hiddenActions.includes(id)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageToolbarItem, { icon: icon, title: title, disabled: disabled, "data-qa-id": qa, "data-qa-type": 'message-action-menu', onClick: onClick }));
};
exports.default = MessageToolbarItem;
