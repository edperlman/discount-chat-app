"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCloseChatQuickAction = void 0;
const react_1 = require("react");
const quickActions_1 = require("../../views/room/lib/quickActions");
const useCloseChatQuickAction = () => {
    return (0, react_1.useMemo)(() => ({
        groups: ['live'],
        id: quickActions_1.QuickActionsEnum.CloseChat,
        title: 'End_conversation',
        icon: 'balloon-close-top-right',
        order: 5,
        color: 'danger',
    }), []);
};
exports.useCloseChatQuickAction = useCloseChatQuickAction;
