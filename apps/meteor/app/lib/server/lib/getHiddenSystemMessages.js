"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHiddenSystemMessages = void 0;
const getHiddenSystemMessages = (room, hiddenSystemMessages) => {
    const hiddenTypes = hiddenSystemMessages.reduce((array, value) => {
        const newValue = value === 'mute_unmute' ? ['user-muted', 'user-unmuted'] : [value];
        return [...array, ...newValue];
    }, []);
    return Array.isArray(room === null || room === void 0 ? void 0 : room.sysMes) ? room.sysMes : hiddenTypes;
};
exports.getHiddenSystemMessages = getHiddenSystemMessages;
