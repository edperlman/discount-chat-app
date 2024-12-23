"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOmniChatSortQuery = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const getOmniChatSortQuery = (sortByMechanism = core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp) => {
    switch (sortByMechanism) {
        case core_typings_1.OmnichannelSortingMechanismSettingType.Priority:
            return { priorityWeight: 1, ts: 1, _updatedAt: -1 };
        case core_typings_1.OmnichannelSortingMechanismSettingType.SLAs:
            return { estimatedWaitingTimeQueue: 1, ts: 1, _updatedAt: -1 };
        case core_typings_1.OmnichannelSortingMechanismSettingType.Timestamp:
        default:
            return { ts: 1, _updatedAt: -1 };
    }
};
exports.getOmniChatSortQuery = getOmniChatSortQuery;
