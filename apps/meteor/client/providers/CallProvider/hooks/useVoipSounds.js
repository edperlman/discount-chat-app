"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipSounds = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useUserSoundPreferences_1 = require("../../../hooks/useUserSoundPreferences");
const useVoipSounds = () => {
    const { play, pause } = (0, ui_contexts_1.useCustomSound)();
    const { voipRingerVolume } = (0, useUserSoundPreferences_1.useUserSoundPreferences)();
    return (0, react_1.useMemo)(() => ({
        play: (soundId, loop = true) => {
            play(soundId, {
                volume: Number((voipRingerVolume / 100).toPrecision(2)),
                loop,
            });
        },
        stop: (soundId) => pause(soundId),
        stopAll: () => {
            pause('telephone');
            pause('outbound-call-ringing');
        },
    }), [play, pause, voipRingerVolume]);
};
exports.useVoipSounds = useVoipSounds;
