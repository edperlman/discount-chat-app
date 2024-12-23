"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsRoomOverMacLimit = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const useIsOverMacLimit_1 = require("./useIsOverMacLimit");
const getPeriod = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const useIsRoomOverMacLimit = (room) => {
    const isOverMacLimit = (0, useIsOverMacLimit_1.useIsOverMacLimit)();
    if (!(0, core_typings_1.isOmnichannelRoom)(room) && !(0, core_typings_1.isVoipRoom)(room)) {
        return false;
    }
    if (room.closedAt) {
        return false;
    }
    const { v: { activity = [] } = {} } = room;
    const currentPeriod = getPeriod(new Date());
    return isOverMacLimit && !activity.includes(currentPeriod);
};
exports.useIsRoomOverMacLimit = useIsRoomOverMacLimit;
