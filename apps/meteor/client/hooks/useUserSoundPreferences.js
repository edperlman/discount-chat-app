"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserSoundPreferences = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const relativeVolume = (volume, masterVolume) => {
    return (volume * masterVolume) / 100;
};
const useUserSoundPreferences = () => {
    const masterVolume = (0, ui_contexts_1.useUserPreference)('masterVolume', 100) || 100;
    const notificationsSoundVolume = (0, ui_contexts_1.useUserPreference)('notificationsSoundVolume', 100) || 100;
    const voipRingerVolume = (0, ui_contexts_1.useUserPreference)('voipRingerVolume', 100) || 100;
    return {
        masterVolume,
        notificationsSoundVolume: relativeVolume(notificationsSoundVolume, masterVolume),
        voipRingerVolume: relativeVolume(voipRingerVolume, masterVolume),
    };
};
exports.useUserSoundPreferences = useUserSoundPreferences;
