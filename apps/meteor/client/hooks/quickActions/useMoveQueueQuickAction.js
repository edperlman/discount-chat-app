"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMoveQueueQuickAction = void 0;
const react_1 = require("react");
const quickActions_1 = require("../../views/room/lib/quickActions");
const useMoveQueueQuickAction = () => {
    return (0, react_1.useMemo)(() => ({
        groups: ['live'],
        id: quickActions_1.QuickActionsEnum.MoveQueue,
        title: 'Move_queue',
        icon: 'burger-arrow-left',
        order: 1,
    }), []);
};
exports.useMoveQueueQuickAction = useMoveQueueQuickAction;
