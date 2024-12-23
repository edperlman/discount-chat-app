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
exports.useMessageBlockContextValue = void 0;
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const useUiKitActionManager_1 = require("./useUiKitActionManager");
const VideoConfContext_1 = require("../../contexts/VideoConfContext");
const useVideoConfWarning_1 = require("../../views/room/contextualBar/VideoConference/hooks/useVideoConfWarning");
const useMessageBlockContextValue = (rid, mid) => {
    const joinCall = (0, VideoConfContext_1.useVideoConfJoinCall)();
    const setPreferences = (0, VideoConfContext_1.useVideoConfSetPreferences)();
    const isCalling = (0, VideoConfContext_1.useVideoConfIsCalling)();
    const isRinging = (0, VideoConfContext_1.useVideoConfIsRinging)();
    const dispatchWarning = (0, useVideoConfWarning_1.useVideoConfWarning)();
    const dispatchPopup = (0, VideoConfContext_1.useVideoConfDispatchOutgoing)();
    const videoConfManager = (0, VideoConfContext_1.useVideoConfManager)();
    const handleOpenVideoConf = (0, fuselage_hooks_1.useMutableCallback)((rid) => __awaiter(void 0, void 0, void 0, function* () {
        if (isCalling || isRinging) {
            return;
        }
        try {
            yield (videoConfManager === null || videoConfManager === void 0 ? void 0 : videoConfManager.loadCapabilities());
            dispatchPopup({ rid });
        }
        catch (error) {
            dispatchWarning(error.error);
        }
    }));
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    return {
        action: ({ appId, actionId, blockId, value }, event) => {
            if (appId === 'videoconf-core') {
                event.preventDefault();
                setPreferences({ mic: true, cam: false });
                if (actionId === 'join') {
                    return joinCall(blockId);
                }
                if (actionId === 'callBack') {
                    return handleOpenVideoConf(blockId);
                }
            }
            actionManager.emitInteraction(appId, {
                type: 'blockAction',
                actionId,
                payload: {
                    blockId,
                    value,
                },
                container: {
                    type: 'message',
                    id: mid,
                },
                rid,
                mid,
            });
        },
        rid,
        values: {}, // TODO: this is a hack to make the context work, but it should be removed
    };
};
exports.useMessageBlockContextValue = useMessageBlockContextValue;
