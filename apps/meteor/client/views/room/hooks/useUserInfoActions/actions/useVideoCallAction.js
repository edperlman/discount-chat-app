"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVideoCallAction = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const VideoConfContext_1 = require("../../../../../contexts/VideoConfContext");
const VideoConfManager_1 = require("../../../../../lib/VideoConfManager");
const UserCardContext_1 = require("../../../contexts/UserCardContext");
const useVideoConfWarning_1 = require("../../../contextualBar/VideoConference/hooks/useVideoConfWarning");
const useVideoCallAction = (user) => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const usernameSubscription = (0, ui_contexts_1.useUserSubscriptionByName)((_a = user.username) !== null && _a !== void 0 ? _a : '');
    const room = (0, ui_contexts_1.useUserRoom)((usernameSubscription === null || usernameSubscription === void 0 ? void 0 : usernameSubscription.rid) || '');
    const { closeUserCard } = (0, UserCardContext_1.useUserCard)();
    const dispatchWarning = (0, useVideoConfWarning_1.useVideoConfWarning)();
    const dispatchPopup = (0, VideoConfContext_1.useVideoConfDispatchOutgoing)();
    const isCalling = (0, VideoConfContext_1.useVideoConfIsCalling)();
    const isRinging = (0, VideoConfContext_1.useVideoConfIsRinging)();
    const ownUserId = (0, ui_contexts_1.useUserId)();
    const enabledForDMs = (0, ui_contexts_1.useSetting)('VideoConf_Enable_DMs');
    const permittedToCallManagement = (0, ui_contexts_1.usePermission)('call-management', room === null || room === void 0 ? void 0 : room._id);
    const videoCallOption = (0, react_1.useMemo)(() => {
        const action = () => __awaiter(void 0, void 0, void 0, function* () {
            if (isCalling || isRinging || !room) {
                return;
            }
            try {
                yield VideoConfManager_1.VideoConfManager.loadCapabilities();
                closeUserCard();
                dispatchPopup({ rid: room._id });
            }
            catch (error) {
                dispatchWarning(error.error);
            }
        });
        const shouldShowStartCall = room && !(0, core_typings_1.isRoomFederated)(room) && user._id !== ownUserId && enabledForDMs && permittedToCallManagement && !isCalling && !isRinging;
        return shouldShowStartCall
            ? {
                type: 'communication',
                title: t('Video_call'),
                icon: 'video',
                onClick: action,
            }
            : undefined;
    }, [
        room,
        user._id,
        ownUserId,
        enabledForDMs,
        permittedToCallManagement,
        isCalling,
        isRinging,
        t,
        dispatchPopup,
        dispatchWarning,
        closeUserCard,
    ]);
    return videoCallOption;
};
exports.useVideoCallAction = useVideoCallAction;
