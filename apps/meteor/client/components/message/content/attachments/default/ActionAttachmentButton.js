"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const usePerformActionMutation_1 = require("./hooks/usePerformActionMutation");
const ActionAttachmentButton = ({ children, processingType, msg, mid }) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const performActionMutation = (0, usePerformActionMutation_1.usePerformActionMutation)({
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, value: msg, id: mid, disabled: performActionMutation.isLoading, onClick: (event) => {
            event.preventDefault();
            performActionMutation.mutate({
                processingType,
                msg,
                mid,
            });
        }, children: children }));
};
exports.default = ActionAttachmentButton;
