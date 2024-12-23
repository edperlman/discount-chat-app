"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatForwardQuickAction = void 0;
const react_1 = require("react");
const quickActions_1 = require("../../views/room/lib/quickActions");
const useChatForwardQuickAction = () => {
    return (0, react_1.useMemo)(() => ({
        groups: ['live'],
        id: quickActions_1.QuickActionsEnum.ChatForward,
        title: 'Forward_chat',
        icon: 'balloon-arrow-top-right',
        order: 2,
    }), []);
};
exports.useChatForwardQuickAction = useChatForwardQuickAction;
