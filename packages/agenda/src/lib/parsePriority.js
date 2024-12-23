"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePriority = void 0;
const parsePriority = (priority) => {
    if (!priority) {
        return 0;
    }
    const priorityMap = {
        lowest: -20,
        low: -10,
        normal: 0,
        high: 10,
        highest: 20,
    };
    if (typeof priority === 'number') {
        return priority;
    }
    return priorityMap[priority] || 0;
};
exports.parsePriority = parsePriority;
