"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVoipSounds = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useVoipSounds = () => {
    const { play, pause } = (0, ui_contexts_1.useCustomSound)();
    const masterVolume = (0, ui_contexts_1.useUserPreference)('masterVolume', 100) || 100;
    const voipRingerVolume = (0, ui_contexts_1.useUserPreference)('voipRingerVolume', 100) || 100;
    const audioVolume = Math.floor((voipRingerVolume * masterVolume) / 100);
    return (0, react_1.useMemo)(() => ({
        play: (soundId, loop = true) => {
            play(soundId, {
                volume: Number((audioVolume / 100).toPrecision(2)),
                loop,
            });
        },
        stop: (soundId) => pause(soundId),
        stopAll: () => {
            pause('telephone');
            pause('outbound-call-ringing');
        },
    }), [play, pause, audioVolume]);
};
exports.useVoipSounds = useVoipSounds;
