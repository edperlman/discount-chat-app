"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRetentionPolicy = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const convertTimeUnit_1 = require("../../../lib/convertTimeUnit");
const hasRetentionPolicy = (room) => 'retention' in room && room.retention !== undefined;
const isRetentionOverridden = (room) => 'overrideGlobal' in room.retention && room.retention.overrideGlobal;
const isActive = (room, { enabled, appliesToChannels, appliesToGroups, appliesToDMs }) => {
    if (!enabled) {
        return false;
    }
    if (hasRetentionPolicy(room) && room.retention.enabled !== undefined) {
        return room.retention.enabled;
    }
    switch (room.t) {
        case 'c':
            return appliesToChannels;
        case 'p':
            return appliesToGroups;
        case 'd':
            return appliesToDMs;
    }
    return false;
};
const extractFilesOnly = (room, { filesOnly }) => {
    if (hasRetentionPolicy(room) && isRetentionOverridden(room)) {
        return room.retention.filesOnly;
    }
    return filesOnly;
};
const extractExcludePinned = (room, { doNotPrunePinned }) => {
    if (hasRetentionPolicy(room) && isRetentionOverridden(room)) {
        return room.retention.excludePinned;
    }
    return doNotPrunePinned;
};
const extractIgnoreThreads = (room, { ignoreThreads }) => {
    if (hasRetentionPolicy(room) && isRetentionOverridden(room)) {
        return room.retention.ignoreThreads;
    }
    return ignoreThreads;
};
const getMaxAge = (room, { maxAgeChannels, maxAgeGroups, maxAgeDMs }) => {
    if (hasRetentionPolicy(room) && isRetentionOverridden(room) && (0, convertTimeUnit_1.isValidTimespan)(room.retention.maxAge)) {
        return (0, convertTimeUnit_1.timeUnitToMs)(convertTimeUnit_1.TIMEUNIT.days, room.retention.maxAge);
    }
    if (room.t === 'c') {
        return maxAgeChannels;
    }
    if (room.t === 'p') {
        return maxAgeGroups;
    }
    if (room.t === 'd') {
        return maxAgeDMs;
    }
    return -Infinity;
};
const useRetentionPolicy = (room) => {
    const settings = {
        enabled: (0, ui_contexts_1.useSetting)('RetentionPolicy_Enabled', false),
        filesOnly: (0, ui_contexts_1.useSetting)('RetentionPolicy_FilesOnly', false),
        doNotPrunePinned: (0, ui_contexts_1.useSetting)('RetentionPolicy_DoNotPrunePinned', false),
        ignoreThreads: (0, ui_contexts_1.useSetting)('RetentionPolicy_DoNotPruneThreads', true),
        appliesToChannels: (0, ui_contexts_1.useSetting)('RetentionPolicy_AppliesToChannels', false),
        maxAgeChannels: (0, ui_contexts_1.useSetting)('RetentionPolicy_TTL_Channels', 2592000000),
        appliesToGroups: (0, ui_contexts_1.useSetting)('RetentionPolicy_AppliesToGroups', false),
        maxAgeGroups: (0, ui_contexts_1.useSetting)('RetentionPolicy_TTL_Groups', 2592000000),
        appliesToDMs: (0, ui_contexts_1.useSetting)('RetentionPolicy_AppliesToDMs', false),
        maxAgeDMs: (0, ui_contexts_1.useSetting)('RetentionPolicy_TTL_DMs', 2592000000),
    };
    if (!room) {
        return undefined;
    }
    return {
        enabled: settings.enabled,
        isActive: isActive(room, settings),
        filesOnly: extractFilesOnly(room, settings),
        excludePinned: extractExcludePinned(room, settings),
        ignoreThreads: extractIgnoreThreads(room, settings),
        maxAge: getMaxAge(room, settings),
    };
};
exports.useRetentionPolicy = useRetentionPolicy;
