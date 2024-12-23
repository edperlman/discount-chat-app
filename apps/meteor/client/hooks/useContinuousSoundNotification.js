"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContinuousSoundNotification = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useUserSoundPreferences_1 = require("./useUserSoundPreferences");
const CustomSounds_1 = require("../../app/custom-sounds/client/lib/CustomSounds");
const query = { t: 'l', ls: { $exists: false }, open: true };
const useContinuousSoundNotification = () => {
    const userSubscriptions = (0, ui_contexts_1.useUserSubscriptions)(query);
    const playNewRoomSoundContinuously = (0, ui_contexts_1.useSetting)('Livechat_continuous_sound_notification_new_livechat_room');
    const newRoomNotification = (0, ui_contexts_1.useUserPreference)('newRoomNotification');
    const { notificationsSoundVolume } = (0, useUserSoundPreferences_1.useUserSoundPreferences)();
    const continuousCustomSoundId = newRoomNotification && `${newRoomNotification}-continuous`;
    (0, react_1.useEffect)(() => {
        let audio;
        if (playNewRoomSoundContinuously && continuousCustomSoundId) {
            audio = Object.assign(Object.assign({}, CustomSounds_1.CustomSounds.getSound(newRoomNotification)), { _id: continuousCustomSoundId });
            CustomSounds_1.CustomSounds.add(audio);
        }
        return () => {
            if (audio) {
                CustomSounds_1.CustomSounds.remove(audio);
            }
        };
    }, [continuousCustomSoundId, newRoomNotification, playNewRoomSoundContinuously]);
    (0, react_1.useEffect)(() => {
        if (!continuousCustomSoundId) {
            return;
        }
        if (!playNewRoomSoundContinuously) {
            CustomSounds_1.CustomSounds.pause(continuousCustomSoundId);
            return;
        }
        if (userSubscriptions.length === 0) {
            CustomSounds_1.CustomSounds.pause(continuousCustomSoundId);
            return;
        }
        CustomSounds_1.CustomSounds.play(continuousCustomSoundId, {
            volume: notificationsSoundVolume,
            loop: true,
        });
    }, [continuousCustomSoundId, playNewRoomSoundContinuously, userSubscriptions, notificationsSoundVolume]);
};
exports.useContinuousSoundNotification = useContinuousSoundNotification;
