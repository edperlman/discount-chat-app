"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const react_1 = __importDefault(require("react"));
const useMessageBlockContextValue_1 = require("../../../uikit/hooks/useMessageBlockContextValue");
const GazzodownText_1 = __importDefault(require("../../GazzodownText"));
const UiKitMessageBlock = ({ rid, mid, blocks }) => {
    const contextValue = (0, useMessageBlockContextValue_1.useMessageBlockContextValue)(rid, mid);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBlock, { fixedWidth: true, children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitContext.Provider, { value: contextValue, children: (0, jsx_runtime_1.jsx)(GazzodownText_1.default, { children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitComponent, { render: fuselage_ui_kit_1.UiKitMessage, blocks: blocks }) }) }) }));
};
exports.default = UiKitMessageBlock;
